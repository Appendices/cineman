const discord = require('discord.js');
const cineman = require('./cineman.js');
const auth = require('../auth.json');

const bot = new discord.Client();

function help(){
    var menu = "**~help**\t|\tDisplays this menu\n" +
                "**~queue** [title]\t|\tSearches OMDb for a title\n" +
                "**~queue** [IMDb link]\t|\tQueue's a specific film from IMDb\n";
    return menu;
}

bot.on('ready', () => {
    for (const [key, value] of bot.guilds.cache){
        console.log('Logged in to: ' + value.name + ' | ' + key);
    }
    console.log('as: ' + bot.user.username + ' | ' + bot.user.id);
});

bot.on('message', message => {
    if(message.content.substring(0, 1) == '~'){
        var args = message.content.split(' ');
        switch(args[0].toLowerCase()){
            case '~help':
                message.channel.send(help());
                break;
            case '~queue':
                cineman.queue(args.slice(1).join(' '), auth.omdb)
                    .then(output => {
                        message.channel.send(output);
                    })
                    .catch(err =>{
                        console.log('ERROR: ' + err);
                        message.channel.send('It would appear my knowledge is lacking.');
                    });
                break;
        }
    }
});

bot.login(auth.discord);