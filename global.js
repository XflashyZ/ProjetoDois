/***** Configurações do aplicativo *****/

// Nome do site
var siteName = 'ProjetoDois';

// Armazena dados do usuário logado
var user;

// Quando documento estiver pronto, executa JavaScript
$(document).ready(runApp);

/** Aplicativo principal */
function runApp() {

    // Carrega página inicial
    loadPage('home');

    // Monitora cliques nos links
    $(document).on('click', 'a', routerLink);

}

// Carrega uma página completa
function loadPage(pagePath, pageName = '') {

    // Variáveis da função
    var page = {};

    // Divide a rota em partes
    var parts = pagePath.split('?');

    // Gera rota para HTML
    if (parts.length == 1) {
        page.html = `/pages/${parts[0]}/${parts[0]}.html`;
        page.url = `/${parts[0]}`;
    } else {
        page.html = `/pages/${parts[0]}/${parts[0]}.html?${parts[1]}`;
        page.url = `/${parts[0]}?${parts[1]}`;
    }

    // Gera rotas para CSS e JS
    page.css = `/pages/${parts[0]}/${parts[0]}.css`;
    page.js = `/pages/${parts[0]}/${parts[0]}.js`;

    // Carrega componentes da página
    $('#pageCSS').load(page.css, () => {
        $('#pageHTML').load(page.html, () => {
            $.getScript(page.js, () => {

                // Atualiza URL da aplicação
                window.history.replaceState('', '', page.url);
            });
        });
    });
}

// Roteamento de links
function routerLink() {

    // Obtém atributos do link
    var href = $(this).attr('href');
    var target = $(this).attr('target');

    // Resolver âncoras
    if (href.substr(0, 1) == '#')           // Se o primeiro caractere é '#'
        return true;                        // Devolve controle para o HTML


    // É um link externo...
    if (
        target == '_blank'                  // ... se target="_blank"
        || href.substr(0, 7) == 'http://'   // ou, se começa com http://
        || href.substr(0, 8) == 'https://'  // ou, se começa com https://
    ) return true;                          // Devolve controle para o HTML

    // Resolver links internos (rotas)
    loadPage(href);

    // Sai sem fazer nada
    return false;
}

// Processa título da página. Tag <title>...</title>
function setTitle(pageTitle = '') {
    var title;                                      // Inicializa variável
    if (pageTitle == '') title = siteName;          // Se não definiu um título, usa o nome do app
    else title = `${siteName} .:. ${pageTitle}`;    // Senão, usa este formato
    $('title').text(title);                         // Escreve na tag <title>
}