const mongoose = require("mongoose");
const CLOCK = require("../checker.js");

module.exports = async (client) => {
    (new CLOCK()).start()
    await mongoose.connect(client.config.mongodb, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, (err) => {
        if (err) return console.error(err);
        console.log(`${client.user.username} database is connected...`)
    });
    console.log(`${client.user.username} bot is connected...`);
    client.guilds.cache.map(guild => {
        commands = guild ? guild.commands : client.application?.commands
        client.commands.map(cmd => commands.create(cmd.help).catch(async () => { }));
    });
};