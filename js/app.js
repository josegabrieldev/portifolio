// Botão de menu Hamburguer
const menuToggle = document.querySelector('button#menu-toggle')
const menu = document.querySelector('nav#menu')

menuToggle.addEventListener('click', () => {
    menu.classList.toggle('active')
    menuToggle.textContent = menu.classList.contains("active") ? "✖" : "☰"
})

// Efeito de digitação no Rodapé
const texto = 'const DevGabriel = () => "Compilando ideias, executando sonhos"'
const elemento = document.getElementById('assinatura')
const cursor = document.getElementById('cursor')
let i = 0

function digitarFrase() {
    if (i < texto.length) {
        cursor.insertAdjacentText('beforebegin', texto.charAt(i))
        tocarSom()
        i++
        setTimeout(digitarFrase, 100)
    }
}

function tocarSom() {
    const audio = new Audio('assets/sounds/keyboard-typing.mp3')
    audio.volume = 0.2
    audio.play().catch(e => {
        console.warn("Som bloqueado ou falhou:", e)
    })
}

window.addEventListener('click', () => {
    if (elemento.textContent.trim() === '|') {
        digitarFrase()
        setTimeout(() => {
            cursor.style.display = 'none'
        }, 30000)
    }
}, { once: true })
