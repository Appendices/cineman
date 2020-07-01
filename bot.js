const search = require('./search.js');
const auth = require('./auth.json')

search.omdb('https://www.imdb.com/title/tt5311514/', auth.omdb)
    .then(body => console.log(body))
    .catch(err => console.log(err));
search.omdb('Your Name.', auth.omdb)
    .then(body => console.log(body))
    .catch(err => console.log(err));