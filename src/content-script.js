const $ = require('jquery');

// global refernce to the lyrics DOM container 
var $lyricsContainer;

var GOOGLE_LYRICS_URL_PREFIX = 'https://play.google.com/music/preview/';
var GOOGLE_LYRICS_CONTAINER_CSS_SELECTOR = '.content-container.lyrics';
var GOOGLE_CURRENT_SONG_CSS_SELECTOR = '.song-row.currently-playing';
var GOOGLE_SONG_ID_ATTRIBUTE = 'data-id';

// if URL doesn't contain a google user accoun index, google redirects to same URL with user account index.
// TODO: refactor to instead handle redirects.
function buildLyricsUrl(songId){
	return songId ? GOOGLE_LYRICS_URL_PREFIX + songId + '?u=0#' : '';
};

// find the google song id for the currently playing song.
function getCurrentId(){
	var $songRow = $(GOOGLE_CURRENT_SONG_CSS_SELECTOR);
	return $songRow.length && $songRow.attr(GOOGLE_SONG_ID_ATTRIBUTE) || ''; 
}

// create the DOM container for lyrics.
// TODO: extract to HTML and CSS file (i.e. component).
// TODO: add 'x' button to hide lyrics.
function ensureLyricsContainer(){
	$lyricsContainer = $('#lyrics')
	
	if(!$lyricsContainer.length){
		$lyricsContainer = $('<div id="lyrics" class="material-card material-shadow-z1"></div>');
		$lyricsContainer.css({
			position: 'fixed',
			top: '60px',
			right: '-7px',
			width: '400px',
			maxHeight: 'calc(100vh - 205px)',
			padding: '20px',
			overflowY: 'auto',
			overflowX: 'hidden',
			cursor: 'auto',
			userSelect: 'text'
		})
		$('body').append($lyricsContainer);
	}
	
	return $lyricsContainer;
}

// audio event listener that intercepts any player changes and updates lyrics.
function onAudioEvent(evt){
	if(!evt.target.tagName || evt.target.tagName.toLowerCase() !== 'audio'){
		return true;
	}
	
	console.log(evt);
	setTimeout(showLyrics, 400);
}

function showLyrics(){
	var currentSongId = getCurrentId();
	
	// if we can't find the currently playing song or lyrics is already loaded, ignore.
	if(!currentSongId || (ensureLyricsContainer() && $lyricsContainer.attr('data-song-id') === currentSongId)){
		return;
	}
	
	var url = buildLyricsUrl(currentSongId);
	$lyricsContainer.load(url + ' ' + GOOGLE_LYRICS_CONTAINER_CSS_SELECTOR).attr('data-song-id', currentSongId);
}

function hideLyrics(){
	$lyricsContainer.length && $lyricsContainer.remove();
}

function initLyrics(){
	// capture certain audio events from any audio element (the src of the audio player never changes, it uses a blob) and update lyrics.
	['play', 'progress'].forEach(function(evtName){
		document.addEventListener(evtName, onAudioEvent, true);
	});
	
	// show lyrics for currently playing song.
	showLyrics();
	
	// TODO: render a "See Lyrics" button inside the player.
}

// initialize
initLyrics();
