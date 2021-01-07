const api_key = '8c668922';

// variables
let autocomplete_input = document.getElementById('autocomplete-input');

const to_movies = ['tt5797184', 'tt11771594', 'tt7737786', 'tt10539608', 'tt8936646', 'tt2235695', 'tt6723592', 'tt7510346', 'tt1070874', 'tt7149730'];
const favorite = ['tt6813052', 'tt9252468', 'tt8354112', 'tt9777854', 'tt8785256', 'tt1521792', 'tt7878296']

function Movie(Poster, Title, Type, Year, imdbID) {
    this.Poster = Poster;
    this.Title = Title;
    this.Type = Type;
    this.Year = Year;
    this.imdbID = imdbID;
}


async function search_by_title(title) {
    let response = await fetch(`http://www.omdbapi.com/?s=${title}&apikey=${api_key}`)
        .then((response) => response.json());
    return response;
}
async function search_by_id(id) {
    let response = await fetch(`http://www.omdbapi.com/?i=${id}&apikey=${api_key}`)
        .then((response) => response.json());
    return response;
}
autocomplete_input.addEventListener('keyup', (e) => {
        let search = document.getElementById("autocomplete-results");
        let autocomplete_results = document.querySelector('.movie__items')
        if (e.target.value.length > 2) {
            let fetch_result = search_by_title(e.target.value);

            fetch_result.then(result => {
                let data_result = result.Search;

                autocomplete_results.innerHTML = '';
                if (result.Response !== 'False') {
                    if (data_result.length > 0) {
                        for (const data of data_result) {
                            // search_results(data, autocomplete_results);
                            search.innerHTML = '';
                            movie_items(data, autocomplete_results);
                        }
                    }
                } else {
                    search.innerHTML = '<div class="not_found">Not Found</div>';
                }
            })
        } else {
            autocomplete_results.innerHTML = ''
        }
    })
    // Create new div from fetching search results. if show list from input field
function search_results(data, master_div) {

    let movie_div = document.createElement('div');
    movie_div.setAttribute('class', 'movie');
    // add id to movie div
    movie_div.setAttribute('data-id', data.imdbID)

    let span_title = document.createElement('span');
    let title = document.createTextNode(data.Title);

    let span_imdbID = document.createElement('span');
    let imdbID = document.createTextNode(data.imdbID);
    span_imdbID.style.display = 'none';

    let span_type = document.createElement('span');
    let type = document.createTextNode(data.Type);

    let span_year = document.createElement('span');
    let year = document.createTextNode(data.Year);

    let img = document.createElement('img');
    if (data.Poster !== 'N/A') {
        img.setAttribute('src', data.Poster);
    } else {
        img.setAttribute('src', '../images/noimage.jpg');
    }
    img.setAttribute('alt', data.Title);

    span_title.appendChild(title);
    span_type.appendChild(type);
    span_year.appendChild(year);
    span_imdbID.appendChild(imdbID);

    movie_div.appendChild(span_title);
    movie_div.appendChild(span_type);
    movie_div.appendChild(span_year);
    movie_div.appendChild(span_imdbID);
    movie_div.appendChild(img);


    master_div.appendChild(movie_div);
}

