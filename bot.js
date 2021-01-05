let Discord = require('discord.js');
require('dotenv').config();
let client = new Discord.Client();
let { processCommand } = require("./commands.js");
let { Class, Test, Quiz, Homework } = require("./database.js");
let cron = require('cron');

client.login(process.env.DISCORD_KEY)

// Bot join message
client.on('guildCreate', guild => {
    let channel = guild.channels.cache.find(channel => channel.type === 'text' && channel.permissionsFor(guild.me).has('SEND_MESSAGES'));
    channel.send("Hi, I'm Zoomin'! I'm a bot that specializes in creating reminders for students! Check out what I can do with `!help`");
})

client.on('ready', () => {
    console.log("Connected as " + client.user.tag);

    client.user.setActivity("with Javascript");

    // Check if any test/quiz/homework dates are outdated and then remind users of upcoming tests/quizzes/homework at 7 AM PST
    let remind = new cron.CronJob('0 0 7 * * *', function() {
        checkDates();
        reminder();
    }, null, true, 'America/Los_Angeles');
    remind.start();

    // Check if users can be reminded about class sessions starting every 5 minutes
    let remindNow = new cron.CronJob('0 */5 * * * * ', function() {
        reminderNow();
    }, null, true, 'America/Los_Angeles');
    remindNow.start();

    // Check everyday right before midnight to see if any test/quiz/homework dates are outdated and need to be deleted
    let check = new cron.CronJob('0 59 11 * * *', function() {
        checkDates();
    }, null, true, 'America/Los_Angeles');
    check.start();
})

client.on('message', (msg) => {
     if(msg.author.bot) {
         return;
     }
     // commands
     if(msg.content.startsWith("!")) {
         processCommand(msg);
     }
})

function reminder() {
    let d = new Date();
    let date = d.getDate();
    let month = d.getMonth() + 1;
    Test.find({}, function (err, docs) {
        for(test of docs) {
            let channel = client.channels.cache.get(test.channelid);
            let time;
            if(test.hour == 0) {
                time = "12:" + test.minutes + " AM";
            }
            else if(test.hour == 12) {
                time = "12:" + test.minutes + " PM";
            }
            else if(test.hour < 12) {
                time = test.hour + ":" + test.minutes + " AM";
            }
            else {
                time = test.hour%12 + ":" + test.minutes + " PM";
            }
            let theDate;
            if(test.month == month && test.date == date) {
                theDate = "today";
            }
            else {
                theDate = "on " + test.month + "/" + test.date;
            }
            let person
            if(test.decision === "Y" || test.decision === "y") {
                person = "@everyone";
            }
            else {
                person = test.user;
            }
            channel.send("❗ " + person + " There is a test for " + test.name + " " + theDate + " at " + time + " ❗");
        }
    })
    Quiz.find({}, function (err, docs) {
        for(quiz of docs) {
            let channel = client.channels.cache.get(quiz.channelid);
            let time;
            if(quiz.hour == 0) {
                time = "12:" + quiz.minutes + " AM";
            }
            else if(quiz.hour == 12) {
                time = "12:" + quiz.minutes + " PM";
            }
            else if(quiz.hour < 12) {
                time = quiz.hour + ":" + quiz.minutes + " AM";
            }
            else {
                time = quiz.hour%12 + ":" + quiz.minutes + " PM";
            }
            let theDate;
            if(quiz.month == month && quiz.date == date) {
                theDate = "Today";
            }
            else {
                theDate = "on " + quiz.month + "/" + quiz.date;
            }
            let person;
            if(quiz.decision === "Y" || quiz.decision === "y") {
                person = "@everyone";
            }
            else {
                person = quiz.user;
            }
            channel.send("❗ " + person + " There is a quiz for " + quiz.name + " " + theDate + " at " + time + " ❗");
        }
    }) 
    Homework.find({}, function (err, docs) {
        for(homework of docs) {
            let channel = client.channels.cache.get(homework.channelid);
            let time;
            if(homework.hour == 0) {
                time = "12:" + homework.minutes + " AM";
            }
            else if(homework.hour == 12) {
                time = "12:" + homework.minutes + " PM";
            }
            else if(homework.hour < 12) {
                time = homework.hour + ":" + homework.minutes + " AM";
            }
            else {
                time = homework.hour%12 + ":" + homework.minutes + " PM";
            }
            let theDate;
            if(homework.month == month && homework.date == date) {
                theDate = "Today";
            }
            else {
                theDate = "on " + homework.month + "/" + homework.date;
            }
            let person;
            if(homework.decision == "Y" || homework.decision == "y") {
                person = "@everyone";
            }
            else {
                person = homework.user;
            }
            channel.send("❗ " + person + " Homework is due for " + homework.name + " " + theDate + " at " + time + " ❗");
        }
    })
}

function reminderNow() {
        let d = new Date();
        let hour = d.getHours();
        let minutes = d.getMinutes();
        let day;
        switch(d.getDay()) {
            case 1:
                day = "M";
                break;
            case 2:
                day = "T";
                break;
            case 3:
                day = "W";
                break;
            case 4:
                day = "TH";
                break;
            case 5:
                day = "F";
                break;
            default: 
                day = null;
        }
        // Send a message to the channels that have classes right now, or tests/quizzes/hw due now
        Class.find({ $and: [{ day: day }, { hour: hour }, { minutes: minutes }] }, function (err, docs) {
            for(theClass of docs) {
                let channel = client.channels.cache.get(theClass.channelid);
                let time;
                if(theClass.hour == 0) {
                    time = "12:" + theClass.minutes + " AM";
                }
                else if(theClass.hour == 12) {
                    time = "12:" + theClass.minutes + " PM";
                }
                else if(theClass.hour < 12) {
                    time = theClass.hour + ":" + theClass.minutes + " AM";
                }
                else {
                    time = theClass.hour%12 + ":" + theClass.minutes + " PM";
                }
                let person;
                if(theClass.decision == "Y" || theClass.decision == "y") {
                    person = "@everyone";
                }
                else {
                    person = theClass.user;
                }
                channel.send("❗ " + person + " There is a " + theClass.name + " class now at " + time + ", " + theClass.link + " ❗");
            }
        }) 
}

function checkDates() {
    // Check if we've passed the dates on tests, quizzes, and hw. If so, we remove it from the database
    let d = new Date();
    let date = d.getDate();
    let month = d.getMonth() + 1;
    let hour = d.getHours();
    Test.find({ $and: [{ month: `${month}` }, { date: `${date}` }] }, function (err, docs) {
        for(test of docs) {
            if(test.hour < hour) {
                Test.deleteOne({ _id: test._id }, function (err, numRemoved) {
                });
            }
        }
    })
    Quiz.find({ $and: [{ month: `${month}` }, { date: `${date}` }] }, function (err, docs) {
        for(quiz of docs) {
            if(quiz.hour < hour) {
                Quiz.deleteOne({ _id: quiz._id }, function (err, numRemoved) {
                });
            }
        }
    })
    Homework.find({ $and: [{ month: `${month}` }, { date: `${date}` }] }, function (err, docs) {
        for(homework of docs) {
            if(homework.hour < hour) {
                Homework.deleteOne({ _id: homework._id }, function (err, numRemoved) {
                });
            }
        }
    })
}