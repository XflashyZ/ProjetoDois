$(document).ready(runApp);

/** Aplicativo principal */
function runApp() {

    // Carrega página inicial
    loadPage('home', 'Página inicial');

    // Monitora cliques nos links
    $(document).on('click', 'a', routerLink);

}

// Carrega uma página completa
function loadPage(pagePath, pageName = '') {

    // Variáveis da função
    var path, page = {};

    // Divide rota em partes
    var parts = pagePath.split('/');

    // Gera rota para HTML
    if (parts.length == 1) {
        page.html = `/pages/${parts[0]}/${parts[0]}.html`;
    } else {
        page.html = `/pages/${parts[0]}/${parts[0]}.html?${parts[1]}`;
    }

    // Gera rotas para CSS e JS
    page.css = `/pages/${parts[0]}/${parts[0]}.css`;
    page.js = `/pages/${parts[0]}/${parts[0]}.js`;

    $('#pageCSS').load(page.css, () => {
        $('#pageHTML').load(page.html, () => {
            $.getScript(page.js, () => {
                if (pageName == '') page.title = 'ProjetoDois';
                else page.title = `ProjetoDois - ${pageName}`;
                $('title').text(page.title);
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
    if (href.substr(0, 1) == '#') return true;

    // Links externos
    else if (target == '_blank' || href.substr(0, 7) == 'http://' || href.substr(0, 8) == 'https://') return true;

    // Rotas (links internos)
    else loadPage(href);

    // Sai sem fazer nada
    return false;
}