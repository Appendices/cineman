const discord = require('discord.js');
const cineman = require('./cineman.js');
const config = require('../config.json');
const mysql = require('mysql');

const client = new discord.Client();

function help(){
    var menu = "**~help**\t|\tDisplays this menu\n" +
                "**~queue** [title]\t|\tSearches OMDb for a title\n" +
                "**~queue** [IMDb link]\t|\tQueue's a specific film from IMDb\n";
    return menu;
}

function genDBConnection(){

    // Generates a connection var based of config that should be passed to MySQL functions
    var connection = mysql.createConnection({
        host     : config.db_host,
        user     : config.db_user,
        password : config.db_pass,
        database : 'cineman'
    });

    return connection;
}

client.on('ready', () => {
    for (const [key, value] of client.guilds.cache){
        console.log('Logged in to: ' + value.name + ' | ' + key);
    }
    console.log('as: ' + client.user.username + ' | ' + client.user.id);
});

client.on('message', message => {
    if(message.content.substring(0, 1) == '~'){
        var args = message.content.split(' ');
        switch(args[0].toLowerCase()){
            case '~help':
                message.channel.send(help()).catch(console.error);
                break;
            case '~queue':
                cineman.queue(args.slice(1).join(' '), config.omdb)
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
                                if(entry[1].createdTimestamp / 86400000 > (Date.now() / 86400000 - 6) && entry[1].content[0] != '~'
                                    && entry[1].author.id != config.bot_id){
                                    suggestions.set(entry[1]);
                                }
                            }
                            //cineman.printPoll(suggestions);
                            message.channel.send(cineman.printPoll(suggestions))
                                .then(poll_message => {
                                    var emoji;
                                    for(var i = 0; i < suggestions.size; i++){
                                        emoji = 0x1F1E6 + i;
                                        poll_message.react(String.fromCodePoint(emoji)).catch(console.error);
                                    }
                                })
                                .catch(console.error);
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