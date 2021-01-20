<h1 align="center">Zoomin' Discord Bot</h1>
<p align="center">A discord bot that reminds users when they have a class, test, quiz or homework due!</p>
<p align="center">
  <img src="/images/zoomin.png">
</p>

## How It Works
<p>Users are able to add their classes, assignments, tests, or quizzes through commands.</p>
<p>Data is stored on the bot through mongoose and MongoDB, used only for reminding users of their class events.</p>
<p>The bot checks at 7 AM for any tests, quizzes or assignments to remind the user that may be due soon, and will check for class sessions to remind them at the time that they start.</p>
<p>The bot is currently hosted on Heroku and was developed using Node.js, using packages such as mongoose, discord.js, cron, and moment-timezone.</p>
