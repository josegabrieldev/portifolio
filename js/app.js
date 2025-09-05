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
    i++
    setTimeout(digitarFrase, 100)
  }
}

window.addEventListener('click', () => {
  if (elemento.textContent.trim() === '|') {
    digitarFrase()
    setTimeout(() => cursor.style.display = 'none', 30000)
  }
}, { once: true })

// ---------------- SPA ----------------
const main = document.querySelector('#main-content')
const links = document.querySelectorAll('nav a')
const paginaInicial = 'sobre'

// Carregar conteúdo
function carregar(pagina) {
    main.classList.remove('mostrar')
    fetch(`./pages/${pagina}.html`)
    .then(res => res.text())
    .then(html => {
        main.innerHTML = html
        setTimeout(() => main.classList.add('mostrar'), 50)
    })
    .catch(err => {
      console.error(err)
      main.innerHTML = '<p>Erro ao carregar conteúdo.</p>'
    })
}

// Navegar
function navegar(pagina, addHistory = true) {
  carregar(pagina)
  if (addHistory) {
    history.pushState({ page: pagina }, '', `?page=${pagina}`)
  }
  marcarAtivo(pagina)
}

// Destacar link ativo
function marcarAtivo(pagina) {
  links.forEach(link => {
    let nome = link.getAttribute('href').replace('./pages/', '').replace('.html', '')
    link.classList.toggle('active', nome === pagina)
  })
}

// Clique nos links
links.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault()
    let nome = link.getAttribute('href').replace('./pages/', '').replace('.html', '')
    navegar(nome)
  })
})

// Voltar/avançar navegador
window.addEventListener('popstate', e => {
  let pagina = (e.state && e.state.page) || paginaInicial
  navegar(pagina, false)
})

// Carregar página inicial ao abrir
let params = new URLSearchParams(location.search)
let inicial = params.get('page') || paginaInicial
history.replaceState({ page: inicial }, '', `?page=${inicial}`)
navegar(inicial, false)
