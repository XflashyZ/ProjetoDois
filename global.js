/***** Configurações do aplicativo *****/
var siteName = "ProjetoDois"; // Define nome do site
var user; // Global que armazenará dados do usuário logado

$(document).ready(runApp); // Quando documento estiver pronto, executa aplicativo

/***** Aplicativo principal (Eventos) *****/
function runApp() {
  loadPage("home"); // Carrega página inicial

  $(document).on("click", "#login", login); // Monitora cliques no login
  $(document).on("click", "a", routerLink); // Monitora cliques nos links
  $(document).on("click", ".modal", closeModal); // Monitora cliques no modal

  // Se alguém fizer login/logout (observer)...
  firebase.auth().onAuthStateChanged((userData) => {
    if (userData) {
      // Se tem usuário logado
      user = userData; // Atualiza a global 'user' com dados do usuário

      // Atualiza view --> <nav>...</nav>
      $("#userInOut").html(`
<a id="profile" href="profile" class="user-logo" title="${user.displayName}">
  <img src="${user.photoURL}" alt="${user.displayName}"><span>Perfil</span>
</a>`);
    } else {
      // Se não tem usuário logado
      user = {}; // Esvazia a global 'user'

      // Atualiza view --> <nav>...</nav>
      $("#userInOut").html(`
<a id="login" class="user-logo" title="Entrar / Login">
  <img src="/img/user.png" alt="Logue-se!"><span>Entrar</span>
</a>`);
    }
  });
}

// Carrega uma página completa
function loadPage(pagePath, pageName = "") {
  var page = {}; // Armazena dados da rota
  var parts = pagePath.split("?"); // Divide a rota em partes

  // Gera endereço da página
  if (parts.length == 1) {
    // Se é uma rota simples
    page.url = `/${parts[0]}`; // Define endereço da página
  } else {
    // Se a rota contém variáveis (search) após '?'
    page.url = `/${parts[0]}?${parts[1]}`; // Define endereço da página
  }

  // Gera caminhos para HTML, CSS e JS
  page.html = `/pages/${parts[0]}/${parts[0]}.html`;
  page.css = `/pages/${parts[0]}/${parts[0]}.css`;
  page.js = `/pages/${parts[0]}/${parts[0]}.js`;

  // Carrega CSS da página
  $("#pageCSS").load(page.css, () => {

    // Carrega HTML da página
    $("#pageHTML").load(page.html, () => {

      // Carrega e executa JavaScript
      $.getScript(page.js, () => {

        // Atualiza URL da aplicação
        window.history.replaceState("", "", page.url);
      });
    });
  });
}

// Roteamento de links
// Observe o uso de intenso do 'return' para sair do app, caso o requisito seja cumprido
function routerLink() {
  // Obtém atributos do link
  var href = $(this).attr("href"); // Obtém valor de 'href' do link clicado
  var target = $(this).attr("target"); // Obtém valor de 'target' do link clicado

  // Se 'href' não existe OU (||) é vazio, não faz nada
  if (!href || href == "") return false;

  // Se o primeiro caractere é '#', é uma âncora
  // Então, devolve controle para o HTML
  if (href.substr(0, 1) == "#") return true;

  // Se 'target="_blank" OU href="http://..." OU href="https://...", é um link externo...
  // Então, devolve controle para o HTML
  if (
    target == "_blank" ||
    href.substr(0, 7) == "http://" ||
    href.substr(0, 8) == "https://"
  )
    return true;

  // Se é um link interno, uma rota, processa ela...
  loadPage(href);

  // Sai sem fazer mais nada
  return false;
}

// Processa título da página. Tag <title>...</title>
function setTitle(pageTitle = "") {
  var title; // Inicializa variável
  // Se não definiu um título, usa o nome do app
  if (pageTitle == "") title = siteName;
  // Senão, usa este formato
  else title = `${siteName} .:. ${pageTitle}`;
  $("title").text(title); // Escreve na tag <title>
}

// Formata uma 'system date' (YYYY-MM-DD HH:II:SS) para 'Br date' (DD/MM/YYYY HH:II:SS)
function getBrDate(dateString) {
  var p1 = dateString.split(" "); // Separa data e hora
  var p2 = p1[0].split("-"); // Separa partes da data
  return `${p2[2]}/${p2[1]}/${p2[0]} ${p1[1]}`; // Remonta partes da data e hora
}

