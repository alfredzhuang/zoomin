let Discord = require('discord.js')
require('dotenv').config()
let client = new Discord.Client()

client.on('ready', () => {
    console.log("Connected as " + client.user.tag)

    client.user.setActivity("with Javascript")

})

client.login(process.env.DISCORD_KEY)