import { createStore } from 'redux';

function collection(state = [], action) {
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

