let Discord = require('discord.js')
require('dotenv').config()
let client = new Discord.Client()
let d = new Date()

client.login(process.env.DISCORD_KEY)

client.on('ready', () => {
    console.log("Connected as " + client.user.tag)

    client.user.setActivity("with Javascript")

    let date = d.getDate();
    let month = d.getMonth() + 1;
    let hour = d.getHours();
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
     setInterval(() => {
         console.log(hw)
     // bot-testing channel: 788246311731724328
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
                    channel.send("@everyone There is a " + classes[n].name + " class today at " + time + ", " + classes[n].link);
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
           channel.send("@everyone There is a test for " + tests[n].name + " " + theDate + " at " + time)
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
                channel.send("@everyone There is a quiz for " + quizzes[n].name + " " + theDate + " at " + time)
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
                channel.send("@everyone Homework is due for " + hw[n].name + " " + theDate + " at " + time)
            }
        }
      }, 10000)
      //86400000
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

    // all of the commands the bot provides
    if(command == "help") {
        help(msg)
    }
    else if(command == "addclass") {
         addClass(arguments, msg)
     }
    else if(command == "removeclass") {
         removeClass(arguments, msg)
     }
    else if(command == "addtest") {
        addTest(arguments, msg)
    }
    else if(command == "removetest") {
        removeTest(arguments, msg)
    }
    else if(command == "addquiz") {
        addQuiz(arguments, msg)
    }
    else if(command == "removequiz") {
        removeQuiz(arguments, msg)
    }
    else if(command == "addhw") {
        addHw(arguments, msg)
     }
    else if(command == "removehw") {
         removeHw(arguments, msg)
     }
    else if(command == "code") {
        code(msg)
    }
    else {
        msg.channel.send("Unknown command. Try `!help`")
    }
}

function help(msg) {
    msg.channel.send("I'm not sure what you need help with. Try these commands: \n"
                    + "`!addclass [class name] [zoom link] [day of the week (M-T-W-TH-F)] [meeting time from 0-23]` \n"
                    + "`!removeclass [class name]` \n"
                    + "`!addtest [class name] test date [month 1-12)] [date (1-31)] [time from 0-23]` \n"
                    + "`!removetest [class name]` \n"
                    + "`!addquiz [class name] quiz date [month (1-12)] [date (1-31)] [time from 0-23]` \n" 
                    + "`!removequiz [class name]` \n" 
                    + "`!addhw [class name] deadline [month (1-12)] [date (1-31)] [time from 0-23]` \n" 
                    + "`!removehw [class name]`\n"
                    + "or if you want to see the code, use `!code`")
}

function code(msg) {
    msg.channel.send("This bot was coded using Javascript, you can look at the documentation at https://github.com/alfredzhuang/zoomin")
}

