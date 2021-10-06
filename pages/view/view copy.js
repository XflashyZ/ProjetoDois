// Formulário de comentário
var commentForm = `
<form id="cForm" name="comment-form">
    <textarea id="commentText" placeholder="Comente aqui..."></textarea>
    <p>
        <button type="submit" class="btn primary" id="commentSend" title="Enviar comentário">Enviar</button>
        <small class="grey">Suporta somente texto.</small>
    </p>
</form>
`;

// Dados do usuário comentarista
var commentUser = {};

// Id do artigo sendo comentado
var commentArticle;

// Mensagem para quem não está logado
var commentMsg = `<blockquote>Logue-se para comentar!</blockquote>`;

$(document).ready(() => {

    // Obtém o ID do artigo da URL
    const id = location.search.replace('?', '');

    // Obtém o artigo do banco de dados
    db.collection('articles')                       // Consulta coleção 'articles'
        .doc(id)                                    // ID do artigo a ser obtido
        .onSnapshot((doc) => {                      // Pull do artigo
            if (doc.exists) {                       // Se artigo existe
                var art = doc.data();               // Importa dados em 'art'
                art.brDate = getBrDate(art.date);   // Converte a data do artigo em pt-br
                setTitle(art.title);                // Altera o título da página

                // Torna o id do artigo global
                commentArticle = doc.id;

                // Montando a 'view' do artigo.
                var artView = `
<h2>${art.title}</h2>                
<small class="block text-right margin-bottom"><em>Em ${art.brDate}.</em></small>
<div class="art-body">${art.text}</div>`;

                $('#artView').html(artView);        // Atualiza a 'view' o artigo

                /***** Comentários *****/
                // Monitora autenticação de usuário (observer)
                firebase.auth().onAuthStateChanged((userData) => {

                    // Usuário logado
                    if (userData) {

                        // Exporta dados do usuário
                        commentUser = userData;

                        // Exibe formulário
                        $('#commentForm').html(commentForm);

                        // Monitora envio do formulário
                        $(document).on('submit', '#cForm', sendComment);

                    } else {

                        // Mensagem pedindo para logar
                        $('#commentForm').html(commentMsg);
                    }
                });

                // Exibe comentários deste artigo
                showComments(doc.id);

            } else {                                // Se não tem artigo
                loadPage('home');                   // Volta para página de artigos
            }
        });
});