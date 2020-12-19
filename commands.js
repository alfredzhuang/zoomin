let Datastore = require('nedb')
let classes = new Datastore('database/classes.db')
classes.loadDatabase()
let tests = new Datastore('database/tests.db')
tests.loadDatabase()
let quizzes = new Datastore('database/quizzes.db')
quizzes.loadDatabase()
let hw = new Datastore('database/hw.db')
hw.loadDatabase()

function processCommand(msg) {
    // split the command and arguments
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
    else if(command == "seeclasses") {
        seeClasses(msg)
    }
    else if(command == "seetests") {
        seeTests(msg)
    }
    else if(command == "seequizzes") {
        seeQuizzes(msg)
    }
    else if(command == "seehomeworks") {
        seeHomeworks(msg)
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
                    + "`!addclass [class name] [zoom link] [day of the week (M-T-W-TH-F)] [meeting time from 0:00-23:59] [Y to notify @everyone, N to notify only yourself]` \n"
                    + "`!removeclass [class name]` \n"
                    + "`!addtest [class name] test date [month 1-12)] [date (1-31)] [time from 0:00-23:59] [Y to notify @everyone, N to notify only yourself]` \n"
                    + "`!removetest [class name]` \n"
                    + "`!addquiz [class name] quiz date [month (1-12)] [date (1-31)] [time from 0:00-23:59] [Y to notify @everyone, N to notify only yourself]` \n" 
                    + "`!removequiz [class name]` \n" 
                    + "`!addhw [class name] deadline [month (1-12)] [date (1-31)] [time from 0:00-23:59] [Y to notify @everyone, N to notify only yourself]` \n" 
                    + "`!removehw [class name]`\n"
                    + "To see the existing list of classes, use `!seeclasses`\n"
                    + "To see the existing list of tests, use `!seetests`\n"
                    + "To see the existing list of quizzes, use `!seequizzes`\n"
                    + "To see the existing list of homework, use `!seehomeworks`\n"
                    + "or if you want to see the code, use `!code`")
}
function code(msg) {
    msg.channel.send("This bot was coded using Javascript, you can look at the documentation at https://github.com/alfredzhuang/zoomin")
}

 function addClass(arguments, msg) {
    if(arguments.length != 5) {
        msg.channel.send("Invalid arguments. Try `!addclass [class name] [zoom link] [day of the week] [time from 0:00-23:59] [Y to notify @everyone, N to notify only yourself]`")
        return
    }
    let time = validateClass(arguments, msg) 
    if(time == null) {
        return
    }
    let newClass = {
        name: arguments[0],
        link: arguments[1],
        day:  arguments[2],
        hour: time[0],
        minutes: time[1],
        decision: arguments[4], 
        user: msg.author.toString(),
        channelid: msg.channel.id
    }
    classes.insert(newClass)
    msg.channel.send("Class added!")
}
 function removeClass(arguments, msg) {
     if(arguments.length != 1) {
        msg.channel.send("Invalid argument. Try `!removeclass [class name]`")
        return
     }
     classes.remove({ $and: [{ name: arguments[0] }, { user: msg.author.toString() }] }, {}, function (err, numRemoved) {
        if(numRemoved == 1) {
            msg.channel.send("Class removed!")
            return
        }
        else {
            msg.channel.send("Invalid name of class")
            return
        }
    })
 }

 function validateClass(arguments, msg) {
    if(arguments[2] != "M" && arguments[2] != "T" && arguments[2] != "W" && arguments[2] != "TH" && arguments[2] != "F") {
        msg.channel.send("Invalid day, try M-T-W-TH-F") 
        return null
    }
    else if(!arguments[3].includes(":")) {
        msg.channel.send("Invalid time, try between 0:00-23:59")
        return null
    }
    else if(arguments[4] != "Y" && arguments[4] != "y" && arguments[4] != "N" && arguments[4] != "n") {
        msg.channel.send("Invalid Letter, try Y or N")
        return null
    }
    let time = arguments[3].split(":")
    if(time[0] < 0 || time[0] > 23) {
        msg.channel.send("Invalid time, try between 0:00-23:59")
        return null
    }
    else if(time[1] < 0 || time[1] > 59 || time[1].length != 2) {
        msg.channel.send("Invalid time, try between 0:00-23:59")
        return null
    }
    return time
 }

 function addTest(arguments, msg) {
    if(arguments.length != 5) {
        msg.channel.send("Invalid arguments. Try `!addtest [class of test] test date [month (1-12)] [date (1-31)] [time from 0:00-23:59] [Y to notify @everyone, N to notify only yourself]`")
        return
    }
    let time = validateArguments(arguments, msg)
    if(time == null) {
        return
    }
    let newTest = {
        name: arguments[0],
        month:  arguments[1],
        date: arguments[2],
        hour: time[0],
        minutes: time[1],
        decision: arguments[4],
        user: msg.author.toString(),
        channelid: msg.channel.id
    }
    tests.insert(newTest)
    msg.channel.send("Test added!")
 }
 function removeTest(arguments, msg) {
    if(arguments.length != 1) {
        msg.channel.send("Invalid argument. Try `!removetest [class name]`")
        return
    }
    tests.remove({ $and: [{ name: arguments[0] }, { user: msg.author.toString() }] }, {}, function (err, numRemoved) {
        if(numRemoved == 1) {
            msg.channel.send("Test removed!")
            return
        }
        else {
            msg.channel.send("Invalid test name")
            return
        }
    })
 }
 function addQuiz(arguments, msg) {
    if(arguments.length != 5) {
        msg.channel.send("Invalid arguments. Try `!addquiz [class of test] quiz date [month (1-12)] [date (1-31)] [time from 0:00-23:59] [Y to notify @everyone, N to notify only yourself]`")
        return
    }
    let time = validateArguments(arguments, msg)
    if(time == null) {
        return
    }
    let newQuiz = {
        name: arguments[0],
        month:  arguments[1],
        date: arguments[2],
        hour: time[0],
        minutes: time[1],
        decision: arguments[4],
        user: msg.author.toString(),
        channelid: msg.channel.id
    }
    quizzes.insert(newQuiz)
    msg.channel.send("Quiz added!")
}
 function removeQuiz(arguments, msg) {
    if(arguments.length != 1) {
        msg.channel.send("Invalid argument. Try `!removequiz [class name]`")
        return
    }
    quizzes.remove({ $and: [{ name: arguments[0] }, { user: msg.author.toString() }] }, {}, function (err, numRemoved) {
        if(numRemoved == 1) {
            msg.channel.send("Quiz removed!")
            return
        }
        else {
            msg.channel.send("Invalid quiz name")
            return
        }
    })
 }
 function addHw(arguments, msg) {
    if(arguments.length != 5) {
        msg.channel.send("Invalid arguments. Try `!addhw [class of test] deadline [month (1-12)] [date (1-31)] [time from 0:00-23:59] [Y to notify @everyone, N to notify only yourself]`")
        return
    }
    let time = validateArguments(arguments, msg)
    if(time == null) {
        return
    }
    let newHw = {
        name: arguments[0],
        month: arguments[1],
        date: arguments[2],
        hour: time[0],
        minutes: time[1],
        decision: arguments[4],
        user: msg.author.toString(),
        channelid: msg.channel.id
    }
    hw.insert(newHw)
    msg.channel.send("Homework added!")
 }
 function removeHw(arguments, msg) {
    if(arguments.length != 1) {
        msg.channel.send("Invalid argument. Try `!removehw [class name]`")
        return
    }
    hw.remove({ $and: [{ name: arguments[0] }, { user: msg.author.toString() }] }, {}, function (err, numRemoved) {
        if(numRemoved == 1) {
            msg.channel.send("Homework removed!")
            return
        }
        else {
            msg.channel.send("Invalid homework name")
            return
        }
      })
 }

 function validateArguments(arguments, msg) {
    if (arguments[1] < 1 || arguments[1] > 12) {
        msg.channel.send("Invalid month, try between 1-12") 
        return null
    }
    else if(!arguments[3].includes(":")) {
        msg.channel.send("Invalid time, try between 0:00-23:59")
        return null
    }
    else if(arguments[4] != "Y" && arguments[4] != "y" && arguments[4] != "N" && arguments[4] != "n") {
        msg.channel.send("Invalid Letter, try Y or N")
        return null
    }
    if(arguments[1] == 4 || arguments[1] == 6 || arguments[1] == 9 || arguments[1] == 11) {
        if(arguments[2] < 0 || arguments[2] > 30) {
            msg.channel.send("Invalid date, there are only 30 days in that month")
            return null
        }
    }
    else if(arguments[1] == 2) {
        let d = new Date()
        let year = d.getFullYear()
        if((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
            if(arguments[2] < 0 || arguments[2] > 29) {
                msg.channel.send("Invalid date, there are only 29 days in that month")
                return null
            }
            else {
                msg.channel.send("Invalid date, there are only 28 days in that month")
                return null
            }
        }
    }
    else {
        if(arguments[2] < 0 || arguments[2] > 31) {
            msg.channel.send("Invalid date, there are only 31 days in that month")
            return null
        }
    }
    let time = arguments[3].split(":")
    if(time[0] < 0 || time[0] > 23) {
        msg.channel.send("Invalid time, try between 0:00-23:59")
        return null
    }
    else if(time[1] < 0 || time[1] > 59 || time[1].length != 2) {
        msg.channel.send("Invalid time, try between 0:00-23:59")
        return null
    }
    return time
 }

 function seeClasses(msg) {
    if(classes.length == 0) {
        msg.channel.send("There are currently no existing classes")
        return
    }
    else {
        classes.find({ $and: [{ channelid: msg.channel.id }, { user: msg.author.toString() }] }, function (err, docs) {
            let count = 0
            for(item of docs) {
                msg.channel.send("Class " + (count+1) + ": " + item.name + " - " + item.link + " - " + item.day + " - " + item.hour + ":" + item.minutes)
                count++
            }
            if(count == 0) {
                msg.channel.send("There are currently no existing classes")
                return
            }
        })
    }
 }
 function seeTests(msg) {
    if(tests.length == 0) {
        msg.channel.send("There are currently no existing tests")
        return
    }
    else {
        tests.find({ $and: [{ channelid: msg.channel.id }, { user: msg.author.toString() }] }, function (err, docs) {
            let count = 0
            for(item of docs) {
                msg.channel.send("Test " + (count+1) + ": " + item.name + " - " + item.month + "/" + item.date + " - " + item.hour + ":" + item.minutes)
                count++
            }
            if(count == 0) {
                msg.channel.send("There are currently no existing tests")
                return
            }
        })
    }
 }
 function seeQuizzes(msg) {
    if(quizzes.length == 0) {
        msg.channel.send("There are currently no existing quizzes")
        return
    }
    else {
        quizzes.find({ $and: [{ channelid: msg.channel.id }, { user: msg.author.toString() }] }, function (err, docs) {
            let count = 0
            for(item of docs) {
                msg.channel.send("Quiz " + (count+1) + ": " + item.name + " - " + item.month + "/" + item.date + " - " + item.hour + ":" + item.minutes)
                count++
            }
            if(count == 0) {
                msg.channel.send("There are currently no existing quizzes")
                return
            }
        })
    }
 }
 function seeHomeworks(msg) {
    if(hw.length == 0) {
        msg.channel.send("There are currently no existing homeworks")
        return
    }
    else {
        hw.find({ $and: [{ channelid: msg.channel.id }, { user: msg.author.toString() }] }, function (err, docs) {
            let count = 0
            for(item of docs) {
                msg.channel.send("Homework " + (count+1) + ": " + item.name + " - " + item.month + "/" + item.date + " - " + item.hour + ":" + item.minutes)
                count++
            }
            if(count == 0) {
                msg.channel.send("There are currently no existing homeworks")
                return
            }
        })
    }
 }

 module.exports = { processCommand, classes, tests, quizzes, hw }