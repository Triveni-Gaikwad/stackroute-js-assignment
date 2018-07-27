import { store } from '../stateManagement';
import { getMovies } from '../movie/movieService';

const serverURL = 'http://localhost:3000/collections/';

export let getCollections = () => {
    loadCollections().then((result) => {
        $('#myCollectionList').html(result);
    });
}
export let saveCollection = (collectionName) => {
    const xhttp = new XMLHttpRequest();
    xhttp.open('POST', serverURL, true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState === 4 && xhttp.status === 201) {
            store.dispatch({ type: 'CREATE COLLECTION', collectionName: collectionName });
            console.log(store.getState());
            getCollections();
            getCollectionData();
        }

    };
    const data = JSON.stringify({ name: collectionName, movies: [] });
    xhttp.send(data);
}

export let removeCollection = (collectionID, collectionName) => {
    const url = serverURL + collectionID;
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            store.dispatch({ type: 'DELETE COLLECTION', collectionName: collectionName });
            getCollections();
            getCollectionData();
            console.log(store.getState());
        }
    };
    xhttp.open('DELETE', url, true);
    xhttp.send();
}

export let getCollectionData = () => {
    const xhttp = new XMLHttpRequest();
    let collectionResultsHTML = '';
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            const data = JSON.parse(xhttp.responseText);
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


export let loadCollectionsModal = (movieId) => {
    return new Promise(((resolve, reject) => {
        const xhttp = new XMLHttpRequest();
        let collectionHTML = '';
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState === 4 && xhttp.status === 200) {
                const data = JSON.parse(xhttp.responseText);
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

export let loadCollections = () => {
    return new Promise(((resolve, reject) => {
        const xhttp = new XMLHttpRequest();
        let collectionHTML = '';
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState === 4 && xhttp.status === 200) {
                const data = JSON.parse(xhttp.responseText);
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