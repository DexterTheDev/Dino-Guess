const { MessageEmbed } = require("discord.js");
const { ImgurClient } = require('imgur');
const ImgurClientFetcher = new ImgurClient({ clientId: "072f418aaba7669" });
const limit = new Map();
const USERS = require("../models/users");

module.exports.run = async (client, interaction, options) => {
    if (interaction.channelId === client.config.gameChannel) {
        if (limit.get("running")) interaction.reply({ content: "**There's already game started**", ephemeral: true })
        else {
            const randomValue = Object.entries(client.config.dinosaurs)[Math.floor(Math.random() * Object.entries(client.config.dinosaurs).length)]
            const dino = {
                image: randomValue[0],
                name: randomValue[1]
            }
            console.log(dino.name)
            limit.set("running", true);
            const channel = client.guilds.cache.get(interaction.guildId).channels.cache.get(interaction.channelId);
            channel.send({
                embeds: [
                    new MessageEmbed()
                        .setAuthor({ name: "Guess the Dinosaur!" })
                        .setColor("GREEN")
                        .setImage(`https://i.imgur.com/${dino.image?.split("a/")[1] ? (await ImgurClientFetcher.getAlbum(dino.image?.split("a/")[1])).data.cover : dino.image.split("com/")[1]}.jpeg`)
                        .setFooter({ text: "You have 10 minutes to guess the dino" })
                ]
            }).then(msg => {
                const filter = m => m.content?.toLowerCase().includes(dino.name.toLowerCase());
                const collector = interaction.channel.createMessageCollector({ filter, time: 10 * 60000, max: 1 });
                let winner = false;
                collector.on('collect', async m => {
                    m.channel.send({
                        embeds: [new MessageEmbed()
                            .setColor("GREEN")
                            .setDescription(`${m.author} is the winner, the true guess is **${dino.name}**`)
                            .setImage(client.config.winnerGifs[Math.floor(Math.random() * client.config.winnerGifs.length)])
                        ]
                    });
                    winner = true;
                    let user = await USERS.findOne({ id: m.author.id });
                    if (!user) await new USERS({ id: m.author.id, points: 1 }).save();
                    else {
                        user.points += 1
                        await user.save();
                    }
                    collector.stop();
                });

                collector.on('end', collected => {
                    if (!winner) channel.send(`No one has reached the right answer, **${dino.name}**`)
                    limit.set("running", false);
                });
            })
            interaction.reply({ content: "**Game has been started...**", ephemeral: true })
        }
    } else interaction.reply({ content: `**Use the right channel (<#${client.config.gameChannel}>)**`, ephemeral: true })
}

module.exports.help = {
    name: "guessdino",
    description: "Guess Dino Game",
    options: []
}

module.exports.requirements = {
    userPerms: [],
    clientPerms: []
}