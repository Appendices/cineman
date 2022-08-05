const {Client, Intents} = require('discord.js');

const config = require('../config.json');
const omdb = require('./omdb.js');
const cinedb = require('./cinedb.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

function help(){
    var menu = "**~help**\t|\tDisplays this menu\n" +
                "**~queue** [title]\t|\tSearches OMDb for a title\n" +
                "**~queue** [IMDb link]\t|\tQueue's a specific film from IMDb\n";
    return menu;
}

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

function printPoll(suggestions){
    var count = 0;
    var output = '';
    for(const suggestion of suggestions){
        count++;
        output += ':regional_indicator_' + String.fromCharCode(96 + count) + ': : ' + suggestion[0].content + '\n';
    }
    return output;
}

function mostReactions(winList, value, key){
    if(winList.length == 0) winList.push([key, value.count]);
    else if(winList[0][1] < value.count){
        winList.length = 0; //empties the array, but what the fuck
        winList.push([key, value.count]);
    }
    else if(winList[0][1] == value.count) winList.push([key, value.count]);
}

client.on('ready', () => {
    for (const [key, value] of client.guilds.cache){
        console.log('Logged in to: ' + value.name + ' | ' + key);
    }
    console.log('as: ' + client.user.username + ' | ' + client.user.id);
});

client.on('messageCreate', message => {
    if(message.content.substring(0, 1) == '~'){
        var args = message.content.split(' ');
        switch(args[0].toLowerCase()){
            case '~help':
                message.channel.send(help()).catch(console.error);
                break;
            case '~queue':
                search(args.slice(1).join(' '), config.omdb)
                .then(output => {
                    message.channel.send(output).catch(console.error);
                })
                .catch(err => {
                    console.log('ERROR: ' + err);
                    message.channel.send('It would appear my knowledge is lacking.').catch(console.error);
                });
                break;
            case '~poll':
                if(message.author.id == config.admin_id){
                    message.channel.messages.fetch({ limit: 25 })
                    .then(messages => {
                        var suggestions = new Map();
                        for(var entry of messages.entries()){
                            if(entry[1].createdTimestamp / 86400000 > (Date.now() / 86400000 - 7) && entry[1].content[0] != '~'
                                && entry[1].author.id != client.user.id){
                                suggestions.set(entry[1]);
                            }
                        }
			if(suggestions.length < 1){
				message.channel.send("No suggestions to poll.")
			}
			else{
                            message.channel.send(printPoll(suggestions))
                                .then(poll_message => {
                                    var emoji;
                                    for(var i = 0; i < suggestions.size; i++){
                                        emoji = 0x1F1E6 + i;
                                        poll_message.react(String.fromCodePoint(emoji)).catch(console.error);
                                    }
                                    message.delete().catch(console.error);
                                 })
                                 .catch(console.error);
			}
                    })
                    .catch(console.error);
                }
                break;
            case '~declare':
                if(args.length == 2){
                    message.channel.messages.fetch(args[1])
                    .then(message => {
                        var reactions = message.reactions.cache;
                        var winner = [];
                        reactions.forEach(function (value, key, map){
                            mostReactions(winner, value, key);
                        });
                        if(winner.length == 1){
                            message.channel.send('The winner is ' + winner[0][0] + '.');
                        }
                        else{
                            message.channel.send('There is a tie.');
                        }
                    })
                    .catch(console.error);
                }
                break;
            case '~prune':
                if(message.author.id == config.admin_id){
                    if(args.length == 2) message.channel.bulkDelete(args[1]).catch(console.error);
                    else message.channel.send('Usage: ~prune [num]').catch(console.error);
                }
        }
    }
});

client.login(config.bot_key)
    .catch(console.error);
