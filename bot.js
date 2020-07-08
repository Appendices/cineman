const discord = require('discord.js');
const search = require('./search.js');
const auth = require('./auth.json');

const bot = new discord.Client();
var listed = 0;
var movies_list;

function help(){
    var menu = "**~help**\t|\tDisplays this menu\n" +
                "**~queue** [title]\t|\tSearches OMDb for a title\n" +
                "**~queue** [IMDb link]\t|\tQueue's a specific film from IMDb\n";
    return menu;
}

bot.on('ready', () => {
    for (const [key, value] of bot.guilds.cache){
        console.log('Logged in to: ' + key);
    }
    console.log('as: ' + bot.user.username + ' | ' + bot.user.id);
});

function list_movies(body){
    var search = JSON.parse(body).Search;
    var count = 1;
    var output = '';
    for(const movie of search){
        output += count + ': *' + movie.Title + '* (' + movie.Year + ')\n';
        count++;
    }
    listed = 1;
    movies_list = Array.from(search);
    return output;
}

bot.on('message', message => {
    if(message.content.substring(0, 1) == '~'){
        var args = message.content.substring(1).split(' ');
        //console.log(args.slice(1).join(' '));
        switch(args[0].toLowerCase()){
            case 'help':
                message.channel.send(help());
                break;
            case 'queue':
                if(listed == 1 && args[1].isInteger()){
                    message.channel.send('https://imdb.com/title/' + movies_list[args[1] - 1].imdbID);
                    listed = 0;
                }
                else {
                    search.omdb(args.slice(1).join(' '), auth.omdb)
                        //.then(body => message.channel.send(list_movies(body)))
                        .then(body => console.log(list_movies(body)))
                        .catch(err => {
                            message.channel.send('It would appear my knowledge is lacking.');
                            console.log(err);
                        });
                }
        }
    }
});

bot.login(auth.discord);