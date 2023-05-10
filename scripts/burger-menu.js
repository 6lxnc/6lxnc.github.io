const openBtn = document.querySelector('.open-mobile-menu')
const closeBtn = document.querySelector('.close-mobile-menu')
const header = document.querySelector('#header')

openBtn.addEventListener('click', () => {
    header.classList.add('opened')
    document.body.classList.add('mobile-menu')
})

closeBtn.addEventListener('click', () => {
    header.classList.remove('opened')
    document.body.classList.remove('mobile-menu')
})