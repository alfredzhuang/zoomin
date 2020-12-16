let Discord = require('discord.js')
require('dotenv').config()
let client = new Discord.Client()

client.on('ready', () => {
    console.log("Connected as " + client.user.tag)

    client.user.setActivity("with Javascript")

    // client.guilds.cache.forEach((guild) => {
    //     console.log(guild.name)
    //     guild.channels.cache.forEach((channel) => {
    //         console.log(` - ${channel.name} ${channel.type} ${channel.id}`)
    //     })
    // })
    // // bot-testing test : 788246311731724328
    // let channel = client.channels.cache.get("788246311731724328")
    // channel.send("Hello")
})

client.on('message', (msg) => {
     if(msg.author.bot) {
         return
     }

     // commands
     if(msg.content.startsWith("!")) {
         processCommand(msg)
     }
})

function processCommand(msg) {
    let full = msg.content.substr(1)
    let split = full.split(" ")
    let command = split[0]
    let arguments = split.slice(1)

    // help command
    if(command == "help") {
        help(msg)
    }
     else if(command == "addclass") {
         addClass(arguments, msg)
     }
     else if(command == "removeclass") {
         removeClass(arguments, msg)
     }
    // else if(command == "addtest") {
    //     addTest(arguments, msg)
    // }
    // else if(command == "removetest") {
    //     removeTest(arguments, msg)
    // }
    // else if(command == "addquiz") {
    //     addQuiz(arguments, msg)
    // }
    // else if(command == "removequiz") {
    //     removeQuiz(arguments, msg)
    // }
    // else if(command == "addhw") {
    //     addHw(arguments, msg)
    // }
    // else if(command == "removehw") {
    //     removeHw(arguments, msg)
    // }
    else if(command == "code") {
        code(msg)
    }
    else {
        msg.channel.send("Unknown command. Try `!help`")
    }
}



function help(msg) {
    msg.channel.send("I'm not sure what you need help with. Try these commands: \n"
                    + "`!addclass [class name] [zoom link] [day of the week] [time from 1-24]` \n"
                    + "`!removeclass [class name]` \n"
                    + "`!addtest [class of test] [day of the week] [time from 1-24]` \n"
                    + "`!removetest [class of test]` \n"
                    + "`!addquiz [class of test] [day of the week] [time from 1-24]` \n" 
                    + "`!removequiz [class of test]` \n" 
                    + "`!addhw [class of test] [day of the week] [time from 1-24]` \n" 
                    + "`!removehw [class of test]`\n"
                    + "or if you want to see the code, use `!code`")
}

function code(msg) {
    msg.channel.send("This bot was coded using Javascript, you can look at the documentation at https://github.com/alfredzhuang/zoomin")
}

let classes = []
let tests = []
let hw = []

 function addClass(arguments, msg) {
    if(arguments.length < 4) {
        msg.channel.send("Not enough arguments. Try !addclass [class name] [zoom link] [day of the week] [time from 1-24]")
        return
    }
    else if(arguments[2] != "M" && arguments[2] != "T" && arguments[2] != "W" && arguments[2] != "TH" && arguments[2] != "F") {
        msg.channel.send("Invalid day, try M-T-W-TH-F") 
        return
    }
    else if(arguments[3] <= 0 || arguments[3] > 24) {
        msg.channel.send("Invalid time, try between 1-24")
        return
    }
    let newClass = {
        name: arguments[0],
        link: arguments[1],
        day:  arguments[2],
        time: arguments[3],
    }
    classes.push(newClass)
    msg.channel.send("Class \"" + arguments[0] + "\" added!")
}
 function removeClass(arguments, msg) {
     if(arguments.length != 1) {
        msg.channel.send("Invalid argument. Try !removeclass [class name]")
        return
     }
     let index = -1;
     for(var i = 0; i < classes.length; i++) {
         if(classes[i].name === arguments[0]) {
            index = i;
         }
     }
     if(index > -1) {
        classes.splice(index, 1)
        msg.channel.send("Class \"" + arguments[0] + "\" removed!")
        return
     }
     else {
        msg.channel.send("Invalid name of class")
        return
     }
 }

// function addTest(arguments, msg) 
// function removeTest(arguments, msg)
// function addQuiz(arguments, msg)
// function removeQuiz(arguments, msg)
// function addHw(arguments, msg)
// function removeHw(arguments, msg)

client.login(process.env.DISCORD_KEY)