let ulForm = null;
let formContato = null;
const overlayBackdrop = document.getElementById("overlay-backdrop");
const overlayCard = document.getElementById("overlay-card");
const overlayFecharX = document.getElementById("overlay-btn-fechar-x");
const overlayTitulo = document.getElementById("overlay-titulo");
const overlayBolinha = document.getElementById("overlay-bolinha");
const overlayMensagem = document.getElementById("overlay-mensagem");
const overlayBtnFechar = document.getElementById("btn-fechar-overlay");
const overlayBtnTentarNovamente = document.getElementById(
  "tentar-novamente-overlay",
);
const overlayContador = document.getElementById("overlay-contador");

document.addEventListener("pagina-carregada", (event) => {
  if (event.detail.pagina === "contato") {
    inicializacaoFormularioDeContato();
  }
});

async function handleSubmit(e) {
  e.preventDefault();
  const dados = new FormData(e.target);
  const nome = dados.get("nome").trim();
  const email = dados.get("email").trim();
  const mensagem = dados.get("mensagem").trim();

  const formularioValido = validarFormulario(nome, email, mensagem);
  if (formularioValido) {
    try {
      const urlServidor = e.target.action;
      const resposta = await fetch(urlServidor, {
        headers: { Accept: "application/json" },
        method: "POST",
        body: dados,
      });

      if (resposta.ok) {
        mostrarOverlaySucesso();
      } else {
        mostrarOverlayErro("Não foi possível enviar sua mensagem. Verifique sua conexão e tente novamente.");
      }
    } catch (error) {
      mostrarOverlayErro("Sem conexão. Verifique sua internet e tente novamente.");
    }
  } else {
    // Container de erro esta sendo exibido usando css no arquivo busque por ".contato .form-lista-erro:not(:empty)".
  }
}

function mostrarOverlaySucesso() {
  overlayTitulo.textContent = "Mensagem enviada!";
  overlayMensagem.textContent = "Entrarei em contato em breve.";
  overlayBolinha.classList.add('status-sucesso');
  overlayBtnTentarNovamente.classList.add('escondido');
  iniciarContador(10, fecharOverlay);
  overlayBackdrop.classList.remove('overlay-oculto');
  setTimeout(() => {
    overlayBackdrop.classList.add('overlay-visivel');
  },50)
}

function mostrarOverlayErro(mensagem) {
  overlayTitulo.textContent = "Erro ao enviar!";
  overlayMensagem.textContent = mensagem;
  overlayBolinha.classList.add('status-erro');
  iniciarContador(15, fecharOverlay);
  overlayBackdrop.classList.remove('overlay-oculto');
  setTimeout(() => {
    overlayBackdrop.classList.add('overlay-visivel')
  }, 50)
}

function fecharOverlay() {
  overlayBackdrop.classList.remove("overlay-visivel");
  setTimeout(() => {
    overlayBackdrop.classList.add("overlay-oculto");
    overlayBolinha.classList.remove("bolinha-sucesso", "bolinha-erro");
  }, 300);
}

function iniciarContador(segundos, aoZerar) {
  overlayContador.textContent = segundos;
  let tempoContador = segundos;
  const intervalo = setInterval(() => {
    tempoContador = tempoContador - 1;
    overlayContador.textContent = tempoContador
    if (tempoContador === 0) {
      clearInterval(intervalo);
      aoZerar();
    }
  }, 1000);
}

function inicializacaoFormularioDeContato() {
  ulForm = document.getElementById("form-lista-erro");
  formContato = document.getElementById("form-contato");
  formContato.removeEventListener("submit", handleSubmit);
  formContato.addEventListener("submit", handleSubmit);

  overlayFecharX.addEventListener('click', fecharOverlay);
  overlayBtnFechar.addEventListener('click', fecharOverlay);
  overlayBtnTentarNovamente.addEventListener('click', () => {
    fecharOverlay();
    formContato.requestSubmit();
  })
}

function validarFormulario(nome, email, mensagem) {
  const formErros = [];
  ulForm.innerHTML = "";
  if (nome === "" || nome.length < 2) {
    formErros.push("Nome vazio ou muito curto");
  }

  if (nome.length > 60) {
    formErros.push("Nome muito grande");
  }

  if (email === "" || email.length < 6) {
    formErros.push("Email inválido ou muito curto");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    formErros.push("Formato esperado seuusuario@dominio.com");
  } else if (email.length > 254) {
    formErros.push("Email muito longo");
  }

  if (mensagem === "" || mensagem.length < 10) {
    formErros.push("Mensagem vazia ou muito curta");
  }

  if (mensagem.length > 1000) {
    formErros.push("Mensagem longa demais");
  }

  if (formErros.length > 0) {
    formErros.forEach((erro) => {
      const li = document.createElement("li");
      const icone = document.createElement("i");
      const span = document.createElement("span");
      icone.classList.add("fa-solid", "fa-x");
      span.textContent = erro;
      li.appendChild(icone);
      li.appendChild(span);
      ulForm.appendChild(li);
    });
  }

  return !ulForm.children.length;
}
