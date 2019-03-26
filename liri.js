require("dotenv").config();

var keys = require("./keys.js");
var fs = require('fs');
var Spotify = require('node-spotify-api');
var bandsintown = require('bandsintown');
// var filename = './log.txt';
// //NPM module used to write output to console and log.txt simulatneously
// var log = require('simple-node-logger').createSimpleFileLogger(filename);
// log.setLevel('all');

var command = process.argv[2];
var input = process.argv[3];

//concatenate multiple words in 2nd user argument
for (var i = 4; i < process.argv.length; i++) {
    input += '+' + process.argv[i];
}
// Fetch Spotify Keys
var spotify = new Spotify({
    id: keys.spotify.id,
    secret: keys.spotify.secret
});

// Writes to the log.txt file
var getArtistNames = function (artist) {
    return artist.name;
};

// Function for running a Spotify search - Command is spotify-this-song
var getSpotify = function(songName) {
    songName = input
    if (songName === undefined) {
        songName = "The Sign";
    }

    spotify.search({ type: 'track', query: songName })
        .then(function(data){
            var songs = data.tracks.items;

            for (var i = 0; i < songs.length; i++) {
                console.log(i);
                console.log("artist(s): " + songs[i].artists.map(getArtistNames));
                console.log("song name: " + songs[i].name);
                console.log("preview song: " + songs[i].preview_url);
                console.log("album: " + songs[i].album.name);
                console.log("-----------------------------------");
            }
        })
        .catch(function(err){
            console.log(err)
        })
};

function mySwitch(command) {

    switch (command) {

        case "concert-this":
            getConcert();
            break;

        case "spotify-this-song":
            getSpotify();
            break;

        case "movie-this":
            getMovie();
            break;

        case "do-what-it-says":
            doWhat();
            break;
        default:
            console.log(keys)
            return
    }


//Bands in town - command: concert-this
function getConcert(){
    var axios = require("axios");
    var queryUrl;
    var artist = input;
    if(artist){
        queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
        axios.get(queryUrl).then(
            function(response) {
              console.log('================ Concert Info ================');
              console.log(response.data);
              console.log("Name of the venue:");
              console.log("Venue location: ");
              console.log("Date of the Event use moment to format this as MM/DD/YYYY:");
              console.log('==================THE END=================');
            })
    }else{
        artist ="Error";
        queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
        axios.get(queryUrl).then(
            function(response) {
                console.log("Error retrieving Concert data");
            })
    }
}

//OMDB Movie - command: movie-this
    function getMovie(){
        var axios = require("axios");
        var queryUrl;
        var movieName = input;
        if(movieName){
            queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
            axios.get(queryUrl).then(
                function(response) {
                  console.log('================ Movie Info ================');
                  console.log(response.data);
                  console.log("Title: " + response.data.Title);
                  console.log("Release Year: " + response.data.Year);
                  console.log("IMdB Rating: " + response.data.imdbRating);
                  console.log("Rotten Tomatoes Rating: " + response.data.Ratings[2].Value);
                  console.log("Rotten Tomatoes URL: " + response.data.tomatoURL);
                  console.log("Country: " + response.data.Country);
                  console.log("Language: " + response.data.Language);
                  console.log("Plot: " + response.data.Plot);
                  console.log("Actors: " + response.data.Actors);
                  
                  console.log('==================THE END=================');
                })
        }else{
            movieName ="Mr.Nobody";
            queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
            axios.get(queryUrl).then(
                function(response) {
                    console.log("-----------------------");
                    console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
                    console.log("It's on Netflix!");
                })
        }
    }

    //Function for command do-what-it-says; reads and splits random.txt file
    //command: do-what-it-says
    function doWhat() {
        //Read random.txt file
        fs.readFile("random.txt", "utf8", function (error, data) {
            if (!error);
            console.log(data.toString());
            //split text with comma delimiter
            var cmds = data.toString().split(',');
        });
    }

}   //Closes mySwitch func - Everything except the call must be within this scope

//Call mySwitch function
mySwitch(command);

