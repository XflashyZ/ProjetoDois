/***** Configurações do aplicativo *****/
var siteName = 'ProjetoDois'; // Define nome do site
var user; // Armazenará dados do usuário logado

$(document).ready(runApp); // Quando documento estiver pronto, executa aplicativo

/***** Aplicativo principal *****/
function runApp() {

    loadPage('logout'); // Carrega página inicial

    $(document).on('click', '#login', login); // Monitora cliques no login
    $(document).on('click', 'a', routerLink); // Monitora cliques nos links
    $(document).on('click', '.modal', closeModal); // Monitora cliques no modal

    // Valida usuário logado
    firebase.auth().onAuthStateChanged((userData) => {
        if (userData) {
            user = userData
            $('#login').attr('href', 'profile');
            $('#login').attr('title', user.displayName);
            $('#login').html(`<img src="${user.photoURL}" alt="${user.displayName}"><span>Perfil</span>`);
            $('#login').attr('id', 'profile');
        }
    });
}

// Carrega uma página completa
function loadPage(pagePath, pageName = '') {

    var page = {}; // Armazena dados da rota
    var parts = pagePath.split('?'); // Divide a rota em partes

    // Gera rota para HTML
    if (parts.length == 1) // Se é uma rota simples
        page.url = `/${parts[0]}`; // Define endereço da página
    else // Se a rota contém variáveis após '?
        page.url = `/${parts[0]}?${parts[1]}`; // Define endereço da página

    // Gera rotas para HTML, CSS e JS
    page.html = `/pages/${parts[0]}/${parts[0]}.html`;
    page.css = `/pages/${parts[0]}/${parts[0]}.css`;
    page.js = `/pages/${parts[0]}/${parts[0]}.js`;

    // Carrega componentes da página
    $('#pageCSS').load(page.css, () => { // Carrega CSS
        $('#pageHTML').load(page.html, () => { // Carrega HTML
            $.getScript(page.js, () => { // Carrega e executa JavaScript
                window.history.replaceState('', '', page.url); // Atualiza URL da aplicação
            });
        });
    });
}

// Roteamento de links
function routerLink() {

    // Obtém atributos do link
    var href = $(this).attr('href'); // Obtém valor de 'href' do link clicado
    var target = $(this).attr('target'); // Obtém valor de 'target' do link clicado

    if (!href) return false

    // Resolver âncoras
    if (href.substr(0, 1) == '#') // Se o primeiro caractere é '#', é uma âncora
        return true; // Então, devolve controle para o HTML

    // É um link externo...
    if (
        target == '_blank' // ... se 'target="_blank"'
        || // ou
        href.substr(0, 7) == 'http://' // ou, se começa com 'http://'
        || // ou
        href.substr(0, 8) == 'https://' // ou, se começa com 'https://'
    ) return true; // Então, devolve controle para o HTML

    // Resolver links internos (rotas)
    loadPage(href);

    // Sai sem fazer nada
    return false;
}

// Processa título da página. Tag <title>...</title>
function setTitle(pageTitle = '') {
    var title; // Inicializa variável
    if (pageTitle == '') title = siteName; // Se não definiu um título, usa o nome do app
    else title = `${siteName} .:. ${pageTitle}`; // Senão, usa este formato
    $('title').text(title); // Escreve na tag <title>
}

// Formata uma 'system date' (YYYY-MM-DD HH:II:SS) para 'Br date' (DD/MM/YYYY HH:II:SS)
function getBrDate(dateString) {
    var p1 = dateString.split(' '); // Separa data e hora
    var p2 = p1[0].split('-'); // Separa partes da data
    return `${p2[2]}/${p2[1]}/${p2[0]} ${p1[1]}`; // Remonta partes da data e hora
}

// Gera a data atual em formato system date "YYYY-MM-DD HH:II:SS"
function getSystemDate() {
    var yourDate = new Date(); // Obtém a data atual do navegador
    var offset = yourDate.getTimezoneOffset(); // Obtém o fusohorário
    yourDate = new Date(yourDate.getTime() - (offset * 60 * 1000)); // Ajusta o fusohorário
    returnDate = yourDate.toISOString().split('T'); // Separa data da hora
    returnTime = returnDate[1].split('.'); // Separa partes da data
    return `${returnDate[0]} ${returnTime[0]}`; // Formata data como system date
}

// Faz login de usuário
function login() {

    logout();

    var provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth()
        .signInWithPopup(provider)
        .then((result) => {
            var modalText = `Olá ${result.user.displayName}!<br><br>Você já pode usar nosso conteúdo restrito...`;
            $('#modalLogin .modal-title').html('Bem-vinda(o)!');
            $('#modalLogin .modal-text').html(modalText);
            $('#modalLogin').show('fast');
            setTimeout(() => {
                $('#modalLogin').hide('fast');
            }, 15000);
        }).catch((error) => {
            console.error(`Ocorreram erros ao fazer login: ${error}`);
        });
}

// Fecha modal
function closeModal() {
    modalName = $(this).parent().attr('id');
    $(`#${modalName}`).hide('fast');
}
