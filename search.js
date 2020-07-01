const request = require('tinyreq');

module.exports = {
    omdb: function(tag, apikey){
        var url = 'http://www.omdbapi.com/'
        if(tag.substring(0, 4) === 'http'){
            url += "?i=" + tag.substring(27, tag.indexOf('/', 27) != -1 ? tag.indexOf('/', 27) : tag.length);
        }
        else{
            url += "?s=" + tag;
        }
        url += "&apikey=" + apikey;
        url = encodeURI(url);
        console.log(url);
        return new Promise((resolve, reject) => {
            request(url, (err, body) => {
                if(err) return reject(err);
                else{
                    return resolve(body);
                }
            })
        });
    }
}