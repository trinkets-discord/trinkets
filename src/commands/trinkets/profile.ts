import { PermissionsBitField, SlashCommandBuilder } from "discord.js";
import Player, { PlayerClass } from "../../models/player";
import { SlashCommand } from "../../util/types";


const profile: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("profile")
        .setDescription("Your trinket profile!")
        .setDMPermission(false)
    ,
    userPermissions: [PermissionsBitField.Flags.SendMessages],
    botPermissions: [PermissionsBitField.Flags.SendMessages],
    run: async (client, interaction) => {
        await interaction.deferReply().catch(() => null);

        let userData = await Player.findOne({
            name: interaction.user.username
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
        let embed = await userClass.profile();

        if (interaction.replied) return;
        if (interaction.deferred)
            return await interaction.editReply({ embeds: [embed] });
    }
}

module.exports = profile;