// Gera a data atual em formato system date "YYYY-MM-DD HH:II:SS"
function getSystemDate() {
  var yourDate = new Date(); // Obtém a data atual do navegador
  var offset = yourDate.getTimezoneOffset(); // Obtém o fusohorário
  yourDate = new Date(yourDate.getTime() - offset * 60 * 1000); // Ajusta o fusohorário
  returnDate = yourDate.toISOString().split("T"); // Separa data da hora
  returnTime = returnDate[1].split("."); // Separa partes da data
  return `${returnDate[0]} ${returnTime[0]}`; // Formata data como system date
}

// Faz login de usuário
function login() {
  logout(); // Força logout
  var provider = new firebase.auth.GoogleAuthProvider(); // Seleciona o provedor de autenticação
  // Autenticação usando 'popup', a mais básica que existe
  firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
      // Se logou, exibe um modal cumprimentando o usuário
      var modalText = `<strong>Olá ${result.user.displayName}!</strong><br><br>Você já pode usar nosso conteúdo restrito...`;
      $("#modalLogin .modal-title").html("Bem-vinda(o)!");
      $("#modalLogin .modal-text").html(modalText);
      $("#modalLogin").show("fast");

      // Fecha o modal em 15 segundos (15000 ms)
      setTimeout(() => {
        $("#modalLogin").hide("fast");
      }, 15000);
    })
    .catch((error) => {
      console.error(`Ocorreram erros ao fazer login: ${error}`);
    });
}

// Fecha modal
function closeModal() {
  modalName = $(this).parent().attr("id"); // Obtém o ID do pai do modal clicado
  $(`#${modalName}`).hide("fast"); // Oculta o pai do modal clicado
  return false;
}

// Logout de usuario
function logout() {
  // Logout padrão do Firebase
  firebase
    .auth()
    .signOut()
    .then(() => {
      // Após logout, retorna para a 'home'
      loadPage("home");
    });
}

// Sanitiza campos de formulário
function sanitizeString(stringValue, stripTags = true) {
  if (stripTags) stringValue = stringValue.replace(/<[^>]*>?/gm, ""); // Remove todas as tags HTML
  return stringValue.replace(/\n/g, "<br />").trim(); // Quebras de linha viram <br>
}









// Processa envio do formulário
function sendComment() {

  console.log('salvando');

  // Obtém comentário digitado e sanitiza
  var commentText = sanitizeString($('#commentText').val());

  // Monta documento para o banco de dados
  var commentData = {
    article: commentArticle,                // Id do artigo que esta sendo comentado
    displayName: commentUser.displayName,   // Nome do comentarista
    email: commentUser.email,               // E-mail do comentarista
    photoURL: commentUser.photoURL,         // Foto do comentarista
    uid: commentUser.uid,                   // Id do comentarista
    date: getSystemDate(),                  // Data do comentário em 'system date'
    comment: commentText,                   // Comentário enviado
    status: 'ativo'                         // Se usar pré-moderação escreva 'inativo'
  };

  // Salva no database
  db.collection('comments').add(commentData)
    .then(() => {

      // Se deu certo, exibe 'modal'
      $('#modalComment').show('fast');

      //  Limpa campo de comentário
      $('#commentText').val('');

      // Fecha o modal em 15 segundos (15000 ms)
      setTimeout(() => {
        $("#modalComment").hide('fast');
      }, 15000);
    })
    .catch((error) => {

      // Se deu errado, exibe mensagem de erro no console
      console.error(`Ocorreu erro ao salvar no DB: ${error}`);
    });

  // Conclui sem fazer mais nada
  return false;
}


// Exibe comentários deste artigo
function showComments(articleId) {

  db.collection('comments')
    .where('article', '==', articleId)
    .where('status', '==', 'ativo')
    .orderBy('date', 'desc')
    .onSnapshot((querySnapshot) => {

      // Inicializa lista de artigos
      var commentList = '';

      // Obtém um artigo por loop
      querySnapshot.forEach((doc) => {

        // Armazena dados do artigo em 'cData'
        cData = doc.data();

        // Primeiro nome do usuário
        firstName = cData.displayName.split(' ');

        // Formata a date
        brDate = getBrDate(cData.date);

        // Monta lista de artigos
        commentList += `
<div class="comment-item">
  <div class="comment-autor-date">
      <img class="comment-image" src="${cData.photoURL}" alt="${cData.displayName}">
      <span>Por ${firstName[0]} em ${brDate}.</span>
  </div>
  <div class="comment-text">${cData.comment}</div>
</div>
          `;
      });

      // Atualiza a view com a lista de artigos
      $('#commentList').html(commentList);
      commentList = '';
    });

}