function movie_items(data, master_div) {

    // create movie div
    let movie_items_item = document.createElement('div');
    movie_items_item.setAttribute('class', 'movie__items__item');

    // create movie image 
    let movie_img = document.createElement('img')
    if (data.Poster !== 'N/A') {
        movie_img.setAttribute('src', data.Poster);
    } else {
        movie_img.setAttribute('src', '../images/noimage.jpg');
    }
    movie_img.setAttribute('class', 'movie__img');
    movie_img.setAttribute('alt', data.Title);

    // Create movie info div
    let movie_info = document.createElement('div');
    movie_info.setAttribute('class', 'movie__info');

    // Create title h4
    let h4_title = document.createElement('h4');
    let h4_text = document.createTextNode(data.Title);
    h4_title.appendChild(h4_text);

    let span_type = document.createElement('span');
    let type = document.createTextNode(data.Type);
    span_type.appendChild(type);

    let span_year = document.createElement('span');
    let year = document.createTextNode(data.Year);
    span_year.appendChild(year);

    // Create btn more Detalis
    let more_btn = document.createElement('button');
    let btn_text = document.createTextNode('Show more');
    // add id to movie div
    more_btn.setAttribute('data-id', data.imdbID)
    more_btn.setAttribute('class', 'movie__info--button more_detalis');
    more_btn.appendChild(btn_text);

    movie_items_item.appendChild(movie_img);
    movie_info.appendChild(h4_title);
    movie_info.appendChild(span_type);
    movie_info.appendChild(span_year);
    movie_info.appendChild(more_btn);
    movie_items_item.appendChild(movie_info);

    master_div.appendChild(movie_items_item);
}
document.addEventListener("DOMContentLoaded", function(e) {
    document.addEventListener('click', (e) => {
        // if (e.target.closest('.movie')) {
        //     console.log(e.target)
        //     let result = search_by_id(e.target.closest('.movie').dataset.id).then(m => console.log(m))
        // }

        // Create Popup with the Movie detalis
        if (e.target.classList.contains('more_detalis')) {
            autocomplete_input.value = '';
            search_by_id(e.target.dataset.id).then(respo => {
                popup_box(respo);
            });
        }

        // Close Popup
        if (e.target.className == 'close-button') {

            // Remove The Current Popup
            e.target.parentNode.remove();

            // Remove Overlay
            document.querySelector(".popup-overlay").remove();

        }

        // Top Movies 
        if (e.target.classList.contains('fa-film')) {
            autocomplete_input.value = '';
            let autocomplete_results = document.querySelector('.movie__items')
            autocomplete_results.innerHTML = '';
            for (i = 0; i < to_movies.length; i++) {
                let fetch_result = search_by_id(to_movies[i]);
                fetch_result.then(result => {
                    let data_result = result;
                    if (result.Response !== 'False') {
                        movie_items(data_result, autocomplete_results);


                    } else {
                        autocomplete_results.innerHTML = '<div class="not_found">Not Found</div>';
                    }
                })
            }
        }

        // Top favorite 
        if (e.target.classList.contains('fa-heart')) {
            autocomplete_input.value = '';
            let autocomplete_results = document.querySelector('.movie__items')
            autocomplete_results.innerHTML = '';
            for (i = 0; i < favorite.length; i++) {
                let fetch_result = search_by_id(favorite[i]);
                fetch_result.then(result => {
                    let data_result = result;
                    if (result.Response !== 'False') {
                        movie_items(data_result, autocomplete_results);


                    } else {
                        autocomplete_results.innerHTML = '<div class="not_found">Not Found</div>';
                    }
                })
            }
        }
    })
})

