const key = '289e84f4fe34381b97017830c61a59c7';
const movieUrl = `https://api.themoviedb.org/3/discover/movie?language=en-US&include_adult=false&api_key=${key}`;
const searchMovieUrl = `https://api.themoviedb.org/3/search/movie?language=en-US&include_adult=false&api_key=${key}`;

import { createHTMLElement, createMovieCard } from '../view'

export let getMovieService = (queryString, divID, searchKeyword) => {
  const xhttp = new XMLHttpRequest();
  let link;
  if (queryString === 'popular') {
    link = `${movieUrl}&sort_by=popularity.desc`;
  } else if (queryString === 'search') {
    link = `${searchMovieUrl}&query=${searchKeyword}`;
  }
  xhttp.onreadystatechange = function() {
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