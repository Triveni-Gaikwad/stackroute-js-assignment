import { addMovie, removeMovie } from './movieService';

window.addRemoveMovieToCollection = (collectionId, movieId) => {
    const checkBox = document.getElementById(`collection${collectionId}`);
    if (checkBox.checked === true) {
        addMovie(collectionId, movieId);
    } else {
        removeMovie(collectionId, movieId);
    }
};