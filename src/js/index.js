// jQuery
import jquery from 'jquery';
// PopperJS
import popper from 'popper.js';
// Bootstrap 4
import bootstrap from 'bootstrap';
// Material Design Bootstrap
// import a from  '../vendors/mdb/js/mdb';

import {
  getMovieService, saveCollection, getCollections, getCollectionData, removeCollection,
} from './data';

import { store } from './stateManagement';


getMovieService('popular', 'popularResults');
getCollectionData();

$('#searchResultsContainer').hide();

// search functionality
function submitSearch() {
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

function createCollection() {
  const collectionName = $('#collectionName').val();
  if (collectionName === '') {
    $('#collectionError').html('Please enter collection name.');
    $('#collectionName').focus();
  } else {
    $('#collectionError').html('');
    store.dispatch({ type: 'CREATE COLLECTION', collectionName: collectionName});
    saveCollection(collectionName);
    $('#collectionName').val('');
    $('#createCollection').modal('hide');
  }
}

$('#searchButton').on('click', submitSearch);
$('#createCollectionButton').on('click', createCollection);
$('#getCollections').on('click', getCollections);

$(document).on('click', '.remove-collection', function (event) {
  const collectionID = $(this).data('id');
  const collectionName = $(this).data('col-name');
  store.dispatch({ type: 'DELETE COLLECTION', collectionName: collectionName});
  removeCollection(collectionID);
});

$(document).on('click', '.collection-view', function (event) {
  $('#myCollection').modal('hide');
  const position = $(this).attr('href');
  $('html, body').animate({
    scrollTop: $(position).offset().top - 60,
  }, 1000);
});
