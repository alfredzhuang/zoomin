let Discord = require('discord.js')
require('dotenv').config()
let client = new Discord.Client()
let { processCommand, classes, tests, quizzes, hw } = require("./commands.js")

client.login(process.env.DISCORD_KEY)

// Bot join message
client.on('guildCreate', guild => {
    let channel = guild.channels.cache.find(channel => channel.type === 'text' && channel.permissionsFor(guild.me).has('SEND_MESSAGES'))
    channel.send("Hi, I'm Zoomin'! I'm a bot that specializes in creating reminders for students! Check out what I can do with `!help`")
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
    let day = "W"
    // switch(d.getDay()) {
    //     case 1:
    //         day = "M"
    //         break
    //     case 2:
    //         day = "T"
    //         break
    //     case 3:
    //         day = "W"
    //         break
    //     case 4:
    //         day = "TH"
    //         break
    //     case 5:
    //         day = "F"
    //         break
    //     default: 
    //         day = null
    // }

    // Every 24 hours, send a message to the channels that have classes today, or tests/quizzes/hw coming up soon
    setInterval(() => {
        classes.find({ day: day }, function (err, docs) {
            for(theClass of docs) {
                let channel = client.channels.cache.get(theClass.channelid)
                let time
                if(theClass.hour == 0) {
                    time = "12:" + theClass.minutes + " AM"
                }
                else if(theClass.hour == 12) {
                    time = "12:" + theClass.minutes + " PM"
                }
                else if(theClass.hour < 12) {
                    time = theClass.hour + ":" + theClass.minutes + " AM"
                }
                else {
                    time = theClass.hour%12 + ":" + theClass.minutes + " PM"
                }
                let person
                if(theClass.decision == "Y" || theClass.decision == "y") {
                    person = "@everyone"
                }
                else {
                    person = theClass.user
                }
                channel.send("❗ " + person + " There is a " + theClass.name + " class today at " + time + ", " + theClass.link + " ❗")
            }
        }) 
        tests.find({}, function (err, docs) {
            for(test of docs) {
                let channel = client.channels.cache.get(test.channelid)
                let time
                if(test.hour == 0) {
                    time = "12:" + test.minutes + " AM"
                }
                else if(test.hour == 12) {
                    time = "12:" + test.minutes + " PM"
                }
                else if(test.hour < 12) {
                    time = test.hour + ":" + test.minutes + " AM"
                }
                else {
                    time = test.hour%12 + ":" + test.minutes + " PM"
                }
                let theDate
                if(test.month == month && test.date == date) {
                    theDate = "Today"
                }
                else {
                    theDate = "on " + test.month + "/" + test.date
                }
                let person
                if(theClass.decision == "Y" || theClass.decision == "y") {
                    person = "@everyone"
                }
                else {
                    person = theClass.user
                }
                channel.send("❗ " + person + " There is a test for " + test.name + " " + theDate + " at " + time + " ❗")
            }
        })
        quizzes.find({}, function (err, docs) {
            for(quiz of docs) {
                let channel = client.channels.cache.get(quiz.channelid)
                let time
                if(quiz.hour == 0) {
                    time = "12:" + quiz.minutes + " AM"
                }
                else if(quiz.hour == 12) {
                    time = "12:" + quiz.minutes + " PM"
                }
                else if(quiz.hour < 12) {
                    time = quiz.hour + ":" + quiz.minutes + " AM"
                }
                else {
                    time = quiz.hour%12 + ":" + quiz.minutes + " PM"
                }
                let theDate
                if(quiz.month == month && quiz.date == date) {
                    theDate = "Today"
                }
                else {
                    theDate = "on " + quiz.month + "/" + quiz.date
                }
                let person
                if(theClass.decision == "Y" || theClass.decision == "y") {
                    person = "@everyone"
                }
                else {
                    person = theClass.user
                }
                channel.send("❗ " + person + " There is a quiz for " + quiz.name + " " + theDate + " at " + time + " ❗")
            }
        }) 
        hw.find({}, function (err, docs) {
            for(homework of docs) {
                let channel = client.channels.cache.get(homework.channelid)
                let time
                if(homework.hour == 0) {
                    time = "12:" + homework.minutes + " AM"
                }
                else if(homework.hour == 12) {
                    time = "12:" + homework.minutes + " PM"
                }
                else if(homework.hour < 12) {
                    time = homework.hour + ":" + homework.minutes + " AM"
                }
                else {
                    time = homework.hour%12 + ":" + homework.minutes + " PM"
                }
                let theDate
                if(homework.month == month && homework.date == date) {
                    theDate = "Today"
                }
                else {
                    theDate = "on " + homework.month + "/" + homework.date
                }
                let person
                if(theClass.decision == "Y" || theClass.decision == "y") {
                    person = "@everyone"
                }
                else {
                    person = theClass.user
                }
                channel.send("❗ " + person + " Homework is due for " + homework.name + " " + theDate + " at " + time + " ❗")
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
                if(test.hour < hour) {
                    tests.remove({ _id: test._id }, {}, function (err, numRemoved) {
                    });
                }
            }
        })
        quizzes.find({ $and: [{ month: `${month}` }, { date: `${date}` }] }, function (err, docs) {
            for(quiz of docs) {
                if(quiz.hour < hour) {
                    quizzes.remove({ _id: quiz._id }, {}, function (err, numRemoved) {
                    });
                }
            }
        })
        hw.find({ $and: [{ month: `${month}` }, { date: `${date}` }] }, function (err, docs) {
            for(homework of docs) {
                if(homework.hour < hour) {
                    hw.remove({ _id: homework._id }, {}, function (err, numRemoved) {
                    });
                }
            }
        })
    }, 43200000)
}