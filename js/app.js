// ==================== MENU HAMBURGUER ====================
const menuToggle = document.querySelector('button#menu-toggle');
const menu = document.querySelector('nav#menu');

menuToggle.addEventListener('click', () => {
    const aberto = menu.classList.toggle('active');
    menuToggle.textContent = aberto ? "✖" : "☰";
    menuToggle.setAttribute('aria-expanded', String(aberto));
});

// ==================== EFEITO DIGITAÇÃO RODAPÉ ====================
const texto = 'const DevGabriel = () => "Compilando ideias, executando sonhos"';
const elemento = document.getElementById('assinatura');
const cursor = document.getElementById('cursor');
let i = 0;

function digitarFrase() {
    if (i < texto.length) {
        cursor.insertAdjacentText('beforebegin', texto.charAt(i));
        i++;
        setTimeout(digitarFrase, 100);
    }
}

window.addEventListener('click', () => {
    if (elemento.textContent.trim() === '|') {
        digitarFrase();
        setTimeout(() => cursor.style.display = 'none', 30000);
    }
}, { once: true });

// ==================== SPA ====================
const main = document.querySelector('#main-content');
const links = document.querySelectorAll('nav a');
const loader = document.getElementById('loader');
let isLoading = false;
const paginaInicial = 'sobre';
const pageCache = {}; // cache simples
const pageTitle = {
    sobre: 'Sobre Mim',
    curriculo: 'Currículo',
    projetos: 'Projetos',
    contato: 'Contato',
}

function atualizarTitulo(pagina) {
    const titulo = pageTitle[pagina] || (pagina.charAt(0).toUpperCase() + pagina.slice(1))
    document.title = `Portfólio | ${titulo}`
}

// ----------------- Loader -----------------
function showLoader() {
    loader.classList.add('show');
}

function hideLoader() {
    loader.classList.remove('show');
}

// ----------------- Carregar páginas -----------------
function carregar(pagina) {
    if (isLoading) return;
    isLoading = true;
    const inicioCarregamento = Date.now();
    showLoader();
    main.classList.remove('show'); // fade out

    setTimeout(() => {
        if (pageCache[pagina]) {
            main.innerHTML = pageCache[pagina];
            atualizarTitulo(pagina)
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => main.classList.add('show'), 50);

            const tempoMinimo = 250;
            const agora = Date.now();
            const tempoDecorrido = agora - inicioCarregamento;
            const esperar = Math.max(tempoMinimo - tempoDecorrido, 0);

            setTimeout(() => {
                hideLoader();
                isLoading = false;
            }, esperar);
            return;
        }

        fetch(`./pages/${pagina}.html`)
            .then(res => {
                if (!res.ok) throw new Error('HTTP ' + res.status);
                return res.text();
            })
            .then(html => {
                pageCache[pagina] = html;
                main.innerHTML = html;
                atualizarTitulo(pagina)
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setTimeout(() => main.classList.add('show'), 50);
            })
            .catch(err => {
            console.error(err);
            atualizarTitulo('Erro')
            main.innerHTML = `
            <div class="erro-carregamento">
            <h2>Ops! Não foi possível carregar esta página.</h2>
            <p>Verifique sua conexão ou tente novamente.</p>
            <button id="tentar-novamente">🔄 Tentar Novamente</button>
            </div>`

    document.getElementById('tentar-novamente').addEventListener('click', () => {
        carregar(pagina)
    });
})

            .finally(() => {
                const tempoMinimo = 250;
                const agora = Date.now();
                const tempoDecorrido = agora - inicioCarregamento;
                const esperar = Math.max(tempoMinimo - tempoDecorrido, 0);
                setTimeout(() => {
                    hideLoader();
                    isLoading = false;
                }, esperar);
            });
    }, 120);
}

// ----------------- Navegar -----------------
function navegar(pagina, addHistory = true) {
    // Atualiza hash
    if (addHistory) {
        history.pushState( { pagina }, '', `/${pagina}`)
    }

    // Fecha menu mobile se estiver aberto
    if (menu.classList.contains('active')) {
        menu.classList.remove('active');
        menuToggle.textContent = '☰';
        menuToggle.setAttribute('aria-expanded', 'false');
    }

    marcarAtivo(pagina);
    carregar(pagina);
}

// ----------------- Marcar link ativo -----------------
function marcarAtivo(pagina) {
    links.forEach(link => {
        const href = link.getAttribute('href').replace('./pages/', '').replace('.html', '');
        if (href === pagina) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        }
    });
}

// ----------------- Clique nos links -----------------
links.forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const pagina = link.getAttribute('href').replace('./pages/', '').replace('.html', '');
        navegar(pagina);
    });
});

// ----------------- Voltar / Avançar navegador -----------------
window.addEventListener('popstate', (event) => {
    const pagina = event.state?.pagina || paginaInicial
    navegar(pagina, false);
});

// ----------------- Carregar página inicial -----------------
let path = location.pathname.split('/').pop().replace('.html', '')
const inicial = path && pageTitle[path] ? path: paginaInicial
navegar(inicial, false)

// ----------------- Prefetch leve -----------------
function prefetchPages(list) {
    list.forEach(p => {
        if (!pageCache[p]) {
            fetch(`./pages/${p}.html`)
                .then(r => r.text())
                .then(t => pageCache[p] = t)
                .catch(err => console.warn("Falha no prefetch", p, err))
        }
    });
}
setTimeout(() => prefetchPages(['curriculo', 'projetos', 'contato']), 2000)