import { ColorResolvable, EmbedBuilder, PermissionsBitField, SlashCommandBuilder } from "discord.js";
import { colors } from '../../config.json';
import { SlashCommand } from "../../util/types";

const avatar: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("avatar")
        .setDescription("Fetch discord information")
        .setDMPermission(false)
        .addUserOption((option) => option
            .setName("user")
            .setDescription("The user's avatar you wish to fetch")
            .setRequired(true),
        ),
    userPermissions: [PermissionsBitField.Flags.SendMessages],
    botPermissions: [PermissionsBitField.Flags.EmbedLinks],
    run: async (client, interaction) => {
        await interaction.deferReply().catch(() => null)
        const options = interaction.options;
        const target = options.getUser("user");
        const avatar = target.avatarURL();
        const color = colors.default;

        const embed = new EmbedBuilder()
            .setImage(avatar)
            .setColor(color as ColorResolvable);

        if (interaction.replied) return;
        if (interaction.deferred)
            return await interaction.editReply({ embeds: [embed] });
    },
}

module.exports = avatar;