function popup_box(respo) {
    // Create Overlay Element
    let overlay = document.createElement("div");

    // Add Class To Overlay
    overlay.className = 'popup-overlay';

    // Append Overlay To The Body
    document.body.appendChild(overlay);

    // Create The Popup Box
    let popupBox = document.createElement("div");

    // Add Class To The Popup Box
    popupBox.className = 'popup-box';

    // Create The Movie Box
    let movieBox = document.createElement("div");
    movieBox.setAttribute('class', 'movie_box');

    // Create The Image
    let popupImage = document.createElement("img");

    if (respo.Poster !== 'N/A') {
        // Set Image Source
        popupImage.src = respo.Poster;
    } else {
        popupImage.src = '../images/noimage.jpg';
    }

    // Add Image To Movie Box
    movieBox.appendChild(popupImage);


    // Create The Movie Info. Content
    let movieinfo = document.createElement("div");
    movieinfo.setAttribute('class', 'movie_info');

    // Create Heading
    let imgHeading = document.createElement("h3");

    // Create text For Heading
    let imgText = document.createTextNode(respo.Title);

    // Append The Text To The Heading
    imgHeading.appendChild(imgText);

    // Append The Heading To The Movie Info.
    movieinfo.appendChild(imgHeading);
    // Append The Movie Info. To The Movie Box
    movieBox.appendChild(movieinfo);

    // Create Genre
    let p_genre = document.createElement("p");
    // Create text For Genre
    let p_Genre = document.createTextNode('Genre: ' + respo.Genre);
    // Append The Text To The Genre
    p_genre.appendChild(p_Genre);
    // Append The Paragraph Genre To The Movie Info.
    movieinfo.appendChild(p_genre);
    // Append The Movie Info. To The Movie Box
    movieBox.appendChild(movieinfo);

    // Create Director
    let p_director = document.createElement("p");
    // Create text For Director
    let p_Director = document.createTextNode('Director: ' + respo.Director);
    // Append The Text To The Director
    p_director.appendChild(p_Director);
    // Append The Paragraph Director To The Movie Info.
    movieinfo.appendChild(p_director);
    // Append The Movie Info. To The Movie Box
    movieBox.appendChild(movieinfo);

    // Create Year
    let p_year = document.createElement("p");
    // Create text For Year
    let p_Year = document.createTextNode('Year: ' + respo.Year);
    // Append The Text To The Year
    p_year.appendChild(p_Year);
    // Append The Paragraph Year To The Movie Info.
    movieinfo.appendChild(p_year);
    // Append The Movie Info. To The Movie Box
    movieBox.appendChild(movieinfo);

    // Create  Actors
    let p_actors = document.createElement("p");
    // Create text For Actors
    let p_Actors = document.createTextNode('Actors: ' + respo.Actors);
    // Append The Text To The Actors
    p_actors.appendChild(p_Actors);
    // Append The Paragraph Actors To The Movie Info.
    movieinfo.appendChild(p_actors);
    // Append The Movie Info. To The Movie Box
    movieBox.appendChild(movieinfo);

    // Create Plot paragraph
    let p_plot = document.createElement("p");
    // Create text For Plot
    let p_Text = document.createTextNode(respo.Plot);
    // Append The Text To The Plot
    p_plot.appendChild(p_Text);
    // Append The Paragraph Plot To The Movie Info.
    movieinfo.appendChild(p_plot);
    // Append The Movie Info. To The Movie Box
    movieBox.appendChild(movieinfo);

    // Create Runtime
    let p_runtime = document.createElement("p");
    // Create text For Runtime
    let p_Runtime = document.createTextNode('Runtime: ' + respo.Runtime);
    // Append The Text To The Runtime
    p_runtime.appendChild(p_Runtime);
    // Append The Paragraph Runtime To The Movie Info.
    movieinfo.appendChild(p_runtime);
    // Append The Movie Info. To The Movie Box
    movieBox.appendChild(movieinfo);

    // Create imdbRating
    let p_imdbRating = document.createElement("p");
    // Create text For imdbRating
    let p_ImdbRating = document.createTextNode('imdbRating: ' + respo.imdbRating);
    // Append The Text To The imdbRating
    p_imdbRating.appendChild(p_ImdbRating);
    // Append The Paragraph imdbRating To The Movie Info.
    movieinfo.appendChild(p_imdbRating);
    // Append The Movie Info. To The Movie Box
    movieBox.appendChild(movieinfo);


    // Append The Movie Box To The Popup Box
    popupBox.appendChild(movieBox);
    // Append The Popup Box To Body
    document.body.appendChild(popupBox);

    // Create The Close Span
    let closeButton = document.createElement("span");

    // Create The Close Button Text
    let closeButtonText = document.createTextNode("X");

    // Append Text To Close Button
    closeButton.appendChild(closeButtonText);

    // Add Class To Close Button
    closeButton.className = 'close-button';

    // Add Close Button To The Popup Box
    popupBox.appendChild(closeButton);
}