//TODO: Seperate Sound playing into a module to keep track of states
//

const tmi = require ('tmi.js');
const fs = require('fs');
const fetch = require('node-fetch');
const { Console } = require('console');

//Define Config options
const options = {
    options: {debug: true},
    connection: {
        reconnection: true,
        secure: true
    },
    identity: {
        username: 'FluteBotXD',
        password: 'oauth:g2umjwjbvg0r9hk1hf1emu0moqjoz7'
    },
    channels: ['Forecasterxd']
};

//Create client with options
const client = new tmi.client(options);

//Event Handlers
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

//Load into Memory commands and Sound Files
var soundfiles = [];
soundfiles = populateSounds();

//Connect to Twitch
client.connect();

//States
var mute = false;

//Functions for Event Handlers
function onMessageHandler (target, tags, msg, self)
{
    if (self) { return; }

    //Remove whitespace from chat message and convert to lowercase
    const commandNameLower = msg.toLowerCase();
    const commandName = commandNameLower.trim();


    //****CHAT BOT COMMANDS****

    //Ignore messages without '!'
    if (commandName[0] === '!')
    {
        //Moderator Commands Bug: Crashes because tags is NULL
        try
        {
            if("moderator" in tags["badges"] || "broadcaster" in tags["badges"])
            {
                switch(commandName)
                {
                    //Mute Sounds
                    case '!mute':

                        if (mute === false)
                        {
                            mute = true;
                            fetch('http://localhost:3000', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'text/plain',
                            },
                            body: commandName,
                        })
                            .then(response => response.text())
                            .then(text => console.log(text))
                            .then(client.say(target, `@${tags["display-name"]}, sounds muted`))
                            .catch(error => {
                                console.error('Error: ', error);
                            })
                        }
                        return;

                    //Unmute Sounds
                    case '!unmute':
                        if (mute === true)
                        {
                            mute = false;
                            client.say(target, `@${tags["display-name"]}, sounds unmuted`);
                        }
                        return;
                    
                    //Disconnect Bot
                    case '!leave':
                        client.action('Forecasterxd', `FluteBotXD Disconnected!`);
                        client.disconnect();
                        console.log(`Bot Disconnected`);
                        return;
                    
                }
            }
        }
        catch(err)
        {
            console.log(err);
        }

        //Regular Commands
        switch(commandName)
        {
            //Test message to display hello (username)
            case '!hello':
                client.say(target, `Hello @${tags["display-name"]}!`);
                break;
            
            

            //list of Sounds
            case '!sounds':
                var response = '';
                for (i = 0; i < soundfiles.length; i++)
                {
                    response += soundfiles[i] + ', ';
                }
                client.say(target, `@${tags["display-name"]} List of sounds: ${response}`);
                break;
            
            case '!badges':
                client.say(target, `${tags["badges"]}, sounds unmuted`);
                break;
            //
            case '!help':
                client.say(target, `${tags["display-name"]}, use !commands for a list of commands`);
                break;

            //
            case '!commands':
                var commands = ['!hello', '!leave', '!sounds'];
                var response = ''
                commands.forEach(element => response += element + ', ')
                client.say(target, `@${tags["display-name"]} ${response}`);

            default:
                //Plays sound file
                if (mute === false)
                {
                    if (checkSounds(commandName) === true)
                    {
                        fetch('http://localhost:3000', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'text/plain',
                            },
                            body: commandName,
                        })
                            .then(response => response.text())
                            .then(text => console.log(text))
                            .catch(error => {
                                console.error('Error: ', error);
                            })
                    }
                }
                
                //Unrecognized Command
                else
                {
                    console.log(`Unknown Command ${commandName}`);
                }
                break;

        }
        
        //Log Input Command
        //console.log(`Command: ${commandName}`)
    }
    
}

//Declares Connection to Chat
function onConnectedHandler(address, port)
{
    client.action('Forecasterxd', `FluteBotXD Connected!`);
    console.log(`Connected to ${address}`);
}

//Input: Command Name___Return: True/False depending on if the Command name is a name of a sound file
function checkSounds(commandName)
{
    let sounds = fs.readdirSync('adlibs');
    for (i = 0; i < soundfiles.length; i++)
    {
        //console.log(soundfiles[i])
        //console.log('Command:' + commandName.substring(1));
        if (commandName.substring(1) == soundfiles[i])
        {
            console.log(`Sound: ${commandName} found`)
            return true;
        }
    }
    return false;
}
        
//Populates the Sounds Array
function populateSounds()
{
    console.log('Populating Sounds...');
    let sounds = fs.readdirSync('adlibs');
    let names = [];
    for (i = 0; i < sounds.length; i++)
    {
        let filename = sounds[i].split('.');
        names[i] = filename[0];
    }
    return names;
}