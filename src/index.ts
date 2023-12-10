import { config } from "dotenv";
import { Client, GatewayIntentBits } from "discord.js";
import eventHandler from "./handlers";
config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
    ],
});

eventHandler(client);

client.login(process.env.BOT_TOKEN);