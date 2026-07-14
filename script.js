
const OMDB_API_KEY = "aa51e9f2"; // PUT YOUR KEY HERE
let favorites = JSON.parse(localStorage.getItem("moviehub-favorites")) || [];
let currentResults = []; // Temporary storage for search results

// 1. NAVIGATION: Shows one section and hides others
function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');

    sections.forEach(s => s.classList.remove('active'));
    navLinks.forEach(l => l.classList.remove('active'));

    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Auto-load data based on section
    if (sectionId === 'popular') loadPopularMovies();
    if (sectionId === 'favorites') loadFavorites();
}

// 2. CREATE CARD: Reusable HTML generator for movie cards
function createMovieCard(movie) {
    const isFavorite = favorites.some(fav => fav.imdbID === movie.imdbID);
    const poster = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/400x600?text=No+Poster';

    return `
        <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
            <div class="card movie-card h-100 bg-black border-0 shadow" onclick="showMovieDetails('${movie.imdbID}')">
                <img src="${poster}" class="card-img-top" alt="${movie.Title}">
                <div class="card-body d-flex flex-column">
                    <h6 class="card-title text-truncate">${movie.Title}</h6>
                    <p class=" small mb-1">${movie.Year}</p>
                    <p class="text-warning small mb-2">${movie.Genre || ''}</p>
                    <button class="btn btn-sm ${isFavorite ? 'btn-danger' : 'btn-outline-warning'} mt-auto" 
                        onclick="event.stopPropagation(); toggleFavorite('${movie.imdbID}')">
                        ${isFavorite ? 'Remove ' : 'Add Favorite'}
                    </button>
                </div>
            </div>
        </div>`;
}

// 3. SEARCH HANDLER: The main search logic
async function searchMoviesHandler() {
    const query = document.getElementById('movie-name').value.trim();
    const container = document.getElementById('search-results');

    // 1. If the input is empty, don't do anything
    if (!query) return;

    // 2. Switch to the search section and show a loading spinner
    showSection('search');
    container.innerHTML = '<div class="text-center w-100"><div class="spinner-border text-warning"></div></div>';

    try {
        // 3. Fetch movies from the API
        const res = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${OMDB_API_KEY}`);
        const data = await res.json();

        if (data.Response === "True") {
            // 4. Update the global state with the results
            currentResults = data.Search;

            // 5. Directly map the results to movie cards (No filtering!)
            container.innerHTML = data.Search.map(createMovieCard).join('');
        } else {
            // 6. Show error if no movies found
            container.innerHTML = `<p class="alert alert-danger w-100">${data.Error}</p>`;
        }
    } catch (err) {
        console.error("Search Error:", err);
        container.innerHTML = `<p class="alert alert-danger w-100">Something went wrong. check your connection.</p>`;
    }
}

// 4. POPULAR SECTION: Hardcoded top movies
async function loadPopularMovies() {
    const container = document.getElementById('popular-list');
    container.innerHTML = '<div class="spinner-border text-warning"></div>';

    const popularTitles = ['Leo', 'Vikram', 'Jailer', 'Maharaja', 'Soorarai pottru', 'Ghilli', 'Mankatha', 'Amaran', 'Maanaadu', 'Idly Kadai', 'KGF: Chapter 1', 'RRR','Spider-Man: No Way Home'];
    const promises = popularTitles.map(t =>
        fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(t)}&apikey=${OMDB_API_KEY}`).then(r => r.json())
    );

    const results = await Promise.all(promises);
    currentResults = results.filter(m => m.Response === "True");
    container.innerHTML = currentResults.map(createMovieCard).join('');
}

// 5. HOME STATS: Clicks from the Home page
// Function to update the Home Dashboard Stats
function updateHomeStats() {
    const favCount = favorites.length;
    const statElement = document.getElementById('stat-fav-count');
    if (statElement) {
        statElement.innerText = favCount;
    }
}

// Modify your showSection function to include this
function showSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;

    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

    section.classList.add('active');

    if (sectionId === 'home') {
        updateHomeStats(); // Refresh stats when user returns home
    }
    if (sectionId === 'popular') loadPopularMovies();
    if (sectionId === 'favorites') loadFavorites();
}
// 6. FAVORITES LOGIC
function toggleFavorite(imdbID) {
    // Find movie in search results or current favorites
    const movie = [...currentResults, ...favorites].find(m => m.imdbID === imdbID);
    const index = favorites.findIndex(f => f.imdbID === imdbID);

    if (index > -1) {
        favorites.splice(index, 1);
    } else if (movie) {
        favorites.push(movie);
    }

    localStorage.setItem("moviehub-favorites", JSON.stringify(favorites));

    // Refresh the view
    const activeSection = document.querySelector('.section.active').id;
    if (activeSection === 'favorites') loadFavorites();
    else if (activeSection === 'search') searchMoviesHandler();
}

function loadFavorites() {
    const container = document.getElementById('favorites-list');
    if (!container) return;
    container.innerHTML = favorites.length > 0
        ? favorites.map(createMovieCard).join('')
        : '<p class="text-muted w-100 text-center">Your favorites list is empty.</p>';
}

// 7. MODAL: Show full movie plot
async function showMovieDetails(imdbID) {
    const res = await fetch(`https://www.omdbapi.com/?i=${imdbID}&plot=full&apikey=${OMDB_API_KEY}`);
    const movie = await res.json();

    document.getElementById('modal-title').innerText = movie.Title;
    document.getElementById('modal-body-content').innerHTML = `
        <div class="row">
            <div class="col-md-5"><img src="${movie.Poster}" class="img-fluid rounded shadow border border-secondary"></div>
            <div class="col-md-7">
                <h4 class="text-warning">⭐ ${movie.imdbRating}</h4>
                <p><strong>Genre:</strong> ${movie.Genre}</p>
                <p><strong>Cast:</strong> ${movie.Actors}</p>
                <hr>
                <p>${movie.Plot}</p>
                <a href="https://www.youtube.com/results?search_query=${movie.Title}+trailer" target="_blank" class="btn btn-danger">Watch Trailer</a>
            </div>
        </div>`;
    new bootstrap.Modal(document.getElementById('movieModal')).show();
}

// INITIALIZE: Runs when page loads
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('search-button').onclick = searchMoviesHandler;
});