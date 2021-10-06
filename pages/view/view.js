$(document).ready(() => {

    var id = location.search.replace('?', '');

    showArticle(id);

    showCommentForm(id);

    showComments(id);

});

function showArticle(id) {
    db.collection('articles').doc(id).get().then((doc) => {
        if (doc.exists) {
            art = doc.data();
            var artView = `
<h2>${art.title}</h2>                
<small class="block text-right margin-bottom"><em>Em ${art.brDate}.</em></small>
<div class="art-body">${art.text}</div>
            `;
            $('#artView').html(artView);
        } else {
            loadPage('home');
        }
    });
    return false;
}


function showCommentForm(id) {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {

            $('#commentForm').html(`
<form id="cForm" name="comment-form">
    <input type="hidden" name="article" id="commentArticle" value="${id}">
    <textarea id="commentText" placeholder="Comente aqui..."></textarea>
    <p>
        <button type="button" class="btn primary" id="commentSend" title="Enviar comentário">Enviar</button>
        <small class="grey">Suporta somente texto.</small>
    </p>
</form>
            `);

            $('#commentSend').click(commentSend);

        } else {
            $('#commentForm').html(`<blockquote>Logue-se para comentar!</blockquote>`);
        }
    });
}


function showComments(id) {
    db.collection('comments')
        .where('article', '==', id)
        .where('status', '==', 'ativo')
        .orderBy('date', 'desc')
        .onSnapshot((snapshot) => {
            commentList = '';

            console.log(snapshot.length)

            snapshot.forEach((doc) => {
                item = doc.data();
                item.name = item.displayName.split(' ')[0];
                item.brDate = getBrDate(item.date);
                commentList += `
<div class="comment-item">
    <div class="comment-autor-date">
        <img class="comment-image" src="${item.photoURL}" alt="${item.displayName}">
        <span>Por ${item.name} em ${item.brDate}.</span>
    </div>
    <div class="comment-text">${item.comment}</div>
</div>
  `;
            });
            $('#commentList').html(commentList);
        });
}


function commentSend() {
    var article = sanitizeString($('#commentArticle').val());
    var comment = sanitizeString($('#commentText').val());
    if (comment.length < 5) return false;
    var commentData = {
        article: article,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        uid: user.uid,
        date: getSystemDate(),
        comment: comment,
        status: 'ativo'
    };

    console.log(commentData)
    db.collection('comments').add(commentData)
        .then((docRef) => {
            if (docRef.id) {
                console.log(docRef.id);
            }
            return false;
        })
        .catch((error) => { console.error(error); });
}