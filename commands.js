let { Class, Test, Quiz, Homework } = require("./database.js");
let Discord = require("discord.js");

function processCommand(msg) {
    // split the command and arguments
    let full = msg.content.substr(1);
    let split = full.split(" ");
    let command = split[0];
    let arguments = split.slice(1);

    // all of the commands the bot provides
    if(command == "help") {
        help(msg);
    }
    else if(command == "addclass") {
         addClass(arguments, msg);
     }
    else if(command == "removeclass") {
         removeClass(arguments, msg);
     }
    else if(command == "addtest") {
        addTest(arguments, msg);
    }
    else if(command == "removetest") {
        removeTest(arguments, msg);
    }
    else if(command == "addquiz") {
        addQuiz(arguments, msg);
    }
    else if(command == "removequiz") {
        removeQuiz(arguments, msg);
    }
    else if(command == "addhomework") {
        addHomework(arguments, msg);
    }
    else if(command == "removehomework") {
         removeHomework(arguments, msg);
    }
    else if(command == "seeclasses") {
        seeClasses(msg);
    }
    else if(command == "seetests") {
        seeTests(msg);
    }
    else if(command == "seequizzes") {
        seeQuizzes(msg);
    }
    else if(command == "seehomeworks") {
        seeHomeworks(msg);
    }
    else if(command == "code") {
        code(msg);
    }
    else {
        msg.reply("that is an unknown command. Try `!help`");
    }
}