let classes = []
let tests = []
let quizzes = []
let hw = []

 function addClass(arguments, msg) {
    if(arguments.length != 4) {
        msg.channel.send("Invalid arguments. Try `!addclass [class name] [zoom link] [day of the week] [time from 0-23]`")
        return
    }
    else if(arguments[2] != "M" && arguments[2] != "T" && arguments[2] != "W" && arguments[2] != "TH" && arguments[2] != "F") {
        msg.channel.send("Invalid day, try M-T-W-TH-F") 
        return
    }
    else if(arguments[3] < 0 || arguments[3] > 23) {
        msg.channel.send("Invalid time, try between 0-23")
        return
    }
    let newClass = {
        name: arguments[0],
        link: arguments[1],
        day:  arguments[2],
        time: arguments[3],
        channelid: msg.channel.id
    }
    classes.push(newClass)
    msg.channel.send("Class \"" + arguments[0] + "\" added!")
}
 function removeClass(arguments, msg) {
     if(arguments.length != 1) {
        msg.channel.send("Invalid argument. Try `!removeclass [class name]`")
        return
     }
     let index = -1;
     for(var i = 0; i < classes.length; i++) {
         if(classes[i].name === arguments[0]) {
            index = i;
            break
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

 function addTest(arguments, msg) {
    if(arguments.length != 4) {
        msg.channel.send("Invalid arguments. Try `!addtest [class of test] test date [month (1-12)] [date (1-31)] [time from 0-23]`")
        return
    }
    else if(arguments[1] < 1 || arguments[1] > 12) {
        msg.channel.send("Invalid month, try between 1-12") 
        return
    }
    else if(arguments[2] < 1 || arguments[2] > 31) {
        msg.channel.send("Invalid date, try between 1-31")
        return
    }
    else if(arguments[3] < 0 || arguments[3] > 23) {
        msg.channel.send("Invalid time, try between 0-23")
        return
    }
    let newTest = {
        name: arguments[0],
        month:  arguments[1],
        date: arguments[2],
        time: arguments[3],
        channelid: msg.channel.id
    }
    tests.push(newTest)
    msg.channel.send("Test added!")
    let test = setInterval(() => {
        //check if the tests array still contains this test name or not every 12 hours? (if not, end interval and removetest)
        
    }, 10000)
 }
 function removeTest(arguments, msg) {
    if(arguments.length != 1) {
        msg.channel.send("Invalid argument. Try `!removetest [class name]`")
        return
    }
    let index = -1;
    for(var i = 0; i < tests.length; i++) {
        if(tests[i].name === arguments[0]) {
           index = i;
           break
        }
    }
    if(index > -1) {
       tests.splice(index, 1)
       msg.channel.send("Test removed!")
       return
    }
    else {
       msg.channel.send("Invalid test name")
       return
    }
 }
 function addQuiz(arguments, msg) {
    if(arguments.length != 4) {
        msg.channel.send("Invalid arguments. Try `!addquiz [class of test] quiz date [month (1-12)] [date (1-31)] [time from 0-23]`")
        return
    }
    else if(arguments[1] < 1 || arguments[1] > 12) {
        msg.channel.send("Invalid month, try between 1-12") 
        return
    }
    else if(arguments[2] < 1 || arguments[2] > 31) {
        msg.channel.send("Invalid date, try between 1-31")
        return
    }
    else if(arguments[3] < 0 || arguments[3] > 23) {
        msg.channel.send("Invalid time, try between 0-23")
        return
    }
    let newQuiz = {
        name: arguments[0],
        month:  arguments[1],
        date: arguments[2],
        time: arguments[3],
        channelid: msg.channel.id
    }
    quizzes.push(newQuiz)
    console.log(quizzes)
    msg.channel.send("Quiz added!")
}
 function removeQuiz(arguments, msg) {
    if(arguments.length != 1) {
        msg.channel.send("Invalid argument. Try `!removequiz [class name]`")
        return
    }
    let index = -1;
    for(var i = 0; i < quizzes.length; i++) {
        if(quizzes[i].name === arguments[0]) {
           index = i;
           break
        }
    }
    if(index > -1) {
       quizzes.splice(index, 1)
       msg.channel.send("Quiz removed!")
       console.log(quizzes)
       return
    }
    else {
       msg.channel.send("Invalid quiz name")
       return
    }
 }
 function addHw(arguments, msg) {
    if(arguments.length != 4) {
        msg.channel.send("Invalid arguments. Try `!addhw [class of test] deadline [month (1-12)] [date (1-31)] [time from 0-23]`")
        return
    }
    else if(arguments[1] < 1 || arguments[1] > 12) {
        msg.channel.send("Invalid month, try between 1-12") 
        return
    }
    else if(arguments[2] < 1 || arguments[2] > 31) {
        msg.channel.send("Invalid date, try between 1-31")
        return
    }
    else if(arguments[3] < 0 || arguments[3] > 23) {
        msg.channel.send("Invalid time, try between 0-23")
        return
    }
    let newHw = {
        name: arguments[0],
        month:  arguments[1],
        date: arguments[2],
        time: arguments[3],
        channelid: msg.channel.id
    }
    hw.push(newHw)
    msg.channel.send("Homework added!")
 }
 function removeHw(arguments, msg) {
    if(arguments.length != 1) {
        msg.channel.send("Invalid argument. Try `!removehw [class name]`")
        return
    }
    let index = -1;
    for(var i = 0; i < hw.length; i++) {
        if(hw[i].name === arguments[0]) {
           index = i;
           break
        }
    }
    if(index > -1) {
       hw.splice(index, 1)
       msg.channel.send("Homework removed!")
       return
    }
    else {
       msg.channel.send("Invalid homework name")
       return
    }
 }
