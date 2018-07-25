import { store } from './stateManagement';
const key = '289e84f4fe34381b97017830c61a59c7';
const movieUrl = `https://api.themoviedb.org/3/discover/movie?language=en-US&include_adult=false&api_key=${key}`;
const searchMovieUrl = `https://api.themoviedb.org/3/search/movie?language=en-US&include_adult=false&api_key=${key}`;

const serverURL = 'http://localhost:3000/collections/';

function createMovieCard(data) {
  const card = `<div class='col-md-3 mb-2 col-lg-3'><div class='card'>
  <div class='view overlay'><img class='card-img-top' src='https://image.tmdb.org/t/p/w300/${data.poster_path} ' alt=' ${data.title} '><a href='' data-toggle='modal' data-target='#movieModal' onclick="openMovie( ${data.id} )"><div class='mask rgba-white-slight'></div></a></div>
  <div class='card-body px-2 py-2'><h6 class='card-title ellipsis-text mb-0' title='${data.original_title}'>${data.original_title}</h6></div>
  </div></div>`;
  return card;
}

export function getMovieService(queryString, divID, searchKeyword) {
  const xhttp = new XMLHttpRequest();
  let link;
  if (queryString === 'popular') {
    link = `${movieUrl}&sort_by=popularity.desc`;
  } else if (queryString === 'search') {
    link = `${searchMovieUrl}&query=${searchKeyword}`;
  }
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      const fetchedData = JSON.parse(this.responseText);
      const results = fetchedData.results;
      for (const movie of results) {
        document.getElementById(divID).appendChild(createHTMLElement(createMovieCard(movie)));
      }
    }
  };
  xhttp.open('GET', link, true);
  xhttp.send();
}

function createHTMLElement(html) {
  const template = document.createElement('template');
  template.innerHTML = html;
  return template.content.firstElementChild;
}

window.openMovie = function (movieID) {
  const url = `https://api.themoviedb.org/3/movie/${movieID}?api_key=${key}`;
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      const data = JSON.parse(this.responseText);
      document.getElementById('movieTitle').innerHTML = data.original_title;
      loadCollectionsModal(movieID).then((collectionData) => {
        const modalHTML = `<div class='row'><div class='col-sm-5'><img class='img-fluid' src='https://image.tmdb.org/t/p/w500${data.poster_path}' alt='${data.original_title}'></div><div class='col-sm-7'><h4 class='mb-0 text-secondary font-weight-bold'>${data.original_title}</h4><p class='mb-2 text-muted'>${data.tagline}</p><div>Release Date: <strong>${data.release_date}</strong></div><p><strong>Overview: </strong>${data.overview}</p><h5 class='font-weight-bold'>Add/Remove movie</h5><div class='row'>${collectionData}</div></div>`;
        document.getElementById('movieDetails').innerHTML = modalHTML;
      });
    }
  };
  xhttp.open('GET', url, true);
  xhttp.send();
};

function loadCollectionsModal(movieId) {
  return new Promise(((resolve, reject) => {
    const xhttp = new XMLHttpRequest();
    let collectionHTML = '';
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        const data = JSON.parse(this.responseText);
        for (let i = 0; i < data.length; i++) {
          collectionHTML += `<div class='col-sm-6'><div class='border p-1 mb-1'><div class='custom-control custom-checkbox'><input type='checkbox' onclick='addRemoveMovieToCollection(${data[i].id},${movieId})' class='custom-control-input' id='collection${data[i].id}'`;
          const index = data[i].movies.indexOf(movieId);
          if (index > -1) {
            collectionHTML += 'checked';
          }
          collectionHTML += `><label class='custom-control-label' for='collection${data[i].id}'>${data[i].name}</label></div></div></div>`;
        }
        resolve(collectionHTML);
      }
    };
    xhttp.open('GET', serverURL, true);
    xhttp.send();
  }));
}

window.addRemoveMovieToCollection = function (collectionId, movieId) {
  const checkBox = document.getElementById(`collection${collectionId}`);
  if (checkBox.checked === true) {
    addMovie(collectionId, movieId);
  } else {
    removeMovie(collectionId, movieId);
  }
};

