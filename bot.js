let Discord = require('discord.js')
require('dotenv').config()
let client = new Discord.Client()
let d = new Date()
let { processCommand, classes, tests, quizzes, hw } = require("./commands.js")

client.login(process.env.DISCORD_KEY)

// Bot join message
client.on('guildCreate', guild => {
    let channel = guild.channels.cache.find(channel => channel.type === 'text' && channel.permissionsFor(guild.me).has('SEND_MESSAGES'))
    channel.send("Hi! I'm Zoomin'! I'm a bot that specializes in creating reminders for students! Check out what I can do with `!help`")
})

client.on('ready', () => {
    console.log("Connected as " + client.user.tag)

    client.user.setActivity("with Javascript")

    // get today's date, month, hour, and day
    let date = d.getDate();
    let month = d.getMonth() + 1;
    let hour = d.getHours()
    let day
    switch(d.getDay()) {
        case 1:
            day = "M"
            break
        case 2:
            day = "T"
            break
        case 3:
            day = "W"
            break
        case 4:
            day = "TH"
            break
        case 5:
            day = "F"
            break
        default: 
            day = null;
    }

    // Every 24 hours, send a message to the channels that have classes today, or tests/quizzes/hw coming up soon
    setInterval(() => {
       if(classes.length >= 1) {
           for(var n = 0; n < classes.length; n++) {
               if(classes[n].day === day) {
                    let channel = client.channels.cache.get(classes[n].channelid)
                    let time
                    if(classes[n] % 12 === 0) {
                        time = classes[n].time + " AM"
                    }
                    else {
                        time = classes[n].time%12 + " PM"
                    }
                    channel.send("❗ @everyone There is a " + classes[n].name + " class today at " + time + ", " + classes[n].link + " ❗");
               }
           }
       }
       if(tests.length >= 1) {
            for(var n = 0; n < tests.length; n++) {
                let channel = client.channels.cache.get(tests[n].channelid)
                if(tests[n] % 12 === 0) {
                    time = tests[n].time + " AM"
                    }
                else {
                    time = tests[n].time%12 + " PM"
                }
                let theDate
                if(tests[n].month == month && tests[n].date == date) {
                    theDate = "Today"
                }
                else {
                    theDate = "on " + tests[n].month + "/" + tests[n].date
                }
                channel.send("❗ @everyone There is a test for " + tests[n].name + " " + theDate + " at " + time + " ❗")
                }
        }
        if(quizzes.length >= 1) {
            for(var n = 0; n < quizzes.length; n++) {
                let channel = client.channels.cache.get(quizzes[n].channelid)
                if(quizzes[n] % 12 === 0) {
                 time = quizzes[n].time + " AM"
                 }
                else {
                 time = quizzes[n].time%12 + " PM"
                }
                let theDate
                if(quizzes[n].month == month && quizzes[n].date == date) {
                    theDate = "Today"
                }
                else {
                    theDate = "on " + quizzes[n].month + "/" + quizzes[n].date
                }
                channel.send("❗ @everyone There is a quiz for " + quizzes[n].name + " " + theDate + " at " + time + " ❗")
            }
           }
        if(hw.length >= 1) {
            for(var n = 0; n < hw.length; n++) {
                let channel = client.channels.cache.get(hw[n].channelid)
                if(hw[n] % 12 === 0) {
                 time = hw[n].time + " AM"
                 }
                else {
                 time = hw[n].time%12 + " PM"
                }
                let theDate
                if(hw[n].month == month && hw[n].date == date) {
                    theDate = "Today"
                }
                else {
                    theDate = "on " + hw[n].month + "/" + hw[n].date
                }
                channel.send("❗ @everyone Homework is due for " + hw[n].name + " " + theDate + " at " + time + " ❗")
            }
        }
      }, 86400000)

    // Every 12 hours, check if we've passed the dates on tests, quizzes, and hw. If so, we remove it from the array
    setInterval(() => {
        if(tests.length >= 1) {
            for(var n = 0; n < tests.length; n++) {
                if(tests[n].month == month && tests[n].date == date && hour > tests[n].time) {
                    removeTest([tests[n].name])
                }
            }
        }
        if(quizzes.length >= 1) {
            for(var n = 0; n < quizzes.length; n++) {
                if(quizzes[n].month == month && quizzes[n].date == date && hour > quizzes[n].time) {
                    removeQuiz([quizzes[n].name])
                }
            }
        }
        if(hw.length >= 1) {
            for(var n = 0; n < hw.length; n++) {
                if(hw[n].month == month && hw[n].date == date && hour > hw[n].time) {
                    removeHw([hw[n].name])
                }
            }
        }
    }, 43200000)
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
