const { MessageEmbed } = require("discord.js");
const USERS = require("../models/users");

module.exports.run = async (client, interaction, options) => {
    const assign = (num) => {
        switch (num) {
            case 1: return "🥇"
            case 2: return "🥈"
            case 3: return "🥉"
            case 4: return "4️⃣"
            case 5: return "5️⃣"
            case 6: return "6️⃣"
            case 7: return "7️⃣"
            case 8: return "8️⃣"
            case 9: return "9️⃣"
            case 10: return "🔟"
        }
    }
    let users = await USERS.find({}).sort([["points", "descending"]]).limit(10);
    let winners = "";
    for (i = 0; i < users.length; i++) {
        let user = await client.users.fetch(users[i].id).catch(() => { });
        if (!user) return;
        else winners += `**${assign(i + 1)} <@${user.id}> (\`${users[i].points}\`)**\n`
    }
    interaction.reply({
        embeds: [
            new MessageEmbed()
                .setAuthor({ name: "Monthly leaderboard for dinosaurs guess game" })
                .setColor("GOLD")
                .setDescription(winners ? winners : "**No users to log at the moment...**")
        ]
    })
}

module.exports.help = {
    name: "leaderboard",
    description: "Leaderboard for dinosaurs game",
    options: []
}

module.exports.requirements = {
    userPerms: [],
    clientPerms: []
}