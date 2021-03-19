const mysql = require('mysql');

const movie_fields = {
    IMDBID: 'imdbID',
    TITLE: 'title',
    YEAR: 'year',
    FIRST_SUG: 'first_sug',
    RECENT_SUG: 'recent_sug',
    RECENT_DATE: 'recent_date',
    WEIGHT: 'weight',
    NOMINATED: 'nominated'
}


function checkForMovie(imdbData, connection) {
    // Returns bool based on whether or not the movie is currently nominated

    var imdbID = imdbData.imdbID;

    var query_results = null;
    connection.connect();

    connection.query(`SELECT ${imdbID} FROM movies WHERE imdbID='${imdbID}'`, function (error, results, fields) {
        if (error) throw error;

        if (results.length == 0) {
            query_results = false;
        }
        else {
            query_results = true;
            // results.forEach(function (e) {
            //     console.log(e.User);
            // });
        }
    });

    connection.end();

    return query_results;
}

function insertMovie(imdbData, connection, discordID) {
    connection.connect();

    var query_results = null;
    let insert_string = `imdbID = ${imbdData.imdbID}, year = ${imbdData.Year}, first_sug = ${discordID}, recent_date = ${Date.now()}, weight = 1`;

    connection.query(`INSERT INTO movies SET ${insert_string}`, function (error, results, fields) {
        if (error) throw error;

        query_results = results;
    });

    connection.end();

    return query_results
}

function updateMovieField(imdbID, connection, field) {

    // Some value verifcation/escaping should happen somewhere, likely in this switch.
    switch (field) {
        case movie_fields.IMDBID:
        case movie_fields.TITLE:
        case movie_fields.YEAR:
        case movie_fields.FIRST_SUG:
        case movie_fields.RECENT_SUG:
        case movie_fields.RECENT_DATE:
        case movie_fields.NOMINATED:
            // Do nothing, these fields are fine
            break;
        default:
            // Just return something to indicate the update failed
            return false;
            break;
    }

    connection.connect();

    var query_results = null;

    connection.query(`UPDATE movies SET ${field}='${value}' WHERE imdbID='${imdbID}'`, function (error, results, fields) {
        if (error) throw error;

        query_results = results;
    });

    connection.end();

    return query_results;
}

function getMovieField(imdbID, connection, field){

    switch (field) {
        case movie_fields.IMDBID:
        case movie_fields.TITLE:
        case movie_fields.YEAR:
        case movie_fields.FIRST_SUG:
        case movie_fields.RECENT_SUG:
        case movie_fields.RECENT_DATE:
        case movie_fields.NOMINATED:
            // Do nothing, these fields are fine
            break;
        default:
            // Just return something to indicate the update failed
            return false;
            break;
    }

    connection.connect();

    var query_results = null;

    connection.query(`SELECT ${field} FROM movies WHERE imdbID='${imdbID}'`, function (error, results, fields) {
        if (error) throw error;

        // Treating results like an array might not work here
        query_results = results[field];
    });

    connection.end();

    return query_results;
}

module.exports = {
    addMovie: function (imdbData, connection, discordID) {
        if (checkForMovie(imdbData, connection) == false) {
            insertMovie(imdbData, connection, discordID);

            var successful_insertion_string = "Movie added";
            return successful_insertion_string;
        }
        else {
            // Rather than calling this same function multiple times, it would be better to make an array of desired changes,
            // then parse that array to a string for the MySQL query. I don't want to though.
            updateMovieField(imdbData.imdbID, connection, movie_fields.NOMINATED, 1);
            updateMovieField(imdbData.imdbID, connection, movie_fields.RECENT_SUG, discordID);
            updateMovieField(imdbData.imdbID, connection, movie_fields.RECENT_DATE, Date.now());
            updateMovieField(imdbData.imdbID, connection, movie_fields.WEIGHT, getMovieField(imdbData.imdbID, connection, movie_fields.WEIGHT) + 1);
        }
    }
}