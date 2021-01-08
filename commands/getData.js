let moment = require("moment-timezone");

function getTime(item) {
    let time;
    if(item.hour == 0) {
        time = "12:" + item.minutes + " AM";
    }
    else if(item.hour == 12) {
        time = "12:" + item.minutes + " PM";
    }
    else if(item.hour < 12) {
        time = item.hour + ":" + item.minutes + " AM";
    }
    else {
        time = item.hour%12 + ":" + item.minutes + " PM";
    }
    return time;
}

function getPerson(item) {
    let person;
    if(item.decision == "Y" || item.decision == "y") {
        person = "@everyone";
    }
    else {
        person = item.user;
    }
    return person;
}

function getDate(item) {
    let currentMonth = moment().tz("America/Los_Angeles").format('M');
    let currentDate = moment().tz("America/Los_Angeles").format('D');
    let date;
    if(item.month == currentMonth && item.date == currentDate) {
        date = "Today";
    }
    else {
        date = "on " + item.month + "/" + item.date;
    }
    return date;
}

module.exports = { getTime, getPerson, getDate };