function help(msg) {
    msg.reply("i'm not sure what you need help with. Try these commands: \n"
                    + "`!addclass [class name] [zoom link] [day of the week (M-T-W-TH-F)] [meeting time from 0:00-23:59] [Y to notify @everyone, N to notify only yourself]` \n"
                    + "`!addtest [class name] test date [month 1-12)] [date (1-31)] [time from 0:00-23:59] [Y to notify @everyone, N to notify only yourself]` \n"
                    + "`!addquiz [class name] quiz date [month (1-12)] [date (1-31)] [time from 0:00-23:59] [Y to notify @everyone, N to notify only yourself]` \n" 
                    + "`!addhomework [class name] deadline [month (1-12)] [date (1-31)] [time from 0:00-23:59] [Y to notify @everyone, N to notify only yourself]` \n" 
                    + "`!removeclass [class name]` `!removetest [class name]` `!removequiz [class name]` `!removehomework [class name]` \n"
                    + "To see your already existing list of entries, use `!seeclasses` `!seetests` `!seequizzes` or `!seehomeworks`\n"
                    + "or if you want to see how the bot was coded, use `!code`");
}
function code(msg) {
    msg.reply("this bot was coded using Javascript. The documentation can be found at https://github.com/alfredzhuang/zoomin");
}

 function addClass(arguments, msg) {
    if(arguments.length != 5) {
        msg.reply("invalid arguments. Try `!addclass [class name] [zoom link] [day of the week] [time from 0:00-23:59] [Y to notify @everyone, N to notify only yourself]`");
        return;
    }
    let time = validateClass(arguments, msg);
    if(time == null) {
        return;
    }
    let newClass = new Class({
        name: arguments[0],
        link: arguments[1],
        day:  arguments[2],
        hour: time[0],
        minutes: time[1],
        decision: arguments[4], 
        user: msg.author.toString(),
        channelid: msg.channel.id
    });
    newClass.save();
    msg.reply("your class was added!");
}
 function removeClass(arguments, msg) {
     if(arguments.length != 1) {
        msg.reply("invalid argument. Try `!removeclass [class name]`");
        return;
     }
     Class.deleteMany({ $and: [{ name: arguments[0] }, { user: msg.author.toString() }, { channelid: msg.channel.id }] }, function (err, numRemoved) {
        if(numRemoved.deletedCount >= 1) {
            msg.reply("your class was removed!");
            return;
        }
        else {
            msg.reply("invalid name of class");
            return;
        }
    })
 }

 function validateClass(arguments, msg) {
    if(arguments[2] != "M" && arguments[2] != "T" && arguments[2] != "W" && arguments[2] != "TH" && arguments[2] != "F") {
        msg.reply("invalid day, try M-T-W-TH-F") ;
        return null;
    }
    else if(!arguments[3].includes(":")) {
        msg.reply("invalid time, try between 0:00-23:59");
        return null;
    }
    else if(arguments[4] != "Y" && arguments[4] != "y" && arguments[4] != "N" && arguments[4] != "n") {
        msg.reply("invalid Letter, try Y or N");
        return null;
    }
    let time = arguments[3].split(":");
    if(time[0] < 0 || time[0] > 23) {
        msg.reply("invalid time, try between 0:00-23:59");
        return null;
    }
    else if(time[1] < 0 || time[1] > 59 || time[1].length != 2) {
        msg.reply("invalid time, try between 0:00-23:59");
        return null;
    }
    return time;
 }

 function addTest(arguments, msg) {
    if(arguments.length != 5) {
        msg.reply("invalid arguments. Try `!addtest [class of test] test date [month (1-12)] [date (1-31)] [time from 0:00-23:59] [Y to notify @everyone, N to notify only yourself]`");
        return;
    }
    let time = validateArguments(arguments, msg);
    if(time == null) {
        return;
    }
    let newTest = new Test({
        name: arguments[0],
        month:  arguments[1],
        date: arguments[2],
        hour: time[0],
        minutes: time[1],
        decision: arguments[4],
        user: msg.author.toString(),
        channelid: msg.channel.id
    });
    newTest.save();
    msg.reply("your test was added!");
 }
 function removeTest(arguments, msg) {
    if(arguments.length != 1) {
        msg.reply("invalid argument. Try `!removetest [class name]`");
        return;
    }
    Test.deleteOne({ $and: [{ name: arguments[0] }, { user: msg.author.toString() }, { channelid: msg.channel.id}] }, function (err, numRemoved) {
        if(numRemoved.deletedCount == 1) {
            msg.reply("your test was removed!");
            return;
        }
        else {
            msg.reply("invalid test name");
            return;
        }
    })
 }
 function addQuiz(arguments, msg) {
    if(arguments.length != 5) {
        msg.reply("invalid arguments. Try `!addquiz [class of test] quiz date [month (1-12)] [date (1-31)] [time from 0:00-23:59] [Y to notify @everyone, N to notify only yourself]`");
        return;
    }
    let time = validateArguments(arguments, msg);
    if(time == null) {
        return;
    }
    let newQuiz = new Quiz({
        name: arguments[0],
        month:  arguments[1],
        date: arguments[2],
        hour: time[0],
        minutes: time[1],
        decision: arguments[4],
        user: msg.author.toString(),
        channelid: msg.channel.id
    });
    newQuiz.save();
    msg.reply("your quiz was added!");
}
 function removeQuiz(arguments, msg) {
    if(arguments.length != 1) {
        msg.reply("invalid argument. Try `!removequiz [class name]`");
        return;
    }
    Quiz.deleteOne({ $and: [{ name: arguments[0] }, { user: msg.author.toString() }, { channelid: msg.channel.id }] }, function (err, numRemoved) {
        if(numRemoved.deletedCount == 1) {
            msg.reply("your quiz was removed!");
            return;
        }
        else {
            msg.reply("invalid quiz name");
            return;
        }
    })
 }
 function addHomework(arguments, msg) {
    if(arguments.length != 5) {
        msg.reply("invalid arguments. Try `!addhomework [class of test] deadline [month (1-12)] [date (1-31)] [time from 0:00-23:59] [Y to notify @everyone, N to notify only yourself]`");
        return;
    }
    let time = validateArguments(arguments, msg);
    if(time == null) {
        return;
    }
    let newHomework = new Homework({
        name: arguments[0],
        month: arguments[1],
        date: arguments[2],
        hour: time[0],
        minutes: time[1],
        decision: arguments[4],
        user: msg.author.toString(),
        channelid: msg.channel.id
    });
    newHomework.save();
    msg.reply("your homework was added!");
 }
 function removeHomework(arguments, msg) {
    if(arguments.length != 1) {
        msg.reply("invalid argument. Try `!removehomework [class name]`");
        return;
    }
    Homework.deleteOne({ $and: [{ name: arguments[0] }, { user: msg.author.toString() }, { channelid: msg.channel.id }] }, function (err, numRemoved) {
        if(numRemoved.deletedCount == 1) {
            msg.reply("your homework was removed!");
            return;
        }
        else {
            msg.reply("invalid homework name");
            return;
        }
      })
 }

 function validateArguments(arguments, msg) {
    if (arguments[1] < 1 || arguments[1] > 12) {
        msg.reply("invalid month, try between 1-12") ;
        return null;
    }
    else if(!arguments[3].includes(":")) {
        msg.reply("invalid time, try between 0:00-23:59");
        return null;
    }
    else if(arguments[4] != "Y" && arguments[4] != "y" && arguments[4] != "N" && arguments[4] != "n") {
        msg.reply("invalid Letter, try Y or N");
        return null;
    }
    if(arguments[1] == 4 || arguments[1] == 6 || arguments[1] == 9 || arguments[1] == 11) {
        if(arguments[2] < 0 || arguments[2] > 30) {
            msg.reply("invalid date, there are only 30 days in that month");
            return null;
        }
    }
    else if(arguments[1] == 2) {
        let d = new Date();
        let year = d.getFullYear();
        if((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
            if(arguments[2] < 0 || arguments[2] > 29) {
                msg.reply("invalid date, there are only 29 days in that month");
                return null;
            }
            else {
                msg.reply("invalid date, there are only 28 days in that month");
                return null;
            }
        }
    }
    else {
        if(arguments[2] < 0 || arguments[2] > 31) {
            msg.reply("invalid date, there are only 31 days in that month");
            return null;
        }
    }
    let time = arguments[3].split(":");
    if(time[0] < 0 || time[0] > 23) {
        msg.reply("invalid time, try between 0:00-23:59");
        return null;
    }
    else if(time[1] < 0 || time[1] > 59 || time[1].length != 2) {
        msg.reply("invalid time, try between 0:00-23:59");
        return null;
    }
    return time;
 }

 function seeClasses(msg) {
    Class.find({ $and: [{ channelid: msg.channel.id }, { user: msg.author.toString() }] }, function (err, docs) {
        if(docs.length === 0) {
            msg.reply("you currently have no existing classes in this channel");
            return;
        }
        let count = 0;
        for(item of docs) {
            msg.reply("class " + (count+1) + ": " + item.name + " - " + item.link + " - " + item.day + " - " + item.hour + ":" + item.minutes);
            count++;
        }
    })
 }
 function seeTests(msg) {
    Test.find({ $and: [{ channelid: msg.channel.id }, { user: msg.author.toString() }] }, function (err, docs) {
        if(docs.length == 0) {
            msg.reply("you currently have no existing tests in this channel");
            return;
        }
        let count = 0;
        for(item of docs) {
            msg.reply("test " + (count+1) + ": " + item.name + " - " + item.month + "/" + item.date + " - " + item.hour + ":" + item.minutes);
            count++;
        }
    })
    
 }
 function seeQuizzes(msg) {
    Quiz.find({ $and: [{ channelid: msg.channel.id }, { user: msg.author.toString() }] }, function (err, docs) {
        if(docs.length == 0) {
            msg.reply("you currently have no existing quizzes in this channel");
            return;
        }
        let count = 0;
        for(item of docs) {
            msg.reply("quiz " + (count+1) + ": " + item.name + " - " + item.month + "/" + item.date + " - " + item.hour + ":" + item.minutes);
            count++;
        }
    })
 }
 function seeHomeworks(msg) {
    Homework.find({ $and: [{ channelid: msg.channel.id }, { user: msg.author.toString() }] }, function (err, docs) {
        if(docs.length === 0) {
            msg.reply("you currently have no existing homeworks in this channel");
            return;
        }
        let count = 0;
        for(item of docs) {
            msg.reply("homework " + (count+1) + ": " + item.name + " - " + item.month + "/" + item.date + " - " + item.hour + ":" + item.minutes);
            count++;
        }
    })
 }

 module.exports = { processCommand };