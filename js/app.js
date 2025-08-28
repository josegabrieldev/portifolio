// Botão de menu Hamburguer
const toggleBtn = document.querySelector('button#menu-toggle')
const menu = document.querySelector('nav#menu')

toggleBtn.addEventListener('click', () => {
    menu.classList.toggle('active')

    if(menu.classList.contains('active')) {
        toggleBtn.innerHTML = "&times"
    } else {
        toggleBtn.innerHTML = "&#9776;"
    }
})

// Efeito de digitação no Rodapé
const texto = 'const DevGabriel = () => "Compilando ideias, executando sonhos"'
const elemento = document.getElementById('assinatura')
let i = 0

function digitar() {
    if(i < texto.length) {
        elemento.textContent += texto.charAt(i)
        i++
        setTimeout(digitar, 100)
    } else {
        // Após digitar tudo, para o cursor por 2 minutos
        setTimeout(() => {
        elemento.style.borderRight = 'none'; // para o cursor
        // Após 2 minutos, reativa o cursor e apaga o texto
        setTimeout(() => {
        elemento.style.borderRight = '2px solid var(--cor-secundaria)';
        elemento.textContent = '';
        i = 0;
            // Após 5 segundos, começa a digitar novamente
        setTimeout(digitar, 5000);
        }, 120000); // 2 minutos
        }, 1000); // pequena pausa antes de parar o cursor
    }
}
digitar()