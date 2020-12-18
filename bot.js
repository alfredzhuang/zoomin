let Discord = require('discord.js')
require('dotenv').config()
let client = new Discord.Client()
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

    reminder()
    checkDates()
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

function reminder() {
    // get today's date, month, hour, and day
    let d = new Date()
    let date = d.getDate()
    let month = d.getMonth() + 1
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
            day = null
    }

    // Every 24 hours, send a message to the channels that have classes today, or tests/quizzes/hw coming up soon
    setInterval(() => {
        classes.find({ day: day }, function (err, docs) {
            for(theClass of docs) {
                let channel = client.channels.cache.get(theClass.channelid)
                let time
                if(theClass.time == 0) {
                    time = "12 AM"
                }
                else if(theClass.time == 12) {
                    time = "12 PM"
                }
                else if(theClass.time < 12) {
                    time = theClass.time + " AM"
                }
                else {
                    time = theClass.time%12 + " PM"
                }
                channel.send("❗ @everyone There is a " + theClass.name + " class today at " + time + ", " + theClass.link + " ❗")
            }
        }) 
        tests.find({}, function (err, docs) {
            for(test of docs) {
                let channel = client.channels.cache.get(test.channelid)
                if(test.time == 0) {
                    time = "12 AM"
                }
                else if(test.time == 12) {
                    time = "12 PM"
                }
                else if(test.time < 12) {
                    time = test.time + " AM"
                    }
                else {
                    time = test.time%12 + " PM"
                }
                let theDate
                if(test.month == month && test.date == date) {
                    theDate = "Today"
                }
                else {
                    theDate = "on " + test.month + "/" + test.date
                }
                channel.send("❗ @everyone There is a test for " + test.name + " " + theDate + " at " + time + " ❗")
            }
        })
        quizzes.find({}, function (err, docs) {
            for(quiz of docs) {
                let channel = client.channels.cache.get(quiz.channelid)
                if(quiz.time == 0) {
                    time = "12 AM"
                }
                else if(quiz.time == 12) {
                    time = "12 PM"
                }
                else if(quiz.time < 12) {
                    time = quiz.time + " AM"
                 }
                else {
                    time = quiz.time%12 + " PM"
                }
                let theDate
                if(quiz.month == month && quiz.date == date) {
                    theDate = "Today"
                }
                else {
                    theDate = "on " + quiz.month + "/" + quiz.date
                }
                channel.send("❗ @everyone There is a quiz for " + quiz.name + " " + theDate + " at " + time + " ❗")
            }
        }) 
        hw.find({}, function (err, docs) {
            for(homework of docs) {
                let channel = client.channels.cache.get(homework.channelid)
                if(homework.time == 0) {
                    time = "12 AM"
                }
                else if(homework.time == 12) {
                    time = "12 PM"
                }
                else if(homework.time < 12) {
                    time = homework.time + " AM"
                 }
                else {
                    time = homework.time%12 + " PM"
                }
                let theDate
                if(homework.month == month && homework.date == date) {
                    theDate = "Today"
                }
                else {
                    theDate = "on " + homework.month + "/" + homework.date
                }
                channel.send("❗ @everyone Homework is due for " + homework.name + " " + theDate + " at " + time + " ❗")
            }
        })
      }, 86400000)
 }

function checkDates() {
    // Every 12 hours, check if we've passed the dates on tests, quizzes, and hw. If so, we remove it from the array
    setInterval(() => {
        let d = new Date()
        let date = d.getDate()
        let month = d.getMonth() + 1
        let hour = d.getHours()
        tests.find({ $and: [{ month: `${month}` }, { date: `${date}` }] }, function (err, docs) {
            for(test of docs) {
                if(test.time < hour) {
                    tests.remove({ _id: test._id }, {}, function (err, numRemoved) {
                    });
                }
            }
        })
        quizzes.find({ $and: [{ month: `${month}` }, { date: `${date}` }] }, function (err, docs) {
            for(quiz of docs) {
                if(quiz.time < hour) {
                    quizzes.remove({ _id: quiz._id }, {}, function (err, numRemoved) {
                    });
                }
            }
        })
        hw.find({ $and: [{ month: `${month}` }, { date: `${date}` }] }, function (err, docs) {
            for(homework of docs) {
                if(homework.time < hour) {
                    hw.remove({ _id: homework._id }, {}, function (err, numRemoved) {
                    });
                }
            }
        })
    }, 43200000)
}