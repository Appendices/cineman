const mysql = require('mysql');


function checkForMovie(imdbData, connection) {
    // Returns null if movie isn't in the DB, or the imdbID if it is]

    var imdbID = imdbData.imdbID;

    var query_results = null;
    connection.connect();

    connection.query(`SELECT ${imdbID} FROM movies WHERE imdbID='${imdbID}'`, function (error, results, fields) {
        if (error) throw error;

        if (results.length == 0) {
            query_results =  false;
        }
        else {
            query_results =  true;
            // results.forEach(function (e) {
            //     console.log(e.User);
            // });
        }
    });

    connection.end();

    return query_results;
}

function insertMovie(imdbData, connection, discordID){
    connection.connect();

    var query_results = null;
    let insert_string = `imdbID = ${imbdData.imdbID}, year = ${imbdData.Year}, first_sug = ${discordID}, recent_date = ${Date.now()}, weight = 1`;

    connection.query(`INSERT INTO posts SET ${insert_string}`, function (error, results, fields) {
        if (error) throw error;

        query_results = results;
    });

    connection.end();

    return query_results
}

module.exports = {
    addMovie: function (imdbData, connection, discordID) {
        if (checkForMovie(imdbData, connection) == false) {
            insertMovie(imdbData, connection, discordID);

            var successful_insertion_string = "Movie added";
            return successful_insertion_string;
        }
        else{
            // Check if movie is in the current suggestions for this week, insert if it isn't.
        }
    }
}