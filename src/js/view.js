export let createMovieCard = (data) => {
    const card = `<div class='col-md-3 mb-2 col-lg-3'><div class='card'>
    <div class='view overlay'><img class='card-img-top' src='https://image.tmdb.org/t/p/w300/${data.poster_path} ' alt=' ${data.title} '><a href='' data-toggle='modal' data-target='#movieModal' onclick="openMovie( ${data.id} )"><div class='mask rgba-white-slight'></div></a></div>
    <div class='card-body px-2 py-2'><h6 class='card-title ellipsis-text mb-0' title='${data.original_title}'>${data.original_title}</h6></div>
    </div></div>`;
    return card;
}

export let createHTMLElement = (html) => {
    const template = document.createElement('template');
    template.innerHTML = html;
    return template.content.firstElementChild;
}