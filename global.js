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

    // Caminho da rota
    var path;

    // Detecta variáveis
    var parts = pagePath.split('/');

    // Monta caminho da página
    if (parts.length !== 1)
        




        path = `/pages/${parts[0]}/${parts[0]}/${parts[1]}`;
    else
        path = `/pages/${pagePath}/${pagePath}`;

    // Carrega CSS da página
    $('#pageCSS').load(`${path}.css`, () => {

        // Carrega HTML da página
        $('#pageHTML').load(`${path}.html`, () => {

            // Carrega e executa JavaScript da página
            $.getScript(`${path}.js`, () => {
                $('title').text(`ProjetoDois - ${pageName}`);
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