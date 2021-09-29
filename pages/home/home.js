// Inicializa variáveis
var pageTitle = '';
var artList = '<h2>Artigos Recentes</h2>';

$(document).ready(runPage);

// Aplicativo principal
function runPage() {

    // Detecta cliques nos cards
    $(document).on('click', '.card', viewArticle);

    // Altera o título da página
    setTitle(pageTitle);

    // Obtendo todos os artigos do banco de dados
    db.collection("articles").where('status', '==', 'ativo').orderBy('date', 'desc').onSnapshot((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // console.log(`${doc.id} => ${doc.data().img}`);

                // Armazena artigo em 'art'
                art = doc.data();

                artList += `

<div class="card" data-route="view/${doc.id}">
    <div class="card-img" style="background-image: url('${art.img}')"></div>
    <div class="card-content">
        <h3>${art.title}</h3>
        ${art.intro}
    </div>
</div>                

            `;

            });

            $('#artList').html(artList);
        });

}

// Abre o artigo completo
function viewArticle() {
    loadPage($(this).attr('data-route'));
}