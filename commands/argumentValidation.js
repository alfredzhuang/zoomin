function validateMonthAndDate(month, date, msg) {
    if (month < 1 || month > 12) {
        msg.reply("invalid month, try between 1-12") ;
        return false;
    }
    if(month == 4 || month == 6 || month == 9 || month == 11) {
        if(date < 0 || date > 30) {
            msg.reply("invalid date, there are only 30 days in that month");
            return false;
        }
    }
    else if(month == 2) {
        let d = new Date();
        let year = d.getFullYear();
        if((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
            if(date < 0 || date > 29) {
                msg.reply("invalid date, there are only 29 days in that month");
                return false;
            }
            else {
                msg.reply("invalid date, there are only 28 days in that month");
                return false;
            }
        }
    }
    else {
        if(date < 0 || date > 31) {
            msg.reply("invalid date, there are only 31 days in that month");
            return false;
        }
    }
    return true;
} 

function validateDay(day, msg) {
    if(day != "M" && day != "T" && day != "W" && day != "TH" && day != "F") {
        msg.reply("invalid day, try M-T-W-TH-F") ;
        return false;
    }
    return true;
}

function validateTime(timeInput, msg) {
    if(!timeInput.includes(":")) {
        msg.reply("invalid time, try between 0:00-23:59");
        return null;
    }
    let time = timeInput.split(":");
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

function validateDecision(decision, msg) {
    if(decision != "Y" && decision != "y" && decision != "N" && decision != "n") {
        msg.reply("invalid Letter, try Y or N");
        return false;
    }
    return true;
}

module.exports = { validateMonthAndDate, validateDay, validateTime, validateDecision };