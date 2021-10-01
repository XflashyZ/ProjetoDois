// Define o título da página
var pageTitle = 'Artigo';

$(document).ready(runPage);

function runPage() {

    // Obté o ID do artigo da URL
    const id = location.search.replace('?', '');

    // Obtém o artigo do banco de dados
    

    // Altera o título da página
    setTitle(pageTitle);

    console.log('Executando a view');

}