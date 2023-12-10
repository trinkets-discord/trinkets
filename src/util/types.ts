import { Client, CommandInteraction, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "discord.js";

export type SlashCommand = {
    data: | Omit<SlashCommandBuilder, "addSubcommandGroup" | "addSubcommand">
    | SlashCommandSubcommandsOnlyBuilder;
    userPermissions: Array<bigint>;
    botPermissions: Array<bigint>;
    run: (client: Client, interaction: CommandInteraction) => Promise<any>;
}

export type TrinketType = {
    name: string;
    image: string;
    tier?: Tier;
}

export type Tier = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | "custom";
