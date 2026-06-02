const topBtn = document.getElementById('topBtn');

window.addEventListener('scroll', () => {

    if(window.scrollY > 300){

        topBtn.style.display = 'block';

    }else{

        topBtn.style.display = 'none';

    }

});

topBtn.addEventListener('click', () => {

    window.scrollTo({

        top:0,
        behavior:'smooth'

    });

});

document.querySelectorAll('.grid img').forEach(img=>{

    img.addEventListener('click',()=>{

        const modal = document.createElement('div');

        modal.style.position='fixed';
        modal.style.top='0';
        modal.style.left='0';
        modal.style.width='100%';
        modal.style.height='100%';
        modal.style.background='rgba(0,0,0,.95)';
        modal.style.display='flex';
        modal.style.justifyContent='center';
        modal.style.alignItems='center';
        modal.style.zIndex='9999';

        const image=document.createElement('img');

        image.src=img.src;
        image.style.maxWidth='90%';
        image.style.maxHeight='90%';

        modal.appendChild(image);

        modal.onclick=()=>modal.remove();

        document.body.appendChild(modal);

    });

});