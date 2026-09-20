document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       BOTÃO VOLTAR AO TOPO
    ========================================== */

    const topBtn = document.getElementById('topBtn');

    if (topBtn) {
        window.addEventListener('scroll', () => {
            topBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
        });

        topBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /* ==========================================
       VERIFICAÇÃO DOS VÍDEOS
    ========================================== */

    const videos = document.querySelectorAll('.video-missionario');

    videos.forEach((video) => {

        video.addEventListener('error', () => {

            if (video.dataset.erro === 'true') return;

            video.dataset.erro = 'true';

            const source = video.querySelector('source');
            const caminho = source ? source.getAttribute('src') : '';

            const aviso = document.createElement('div');

            aviso.className = 'video-erro';

            aviso.innerHTML = `
                <strong>Vídeo não encontrado</strong>
                <span>Verifique se o arquivo existe na pasta:</span>
                <code>${caminho}</code>
            `;

            video.style.display = 'none';
            video.parentNode.insertBefore(aviso, video);

        });

        /* Força o navegador a carregar o vídeo */
        video.load();

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

            const imagemAmpliada = document.createElement('img');

            imagemAmpliada.src = img.src;
            imagemAmpliada.alt = img.alt || 'Imagem ampliada';

            imagemAmpliada.style.maxWidth = '95%';
            imagemAmpliada.style.maxHeight = '95%';
            imagemAmpliada.style.width = 'auto';
            imagemAmpliada.style.height = 'auto';
            imagemAmpliada.style.objectFit = 'contain';
            imagemAmpliada.style.borderRadius = '15px';
            imagemAmpliada.style.cursor = 'default';

            modal.appendChild(imagemAmpliada);

            modal.addEventListener('click', (event) => {
                if (event.target === modal) {
                    modal.remove();
                }
            });

            imagemAmpliada.addEventListener('click', (event) => {
                event.stopPropagation();
            });

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
   VERSÃO DEFINITIVA
========================================== */

const carrosseis = document.querySelectorAll('.carousel');

carrosseis.forEach((carousel) => {

    const track = carousel.querySelector('.carousel-track');

    if (!track) return;


    /* ==========================================
       DESATIVA QUALQUER ANIMAÇÃO CSS ANTIGA
    ========================================== */

    track.style.animation = 'none';


    /* ==========================================
       VARIÁVEIS
    ========================================== */

    let posicao = 0;

    let velocidade = 0.6;

    let pausado = false;

    let larguraOriginal = 0;

    let ultimoTempo = performance.now();


    /* ==========================================
       DESCOBRIR O TAMANHO DO PRIMEIRO GRUPO
    ========================================== */

    function calcularLargura() {

        const imagens = track.querySelectorAll('img');

        if (imagens.length < 2) {
            larguraOriginal = track.scrollWidth;
            return;
        }


        /*
         * O HTML possui as fotos repetidas.
         *
         * Metade do conteúdo corresponde ao
         * primeiro conjunto.
         */

        larguraOriginal = track.scrollWidth / 2;

    }


    /* ==========================================
       MOVIMENTO CONTÍNUO
    ========================================== */

    function animar(tempoAtual) {

        const delta =
            tempoAtual - ultimoTempo;

        ultimoTempo = tempoAtual;


        if (!pausado && larguraOriginal > 0) {

            /*
             * Movimento independente da taxa
             * de atualização do monitor.
             */

            posicao -=
                velocidade * (delta / 16.67);


            /*
             * Quando terminar o primeiro grupo,
             * volta ao início.
             */

            if (
                Math.abs(posicao) >= larguraOriginal
            ) {

                posicao = 0;

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

        }
    );


    /* ==========================================
       CELULAR
    ========================================== */

    carousel.addEventListener(
        'touchstart',
        () => {

            pausado = true;

        },
        {
            passive:true
        }
    );


    carousel.addEventListener(
        'touchend',
        () => {

            setTimeout(() => {

                pausado = false;

            }, 800);

        },
        {
            passive:true
        }
    );


    /* ==========================================
       REAJUSTAR AO REDIMENSIONAR
    ========================================== */

    window.addEventListener(
        'resize',
        () => {

            calcularLargura();

        }
    );


    /* ==========================================
       ESPERAR AS IMAGENS
    ========================================== */

    function iniciar() {

        calcularLargura();

        /*
         * Pequeno atraso para garantir que
         * todas as dimensões das imagens
         * estejam disponíveis.
         */

        setTimeout(() => {

            calcularLargura();

            requestAnimationFrame(animar);

        }, 300);

    }


    if (document.readyState === 'complete') {

        iniciar();

    } else {

        window.addEventListener(
            'load',
            iniciar,
            {
                once:true
            }
        );

    }

});



});