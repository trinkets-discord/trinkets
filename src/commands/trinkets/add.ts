import { ColorResolvable, EmbedBuilder, PermissionsBitField, SlashCommandBuilder } from "discord.js";
import { colors } from '../../config.json';
import { ItemClass } from "../../models/item";
import Player, { PlayerClass } from "../../models/player";
import { SlashCommand } from "../../util/types";

const add: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("add")
        .setDescription("Add a custom trinket to your guild")
        .setDMPermission(false)
        .addStringOption((option) => option
            .setName("name")
            .setDescription("The name of the trinket")
            .setRequired(true)
            .setMinLength(1)
            .setMaxLength(28)
        )
        .addStringOption((option) => option
            .setName("image")
            .setDescription("The image link of the trinket (.png)")
            .setRequired(true)
            .setMinLength(3)
            .setRequired(true)
        ),
    userPermissions: [PermissionsBitField.Flags.SendMessages],
    botPermissions: [PermissionsBitField.Flags.SendMessages],
    run: async (client, interaction) => {
        await interaction.deferReply().catch(() => null);

        const options = interaction.options;

        const name = options.get("name").value as string;
        const image = options.get("image").value as string;

        // user
        let userData = await Player.findOne({
            id: interaction.user.id
        });
        let userClass: PlayerClass = new PlayerClass();
        if (!userData) {
            userClass.name = interaction.user.username;
            userClass.id = interaction.user.id;
            userClass.avatar = interaction.user.displayAvatarURL();
            userClass.guildId = interaction.guildId;
            userClass.level = 1;
            userClass.experience = 0;
            userData = new Player(userClass);
            await userData.save();
        } else {
            userClass.name = userData.name!;
            userClass.id = userData.id!;
            userClass.level = userData.level!;
            userClass.avatar = userData.avatar!;
            userClass.inventory = userData.inventory!;
            userClass.experience = userData.experience!;
            userClass.guildId = userData.guildId!;
        }
        // item
        const item = new ItemClass(userClass);

        let embed = await item.build(name, image, interaction.guildId);

        embed
            .setAuthor({ name: interaction.user.displayName, iconURL: interaction.user.avatarURL() })
            .setFooter({ iconURL: client.user.avatarURL(), text: '/find' });

        if (interaction.replied) return;
        if (interaction.deferred)
            return await interaction.editReply({ embeds: [embed] });
    },
}

module.exports = add;