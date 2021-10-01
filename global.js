/***** Configurações do aplicativo *****/
var siteName = 'ProjetoDois';   // Define nome do site
var user;                       // Armazenará dados do usuário logado

$(document).ready(runApp);      // Quando documento estiver pronto, executa aplicativo

/***** Aplicativo principal *****/
function runApp() {

    loadPage('home');                           // Carrega página inicial
    $(document).on('click', 'a', routerLink);   // Monitora cliques nos links

}

// Carrega uma página completa
function loadPage(pagePath, pageName = '') {

    var page = {};                      // Armazena dados da rota
    var parts = pagePath.split('?');    // Divide a rota em partes

    // Gera rota para HTML
    if (parts.length == 1)                      // Se é uma rota simples
        page.url = `/${parts[0]}`;              // Define endereço da página
    else                                        // Se a rota contém variáveis após '?
        page.url = `/${parts[0]}?${parts[1]}`;  // Define endereço da página

    // Gera rotas para HTML, CSS e JS
    page.html = `/pages/${parts[0]}/${parts[0]}.html`;
    page.css = `/pages/${parts[0]}/${parts[0]}.css`;
    page.js = `/pages/${parts[0]}/${parts[0]}.js`;

    // Carrega componentes da página
    $('#pageCSS').load(page.css, () => {                        // Carrega CSS
        $('#pageHTML').load(page.html, () => {                  // Carrega HTML
            $.getScript(page.js, () => {                        // Carrega e executa JavaScript
                window.history.replaceState('', '', page.url);  // Atualiza URL da aplicação
            });
        });
    });
}

// Roteamento de links
function routerLink() {

    // Obtém atributos do link
    var href = $(this).attr('href');        // Obtém valor de 'href' do link clicado
    var target = $(this).attr('target');    // Obtém valor de 'target' do link clicado

    // Resolver âncoras
    if (href.substr(0, 1) == '#')           // Se o primeiro caractere é '#', é uma âncora
        return true;                        // Então, devolve controle para o HTML

    // É um link externo...
    if (
        target == '_blank'                  // ... se 'target="_blank"'
        || href.substr(0, 7) == 'http://'   // ou, se começa com 'http://'
        || href.substr(0, 8) == 'https://'  // ou, se começa com 'https://'
    ) return true;                          // Então, devolve controle para o HTML

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

// Formata uma 'system date' (YYYY-MM-DD HH:II:SS) para 'Br date' (DD/MM/YYYY HH:II:SS)
function getBrDate(dateString) {
    var p1 = dateString.split(' ');                 // Separa data e hora
    var p2 = p1[0].split('-');                      // Separa partes da data
    return `${p2[2]}/${p2[1]}/${p2[0]} ${p1[1]}`;   // Remonta partes da data e hora
}