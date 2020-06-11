#!/usr/bin/env node

const yargs = require('yargs');
const keytar = require('keytar');
const axios = require('axios');
const store = require('data-store')('tele-debug-cli');
const Table = require('cli-table3');

var table = new Table({
    head: ['#', 'Bot Name'],
    colWidths: [10, 30]
});

serviceName = 'tele-debug-cli';

const addCommand = yargs
                .command('add [bot name] [token]', 'Add new Telegram Bot to the list', (yargs) => {
                    yargs.alias('n', 'botname');
                    yargs.alias('t', 'token');
                }, (argv) => {
                    if (argv.n && argv.t) {
                        addBot(argv.n, argv.t).then(() => {
                            console.log(`[SUCCESS] ${argv.n} has been added.`);
                        });
                    } else {
                        console.error('[ERROR] Format: tb add <bot name> <token>, both arguments must be fulfilled.');
                    }
                })
                .argv;

yargs
    .command('delete [bot name]', 'Delete Telegram Bot based on name', (yargs) => {
        yargs.alias('n', 'botname');
    }, (argv) => {
        if (argv.n) {
            deleteBot(argv.n).then(() => {
                console.log(`[SUCCESS] ${argv.n} removed.`); 
            });
        } else {
            console.error('[ERROR] Format: tb delete <bot name>, you are missing arguments.');
        }
    })
    .argv;

yargs
    .command('list', 'Shows a list of Telegram Bot registered', (yargs) => {
    }, (argv) => {
        getBots();
    })
    .argv;

yargs
    .command('msg [bot name] [chatID | username] [text]', 'Sends message to chatID', (yargs) => {
        yargs.alias('n', 'botname');
        yargs.alias('u', 'username');
        yargs.alias('c', 'chatID');
        yargs.alias('t', 'text');
        yargs.option('verbose', {
            alias: 'v',
            type: 'boolean',
            description: 'Get full JSON Response from Telegram Server'
        });
    }, async (argv) => {
        if (argv.n && (argv.c || argv.u) && argv.t) {

            let userID = argv.c;

            if (isNaN(argv.username)) { // if using username
                if (hasUserID(argv.username)) {
                    userID = store.get(`users.${argv.username}`);
                } else {
                    console.error('[ERROR] The username does not exist. Please use chatID on the first try and it\'ll be saved later on.');
                    return;
                }
            } 

            botName = argv.n;
            token = await getPassword(botName);
            password = token.password;

            try {
                res = await axios.post(`https://api.telegram.org/bot${password}/sendMessage`, {
                    chat_id: userID,
                    text: argv.t
                });

                argv.verbose ? console.log(res.data) : null;

                if (res.data.ok) {
                    storeUserID(res.data.result.chat.id, res.data.result.chat.username);
                    console.log(`[SUCCESS] Sent to @${res.data.result.chat.username}: ${argv.text}`);
                } else {
                    console.error(`[ERROR] Unable to send message to Telegram Servers. use -v flag to view JSON Response.`);
                }
            } catch (err) {
                let data = err.response.data;
                argv.verbose ? console.log(data) : null;
                console.error(`[TELEGRAM ERROR ${data.error_code}] ${data.description}`);
            }
        }
    })
    .argv;

function addBot(name, token) {
    return keytar.setPassword(serviceName, name, token);
}

function deleteBot(name) {
    return keytar.deletePassword(serviceName, name);
}

function getBots() {
    return keytar.findCredentials(serviceName).then((bots) => {
        let newBots = bots.map((bot, idx) => {
            return [(idx + 1), bot.account]
        });

        table.push(...newBots);
        console.log(table.toString());
    });
}

async function getPassword(name) {
    bots = await keytar.findCredentials(serviceName);
    return bots.filter(bot => bot.account === name)[0];
}

function hasUserID(username) {
    return store.has(`users.${username}`);
}

function storeUserID(userID, username) {
    if (!store.has(`users.${username}`)) {
        store.set(`users.${username}`, userID);
        console.log(`[SUCCESS] Stored user ID, you may use @${username} next time instead of user ID.`);
    }
}