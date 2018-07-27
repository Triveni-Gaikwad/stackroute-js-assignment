// jQuery
import 'jquery';
// PopperJS
import 'popper.js';
// Bootstrap 4
import 'bootstrap';
// Material Design Bootstrap
// import a from  '../vendors/mdb/js/mdb';

import './search/searchController';
import './collection/collectionController';
import './movie/movieController';
import { getMovieService } from './search/searchService';


//display popular movies on load
getMovieService('popular', 'popularResults');