function addMovie(collectionId, movieId) {
  getMoviesList(collectionId).then((movieList) => {
    var movieList = movieList;
    const url = serverURL + collectionId;
    movieList.push(movieId);
    const xhttp = new XMLHttpRequest();
    xhttp.open('PATCH', url, true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        getCollectionData();
      }
    };
    const data = JSON.stringify({ movies: movieList });
    xhttp.send(data);
  });
}

function removeMovie(collectionId, movieId) {
  getMoviesList(collectionId).then((movieList) => {
    var movieList = movieList;
    const url = serverURL + collectionId;
    const index = movieList.indexOf(movieId);
    if (index > -1) {
      movieList.splice(index, 1);
    }
    const xhttp = new XMLHttpRequest();
    xhttp.open('PATCH', url, true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        getCollectionData();
      }
    };
    const data = JSON.stringify({ movies: movieList });
    xhttp.send(data);
  });
}

function getMoviesList(collectionId) {
  return new Promise(((resolve, reject) => {
    const url = serverURL + collectionId;
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        const data = JSON.parse(this.responseText);
        resolve(data.movies);
      }
    };
    xhttp.open('GET', url, true);
    xhttp.send();
  }));
}

export function saveCollection(collectionName) {
  const xhttp = new XMLHttpRequest();
  xhttp.open('POST', serverURL, true);
  xhttp.setRequestHeader('Content-Type', 'application/json');
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 201) {
      console.log(store.getState());
      store.subscribe(() => {
        getCollectionData();
      })
    }
  };
  const data = JSON.stringify({ name: collectionName, movies: [] });
  xhttp.send(data);
}

export function loadCollections() {
  return new Promise(((resolve, reject) => {
    const xhttp = new XMLHttpRequest();
    let collectionHTML = '';
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        const data = JSON.parse(this.responseText);
        for (const collection of data) {
          collectionHTML += `<li class='list-group-item p-2'>${collection.name} <small><a href='#collectionWrapper${collection.id}' class="collection-view">View</a></small><button class='btn btn-sm btn-danger m-0 float-right remove-collection' data-col-name="${collection.name}" data-id="${collection.id}">Remove</button></li>`;
        }
        resolve(collectionHTML);
      }
    };
    xhttp.open('GET', serverURL, true);
    xhttp.send();
  }));
}

export function getCollections() {
  loadCollections().then((result) => {
    $('#myCollectionList').html(result);
  });
}

export function removeCollection(collectionID) {
  const url = serverURL + collectionID;
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      console.log(store.getState());
      store.subscribe(() => {
        getCollections();
        getCollectionData();
      })
    }
  };
  xhttp.open('DELETE', url, true);
  xhttp.send();
}

export function getCollectionData() {
  const xhttp = new XMLHttpRequest();
  let collectionResultsHTML = '';
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      const data = JSON.parse(this.responseText);
      for (let i = 0; i < data.length; i++) {
        collectionResultsHTML += `<div class='card mt-3'><div class='card-header deep-orange lighten-1 py-2 px-2 white-text'>${data[i].name}</div><div class='card-body px-2 pt-2 pb-0'><div class='row' id='collectionWrapper${data[i].id}'></div></div></div>`;
        getMovies(data[i].movies, data[i].id).then((moviesData) => {
        });
      }
      document.getElementById('collectionResults').innerHTML = collectionResultsHTML;
    }
  };
  xhttp.open('GET', serverURL, true);
  xhttp.send();
}

function getMovies(movies, collectionID) {
  return new Promise(((resolve, reject) => {
    const divID = `collectionWrapper${collectionID}`;

    const a = [];
    for (let j = 0; j < movies.length; j++) {
      a.push(getCollectionMovie(movies[j]));
    }
    Promise.all(a).then((moviesData) => {
      let movieHTML = '';
      for (var moviesData of moviesData) {
        movieHTML += moviesData;
      }
      document.getElementById(divID).innerHTML = movieHTML;
    });
  }));
}

function getCollectionMovie(movieID) {
  const url = `https://api.themoviedb.org/3/movie/${movieID}?api_key=289e84f4fe34381b97017830c61a59c7`;
  return new Promise(((resolve, reject) => {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        const data = JSON.parse(this.responseText);
        resolve(createMovieCard(data));
      }
    };
    xhttp.open('GET', url, true);
    xhttp.send();
  }));
}
