let Discord = require('discord.js')
require('dotenv').config()
let client = new Discord.Client()

client.on('ready', () => {
    console.log("Connected as " + client.user.tag)

    client.user.setActivity("with Javascript")

})

client.on('message', (msg) => {
     if(msg.author.bot) {
         return
     }

     // commands
     if(msg.content.startsWith("!")) {
         command(msg)
     }
})

function command(msg) {
    let full = msg.content.substr(1)
    let split = full.split(" ")
    let primary = split[0]
    let arguments = split.slice(1)

    // help command
    if(primary == "help") {
        help(msg)
    }
    // else if(primary == "addclass") {
    //     addclass(arguments, msg)
    // }
    // else if(primary == "removeclass") {
    //     remove(arguments, msg)
    // }
    // else if(primary == "addtest") {
    //     addtest(arguments, msg)
    // }
    // else if(primary == "removetest") {
    //     removetest(arguments, msg)
    // }
    // else if(primary == "addquiz") {
    //     addquiz(arguments, msg)
    // }
    // else if(primary == "removequiz") {
    //     removequiz(arguments, msg)
    // }
    // else if(primary == "addhw") {
    //     addhw(arguments, msg)
    // }
    // else if(primary == "removehw") {
    //     removehw(arguments, msg)
    // }
    else {
        msg.channel.send("Unknown command. Try `!help`")
    }
}

function help(msg) {
    msg.channel.send("I'm not sure what you need help with. Try these commands: \n"
                    + "`!addclass`, `!removeclass`, `!addtest`, `!removetest`, \n"
                    + "`!addquiz`, `!removequiz`, `!addhw`, or `!removehw`")
}

// function addclass(arguments, msg)
// function removeclass(arguments, msg)
// function addtest(arguments, msg)
// function removetest(arguments, msg)
// function addquiz(arguments, msg)
// function removequiz(arguments, msg)
// function addhw(arguments, msg)
// function removehw(arguments, msg)

client.login(process.env.DISCORD_KEY)