// jQuery
import jquery from 'jquery';
// PopperJS
import popper from 'popper.js';
// Bootstrap 4
import bootstrap from 'bootstrap';
// Material Design Bootstrap
// import a from  '../vendors/mdb/js/mdb';

import { getMovieService, saveCollection, getCollections, getCollectionData, removeCollection } from './data';


getMovieService('popular', 'popularResults');
getCollectionData();

$('#searchResultsContainer').hide();

//search functionality
function submitSearch() {
    var searchKeyword = $("#searchKeyword").val();
    if (searchKeyword === "") {
        $("#searchError").html("Please enter keyword to search.");
        $("#searchResults").html("");
        $('#searchResultsContainer').hide();
    } else {
        $("#searchError").html("");
        $('#searchResults').html("");
        getMovieService('search', 'searchResults', searchKeyword);
        $('#searchResultsContainer').show();
    }
}

function createCollection() {
    var collectionName = $("#collectionName").val();
    if (collectionName === "") {
        $("#collectionError").html("Please enter collection name.");
        $("#collectionName").focus();
    } else {
        $("#collectionError").html("");
        saveCollection(collectionName);
        $("#collectionName").val("");
        $('#createCollection').modal('hide');
    }
}

$("#searchButton").on('click', submitSearch);
$("#createCollectionButton").on('click', createCollection);
$("#getCollections").on('click', getCollections);

$(document).on("click", ".remove-collection", function(event){
    var collectionID = $(this).data("id");
    removeCollection(collectionID);
});

$(document).on("click", ".collection-view", function(event){
    $('#myCollection').modal('hide');
    var position = $(this).attr('href');
    $('html, body').animate({
        scrollTop: $(position).offset().top - 60
    }, 1000);
});



