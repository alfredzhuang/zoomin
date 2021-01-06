require("dotenv").config();
let mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_ADDRESS, {useNewUrlParser: true, useUnifiedTopology: true});

let classesSchema = new mongoose.Schema({
    name: String,
    link: String,
    day:  String,
    hour: String,
    minutes: String,
    decision: String, 
    user: String,
    channelid: String
});
let Class = mongoose.model("Class", classesSchema);

let testsSchema = new mongoose.Schema({
    name: String,
    month:  String,
    date: String,
    hour: String,
    minutes: String,
    decision: String,
    user: String,
    channelid: String
});
let Test = mongoose.model("Test", testsSchema);

let quizzesSchema = new mongoose.Schema({
    name: String,
    month:  String,
    date: String,
    hour: String,
    minutes: String,
    decision: String,
    user: String,
    channelid: String
});
let Quiz = mongoose.model("Quiz", quizzesSchema);

let homeworksSchema = new mongoose.Schema({
    name: String,
    month:  String,
    date: String,
    hour: String,
    minutes: String,
    decision: String,
    user: String,
    channelid: String
});
let Homework = mongoose.model("Homework", homeworksSchema);

module.exports = { Class, Test, Quiz, Homework };