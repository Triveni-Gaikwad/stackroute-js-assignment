import { loadCollectionsModal, getCollectionData } from '../collection/collectionService';
import { createMovieCard } from '../view'

const serverURL = 'http://localhost:3000/collections/';
const key = '289e84f4fe34381b97017830c61a59c7';

export let getMovies = (movies, collectionID) => {
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

let getCollectionMovie = (movieID) => {
    const url = `https://api.themoviedb.org/3/movie/${movieID}?api_key=289e84f4fe34381b97017830c61a59c7`;
    return new Promise(((resolve, reject) => {
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                const data = JSON.parse(this.responseText);
                resolve(createMovieCard(data));
            }
        };
        xhttp.open('GET', url, true);
        xhttp.send();
    }));
}

window.openMovie = (movieID) => {
    const url = `https://api.themoviedb.org/3/movie/${movieID}?api_key=${key}`;
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
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


export let addMovie = (collectionId, movieId) => {
    getMoviesList(collectionId).then((movieList) => {
        var movieList = movieList;
        const url = serverURL + collectionId;
        movieList.push(movieId);
        const xhttp = new XMLHttpRequest();
        xhttp.open('PATCH', url, true);
        xhttp.setRequestHeader('Content-Type', 'application/json');
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                getCollectionData();
            }
        };
        const data = JSON.stringify({ movies: movieList });
        xhttp.send(data);
    });
}

export let removeMovie = (collectionId, movieId) => {
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
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                getCollectionData();
            }
        };
        const data = JSON.stringify({ movies: movieList });
        xhttp.send(data);
    });
}

let getMoviesList = (collectionId) => {
    return new Promise(((resolve, reject) => {
        const url = serverURL + collectionId;
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                const data = JSON.parse(this.responseText);
                resolve(data.movies);
            }
        };
        xhttp.open('GET', url, true);
        xhttp.send();
    }));
}
