import { getMovieService } from './searchService';

$('#searchResultsContainer').hide();

// search functionality
let submitSearch = () => {
  const searchKeyword = $('#searchKeyword').val();
  if (searchKeyword === '') {
    $('#searchError').html('Please enter keyword to search.');
    $('#searchResults').html('');
    $('#searchResultsContainer').hide();
  } else {
    $('#searchError').html('');
    $('#searchResults').html('');
    getMovieService('search', 'searchResults', searchKeyword);
    $('#searchResultsContainer').show();
  }
}

$('#searchButton').on('click', submitSearch);