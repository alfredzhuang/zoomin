let Discord = require("discord.js");
require("dotenv").config();
let client = new Discord.Client();
let { processCommand } = require("./commands/commands.js");
let { Class, Test, Quiz, Homework } = require("./database/database.js");
let { getDate, getPerson, getTime } = require("./commands/getData.js");
let cron = require("cron");
let moment = require("moment-timezone");

client.login(process.env.DISCORD_KEY);

// Bot join message
client.on('guildCreate', guild => {
    let channel = guild.channels.cache.find(channel => channel.type === 'text' && channel.permissionsFor(guild.me).has('SEND_MESSAGES'));
    channel.send("Hi, I'm Zoomin'! I'm a bot that specializes in creating reminders for students! Check out what I can do with `!help`");
});

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
});

client.on('message', (msg) => {
     if(msg.author.bot) {
         return;
     }
     // commands
     if(msg.content.startsWith("!")) {
         processCommand(msg);
     }
});

function reminder() {
    Test.find({}, function (err, docs) {
        for(test of docs) {
            let channel = client.channels.cache.get(test.channelid);
            let time = getTime(test);
            let date = getDate(test);
            let person = getPerson(test);
            channel.send(person + ", there is a test for " + test.name + " " + date + " at " + time + " ❗");
        }
    });
    Quiz.find({}, function (err, docs) {
        for(quiz of docs) {
            let channel = client.channels.cache.get(quiz.channelid);
            let time = getTime(quiz);
            let date = getDate(quiz);
            let person = getPerson(quiz);
            channel.send(person + ", there is a quiz for " + quiz.name + " " + date + " at " + time + " ❗");
        }
    });
    Homework.find({}, function (err, docs) {
        for(homework of docs) {
            let channel = client.channels.cache.get(homework.channelid);
            let time = getTime(homework);
            let date = getDate(homework);
            let person = getPerson(homework);
            channel.send(person + ", homework is due for " + homework.name + " " + date + " at " + time + " ❗");
        }
    });
}

function reminderNow() {
        let hour = moment().tz("America/Los_Angeles").format('H');
        let minutes = moment().tz("America/Los_Angeles").format('mm');
        let day = moment().tz("America/Los_Angeles").format('dddd');
        switch(day) {
            case "Monday":
                day = "M";
                break;
            case "Tuesday":
                day = "T";
                break;
            case "Wednesday":
                day = "W";
                break;
            case "Thursday":
                day = "TH";
                break;
            case "Friday":
                day = "F";
                break;
            default: 
                day = null;
        }
        // Send a message to the channels that have classes right now
        Class.find({ $and: [{ day: `${day}` }, { hour: `${hour}` }, { minutes: `${minutes}` }] }, function (err, docs) {
            for(theClass of docs) {
                let channel = client.channels.cache.get(theClass.channelid);
                let time = getTime(theClass);
                let person = getPerson(theClass);
                let embed = new Discord.MessageEmbed()
                .setTitle("❗ Class Reminder ❗")
                .addField("Class Information", theClass.name + " @ " + time)
                .addField("Meeting Link", theClass.link)
                .setColor(0xF1C40F);
                channel.send(person, embed);
            }
        });
}

function checkDates() {
    // Check if we've passed the dates on tests, quizzes, and hw. If so, we remove it from the database
    let month = moment().tz("America/Los_Angeles").format('M');
    let date = moment().tz("America/Los_Angeles").format('D');
    let hour = moment().tz("America/Los_Angeles").format('H');
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
    });
}