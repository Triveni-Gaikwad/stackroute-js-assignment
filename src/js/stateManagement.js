import { createStore } from 'redux';
const collection = (state = [], action) => {
  switch (action.type) {
    case 'CREATE COLLECTION':
      state.push(action.collectionName);
      return state;
    case 'DELETE COLLECTION':
      const index = state.indexOf(action.collectionName);
      state.splice(index, 1);
      return state;
    default:
      return state
  }
}

export let store = createStore(collection);

const popularMovies = (movies = [], action) => {
  if (action.type == "POPULAR MOVIE") {
    movies.push(action.movieID);
    return movies;
  }
}

export let popularStore = createStore(popularMovies);

const searchMovies = (searchKeyword = [], action) => {
  if(action.type == "SEARCH MOVIE") {
    searchKeyword.push(action.searchKeyword);
    return searchKeyword;
  }
}

export let searchStore = createStore(searchMovies);

