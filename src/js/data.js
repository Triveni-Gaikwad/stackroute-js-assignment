const key = '289e84f4fe34381b97017830c61a59c7';
function getData(queryString, numResults, searchKeyword) {
  const xhttp = new XMLHttpRequest();
  let link; let
    divID = '';
  if (queryString == 'popular') {
    link = `https://api.themoviedb.org/3/discover/movie?language=en-US&sort_by=popularity.desc&api_key=${key}`;
    divID = 'popularResults';
  } else if (queryString === 'search') {
    link = `https://api.themoviedb.org/3/search/movie?language=en-US&include_adult=false&query=${searchKeyword}&api_key=${key}`;
    divID = 'searchResults';
  }
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const fetchedData = JSON.parse(this.responseText);
      showData(fetchedData, numResults, divID);
    }
  };

  xhttp.open('GET', link, true);
  xhttp.send();
}


// Show Data
function showData(data, numResults, divID) {
  let displayHTML = "<div class='card mt-3'><div class='card-header deep-orange lighten-1 py-2 px-2 white-text'>";
  // pagination only for search results
  // var numOfPages = data.total_pages;
  // var currentPage = data.page;
  // if(numOfPages > 1) {
  //   pagination(numOfPages, currentPage);
  // }
  if (divID == 'popularResults') {
    displayHTML += 'Popular Movies';
  } else if (divID == 'searchResults') {
    displayHTML += 'Search Results';
  }

  displayHTML += "</div><div class='card-body px-2 pt-2 pb-0'><div class='row'>";
  var numResults = numResults;
  const totalResults = data.results.length;
  if (numResults >= totalResults || numResults == 'all') {
    numResults = totalResults;
  }
  for (let i = 0; i < numResults; i++) {
    displayHTML += `${"<div class='col-md-3 mb-2 col-lg-3'><div class='card'>"
            + "<div class='view overlay'><img class='card-img-top' src='https://image.tmdb.org/t/p/w300"}${data.results[i].poster_path}' alt='${data.results[i].title}'><a href='#' data-id='${data.results[i].id}'><div class='mask rgba-white-slight'></div></a></div>`
            + `<div class='card-body px-2 py-2'><h6 class='card-title ellipsis-text mb-0' title='${data.results[i].original_title}'>${data.results[i].original_title}</h6></div>`
            + '</div></div>';
  }

  if (totalResults == 0) {
    displayHTML += "<div class='col-12'>No results found..</div>";
  }
  displayHTML += '</div></div></div>';
  document.getElementById(divID).innerHTML = displayHTML;
}
getData('popular', 8);


// search functionality
function submitSearch() {
  const searchKeyword = document.getElementById('searchKeyword').value;
  if (searchKeyword === '') {
    document.getElementById('searchError').innerHTML = 'Please enter keyword to search.';
    document.getElementById('searchResults').innerHTML = '';
  } else {
    document.getElementById('searchError').innerHTML = '';
    getData('search', 'all', searchKeyword);
  }
}


// pagination
function pagination(numPages, currentPage) {
  var numPages = numPages;
  const defaultNumPages = 10;
  let pagenitationHTML = "<nav aria-label='pagination example'><ul class='pagination pg-blue justify-content-center'>";
  if (currentPage != 1) {
    pagenitationHTML += "<li class='page-item'><a class='page-link' href='#' aria-label='Previous'><span aria-hidden='true'>&laquo;</span><span class='sr-only'>Previous</span></a></li>";
  }
  if (defaultNumPages < numPages) {
    numPages = defaultNumPages;
  }
  for (let i = 1; i <= numPages; i++) {
    let activeClass = '';
    if (i == currentPage) {
      activeClass = 'active';
    }
    pagenitationHTML += `<li class='page-item ${activeClass}'><a class='page-link' href='#' onclick='pagaData(${i})'>${i}</a></li>`;
  }

  if (currentPage != numPages) {
    pagenitationHTML += "<li class='page-item'><a class='page-link' href='#' aria-label='Next'><span aria-hidden='true'>&raquo;</span><span class='sr-only'>Next</span></a></li>";
  }

  pagenitationHTML += '</ul></nav>';
  document.getElementById('pagination').innerHTML = pagenitationHTML;
}

function pagaData(pageNumber) {
  getData('popular', 8);
}

