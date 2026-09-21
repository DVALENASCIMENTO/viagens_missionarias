document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       BOTÃO VOLTAR AO TOPO
    ========================================== */

    const topBtn = document.getElementById('topBtn');

    if (topBtn) {

        window.addEventListener('scroll', () => {

            topBtn.style.display =
                window.scrollY > 300 ? 'block' : 'none';

        });

        topBtn.addEventListener('click', () => {

            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

        });

    }


    /* ==========================================
       VÍDEOS YOUTUBE
    ========================================== */

    /*
     * .video-missionario é o contêiner dos vídeos.
     * O conteúdo real é o iframe do YouTube.
     *
     * Não usamos video.load(), pois isso causaria
     * erro quando .video-missionario for uma <div>.
     */

    const videos = document.querySelectorAll(
        '.video-missionario iframe'
    );

    videos.forEach((iframe) => {

        iframe.setAttribute('loading', 'lazy');

    });


    /* ==========================================
       MODAL / AMPLIAÇÃO DAS IMAGENS
    ========================================== */

    const imagens = document.querySelectorAll('.grid img');

    imagens.forEach((img) => {

        img.style.cursor = 'pointer';

        img.addEventListener('click', () => {

            const modal = document.createElement('div');

            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.width = '100%';
            modal.style.height = '100%';
            modal.style.background = 'rgba(0, 0, 0, 0.95)';
            modal.style.display = 'flex';
            modal.style.justifyContent = 'center';
            modal.style.alignItems = 'center';
            modal.style.padding = '20px';
            modal.style.boxSizing = 'border-box';
            modal.style.zIndex = '9999';
            modal.style.cursor = 'zoom-out';

            const imagemAmpliada =
                document.createElement('img');

            imagemAmpliada.src = img.src;

            imagemAmpliada.alt =
                img.alt || 'Imagem ampliada';

            imagemAmpliada.style.maxWidth = '95%';
            imagemAmpliada.style.maxHeight = '95%';
            imagemAmpliada.style.width = 'auto';
            imagemAmpliada.style.height = 'auto';
            imagemAmpliada.style.objectFit = 'contain';
            imagemAmpliada.style.borderRadius = '15px';
            imagemAmpliada.style.cursor = 'default';

            modal.appendChild(imagemAmpliada);


            /* Fechar clicando fora da imagem */

            modal.addEventListener('click', (event) => {

                if (event.target === modal) {

                    modal.remove();

                }

            });


            /* Impede que o clique na imagem feche o modal */

            imagemAmpliada.addEventListener(
                'click',
                (event) => {

                    event.stopPropagation();

                }
            );


            document.body.appendChild(modal);

        });

    });


    /* ==========================================
       FECHAR MODAL COM ESC
    ========================================== */

    document.addEventListener('keydown', (event) => {

        if (event.key === 'Escape') {

            const modal = document.querySelector(
                'body > div[style*="z-index: 9999"]'
            );

            if (modal) {

                modal.remove();

            }

        }

    });


    /* ==========================================
       CARROSSEL AUTOMÁTICO DE FOTOS
       LOOP INFINITO
    ========================================== */

    const carrosseis =
        document.querySelectorAll('.carousel');

    carrosseis.forEach((carousel) => {

        const track =
            carousel.querySelector('.carousel-track');

        if (!track) {
            return;
        }


        /* ==========================================
           VARIÁVEIS
        ========================================== */

        let posicao = 0;

        const velocidade = 0.6;

        let pausado = false;

        let larguraOriginal = 0;

        let ultimoTempo = performance.now();


        /* ==========================================
           CALCULAR LARGURA DO PRIMEIRO CONJUNTO
        ========================================== */

        function calcularLargura() {

            const imagens =
                track.querySelectorAll('img');

            if (imagens.length < 2) {

                larguraOriginal = 0;

                return;

            }


            /*
             * As imagens precisam estar duplicadas
             * no HTML para que o loop seja contínuo.
             *
             * Em vez de usar scrollWidth / 2,
             * calculamos exatamente a largura do
             * primeiro conjunto de imagens.
             */

            const quantidade =
                imagens.length / 2;


            /*
             * Verifica se a quantidade de imagens
             * é realmente par.
             */

            if (!Number.isInteger(quantidade)) {

                larguraOriginal = 0;

                console.warn(
                    'Carrossel: as imagens não estão duplicadas corretamente.'
                );

                return;

            }


            let largura = 0;


            for (let i = 0; i < quantidade; i++) {

                largura += imagens[i].offsetWidth;

            }


            /*
             * Obtém o espaço entre as imagens.
             */

            const estilo =
                window.getComputedStyle(track);

            const gap =
                parseFloat(
                    estilo.columnGap ||
                    estilo.gap
                ) || 0;


            /*
             * Soma os espaços entre as imagens
             * do primeiro conjunto.
             */

            if (quantidade > 1) {

                largura +=
                    gap * (quantidade - 1);

            }


            larguraOriginal = largura;


            /*
             * Segurança.
             */

            if (larguraOriginal <= 0) {

                larguraOriginal = 0;

            }

        }


        /* ==========================================
           ANIMAÇÃO
        ========================================== */

        function animar(tempoAtual) {

            const delta =
                tempoAtual - ultimoTempo;

            ultimoTempo = tempoAtual;


            if (
                !pausado &&
                larguraOriginal > 0
            ) {

                posicao -=
                    velocidade *
                    (delta / 16.67);


                /*
                 * Quando chega ao final do primeiro
                 * conjunto, retorna exatamente a largura
                 * equivalente.
                 */

                if (
                    Math.abs(posicao) >=
                    larguraOriginal
                ) {

                    posicao +=
                        larguraOriginal;

                }


                track.style.transform =
                    `translate3d(${posicao}px, 0, 0)`;

            }


            requestAnimationFrame(animar);

        }


        /* ==========================================
           PAUSAR COM MOUSE
        ========================================== */

        carousel.addEventListener(
            'mouseenter',
            () => {

                pausado = true;

            }
        );


        carousel.addEventListener(
            'mouseleave',
            () => {

                pausado = false;

                ultimoTempo =
                    performance.now();

            }
        );


        /* ==========================================
           CONTROLE NO CELULAR
        ========================================== */

        carousel.addEventListener(
            'touchstart',
            () => {

                pausado = true;

            },
            {
                passive: true
            }
        );


        carousel.addEventListener(
            'touchend',
            () => {

                setTimeout(() => {

                    pausado = false;

                    ultimoTempo =
                        performance.now();

                }, 800);

            },
            {
                passive: true
            }
        );


        /* ==========================================
           REDIMENSIONAMENTO DA TELA
        ========================================== */

        window.addEventListener(
            'resize',
            () => {

                calcularLargura();

            }
        );


        /* ==========================================
           INICIAR CARROSSEL
        ========================================== */

        function iniciarCarrossel() {

            calcularLargura();

            posicao = 0;

            ultimoTempo =
                performance.now();

            requestAnimationFrame(animar);

        }


        /* ==========================================
           AGUARDAR AS IMAGENS
        ========================================== */

        const imagens =
            track.querySelectorAll('img');


        if (imagens.length === 0) {

            console.warn(
                'Carrossel: nenhuma imagem encontrada.'
            );

            return;

        }


        let carregadas = 0;


        function imagemCarregada() {

            carregadas++;


            if (
                carregadas ===
                imagens.length
            ) {

                iniciarCarrossel();

            }

        }


        imagens.forEach((img) => {

            /*
             * Imagem já carregada.
             */

            if (img.complete) {

                imagemCarregada();

            } else {

                /*
                 * Imagem carregada normalmente.
                 */

                img.addEventListener(
                    'load',
                    imagemCarregada,
                    {
                        once: true
                    }
                );


                /*
                 * Mesmo se uma imagem apresentar erro,
                 * não impede o carrossel de iniciar.
                 */

                img.addEventListener(
                    'error',
                    imagemCarregada,
                    {
                        once: true
                    }
                );

            }

        });

    });

});