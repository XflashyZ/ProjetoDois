// Define o título da página
var pageTitle = 'Sobre...';

$(document).ready(runPage);

function runPage() {

    // Altera o título da página
    setTitle(pageTitle);

    $(document).on('click', '#logout', runLogout);

}

function runLogout() {

}