let Discord = require('discord.js')
require('dotenv').config()
let client = new Discord.Client()
let d = new Date()

client.login(process.env.DISCORD_KEY)

client.on('ready', () => {
    console.log("Connected as " + client.user.tag)

    client.user.setActivity("with Javascript")

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
            break
    }

     setInterval(() => {
         console.log(classes)
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
           channel.send(tests[n].name);
         }
        }
        if(quizzes.length >= 1) {
            for(var n = 0; n < quizzes.length; n++) {
              let channel = client.channels.cache.get(quizzes[n].channelid)
              channel.send(quizzes[n].name);
            }
           }
        if(hw.length >= 1) {
            for(var n = 0; n < hw.length; n++) {
            let channel = client.channels.cache.get(hw[n].channelid)
            channel.send(hw[n].name);
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
                    + "`!addtest [class name] [day of the week (M-T-W-TH-F)] [time from 0-23]` \n"
                    + "`!removetest [class name]` \n"
                    + "`!addquiz [class name] [day of the week (M-T-W-TH-F)] [time from 0-23]` \n" 
                    + "`!removequiz [class name]` \n" 
                    + "`!addhw [class name] [day of the week (M-T-W-TH-F)] [due date (time from 0-23)]` \n" 
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
    else if(arguments[3] <= 0 || arguments[3] > 24) {
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
    if(arguments.length != 3) {
        msg.channel.send("Invalid arguments. Try `!addtest [class of test] [day of the week (M-T-W-TH-F)] [time from 0-23]`")
        return
    }
    else if(arguments[1] != "M" && arguments[1] != "T" && arguments[1] != "W" && arguments[1] != "TH" && arguments[1] != "F") {
        msg.channel.send("Invalid day, try M-T-W-TH-F") 
        return
    }
    else if(arguments[2] <= 0 || arguments[2] > 24) {
        msg.channel.send("Invalid time, try between 0-23")
        return
    }
    let newTest = {
        name: arguments[0],
        day:  arguments[1],
        time: arguments[2],
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
    if(arguments.length != 3) {
        msg.channel.send("Invalid arguments. Try `!addquiz [class of test] [day of the week (M-T-W-TH-F)] [time from 0-23]`")
        return
    }
    else if(arguments[1] != "M" && arguments[1] != "T" && arguments[1] != "W" && arguments[1] != "TH" && arguments[1] != "F") {
        msg.channel.send("Invalid day, try M-T-W-TH-F") 
        return
    }
    else if(arguments[2] <= 0 || arguments[2] > 24) {
        msg.channel.send("Invalid time, try between 0-23")
        return
    }
    let newQuiz = {
        name: arguments[0],
        day:  arguments[1],
        time: arguments[2],
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
    if(arguments.length != 3) {
        msg.channel.send("Invalid arguments. Try `!addhw [class of test] [day of the week (M-T-W-TH-F)] [time from 0-23]`")
        return
    }
    else if(arguments[1] != "M" && arguments[1] != "T" && arguments[1] != "W" && arguments[1] != "TH" && arguments[1] != "F") {
        msg.channel.send("Invalid day, try M-T-W-TH-F") 
        return
    }
    else if(arguments[2] <= 0 || arguments[2] > 24) {
        msg.channel.send("Invalid time, try between 0-23")
        return
    }
    let newHw = {
        name: arguments[0],
        day:  arguments[1],
        time: arguments[2],
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
