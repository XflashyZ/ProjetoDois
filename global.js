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
    const path = `/pages/${pagePath}/${pagePath}`;
    $('#pageCSS').load(`${path}.css`, () => {
        $('#pageHTML').load(`${path}.html`, () => {
            $.getScript(`${path}.js`, () => {
                $('title').text(`ProjetoDois - ${pageName}`);
            });
        });
    });
}

// Roteamento de links
function routerLink() {
    var href = $(this).attr('href');
    var target = $(this).attr('target');
    console.log(href, target);

    // Resolver âncoras
    

    if (target == '_blank') {
        window.open(href);
    } else {

    }
    return false;
}