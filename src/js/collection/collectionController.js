import { store } from '../stateManagement';
import { getCollections, removeCollection, saveCollection, getCollectionData } from './collectionService';

let createCollection = ()  =>  {
    const collectionName = $('#collectionName').val();
    if (collectionName === '') {
        $('#collectionError').html('Please enter collection name.');
        $('#collectionName').focus();
    } else {
        $('#collectionError').html('');
        store.dispatch({ type: 'CREATE COLLECTION', collectionName: collectionName });
        saveCollection(collectionName);
        $('#collectionName').val('');
        $('#createCollection').modal('hide');
    }
}

$(document).on('click', '.remove-collection', function (event) {
    const collectionID = $(this).data('id');
    const collectionName = $(this).data('col-name');
    store.dispatch({ type: 'DELETE COLLECTION', collectionName: collectionName });
    removeCollection(collectionID);
});

$(document).on('click', '.collection-view', function (event) {
    $('#myCollection').modal('hide');
    const position = $(this).attr('href');
    $('html, body').animate({
        scrollTop: $(position).offset().top - 60,
    }, 1000);
});

$('#createCollectionButton').on('click', createCollection);
$('#getCollections').on('click', getCollections);

getCollectionData();

