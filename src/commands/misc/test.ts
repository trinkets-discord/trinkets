import { ColorResolvable, EmbedBuilder, PermissionsBitField, SlashCommandBuilder } from "discord.js";
import { colors } from "../../config.json";
import { SlashCommand } from "../../util/types";

const test: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("test")
        .setDescription("test if bot is working")
        .setDMPermission(false)
    ,
    userPermissions: [PermissionsBitField.Flags.Administrator],
    botPermissions: [PermissionsBitField.Flags.Connect],
    run: async (client, interaction) => {
        const embed = new EmbedBuilder()
            .setColor(colors.transparent as ColorResolvable)
            .setDescription("working")
        await interaction.deferReply().catch(() => null)
        if (interaction.replied) return;
        if (interaction.deferred)
            return await interaction.editReply({ embeds: [embed] });
    },
}

module.exports = test;
