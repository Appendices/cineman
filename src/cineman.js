const omdb = require('./omdb.js');
const cinedb = require('./cinedb.js');

function list_movies(body){
    var count = 0;
    var output = '';
    for(const movie of body){
        count++;
        output += count + ': *' + movie.Title + '* (' + movie.Year + ')\n';
        if(count > 4){
            break;
        }
    }
    //write to database
    return output;
}

function search(tag, apikey){
    return new Promise((resolve, reject) => {
        omdb.search(tag, apikey)
            .then(body => {
                if(typeof(body[Symbol.iterator]) === 'function'){
                    output = list_movies(body);
                }
                else{
                    output = 'Queued: *' + body.Title + '* (' + body.Year + ')\n';
                }
                return resolve(output);
            })
            .catch(err => {
                return reject(err);
            });
    });
}

module.exports = {
    queue: function(tag, apikey){
        //check database
        return search(tag, apikey);
        //return 'https://imdb.com/title/' + movies_list[tag - 1].imdbID;
    }
}