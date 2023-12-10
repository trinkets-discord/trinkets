import mongoose, { Schema } from "mongoose";
import { ColorResolvable, EmbedBuilder } from "discord.js";
import { colors, constants } from '../config.json';
import { experienceBar } from "../util/experienceBar";
import { ItemClass } from "./item";


export const userSchema = new Schema({
    name: String,
    id: String,
    level: Number,
    avatar: String,
    inventory: {type: Array<String>},
    experience: Number,
    guildId: String,
});

export class UserClass {
    name: string;
    id: string;
    level: number;
    inventory: Array<string>;
    experience: number;
    avatar: string;
    guildId: string;
    levelRate = constants.level_rate;
    defaultExp = constants.default_exp;

    async hasFoundBefore(uuid: string): Promise<boolean> {
        let userData = await this.data();

        if (userData.inventory.includes(uuid)) {
            return true;
        }

        return false;
    }

    async find(trinket: ItemClass): Promise<EmbedBuilder[]> {
        let array: Array<EmbedBuilder>;
        let embed: EmbedBuilder;

        if (!await this.hasFoundBefore(trinket.uuid)) {
            this.inventory.push(trinket.uuid);
            
            embed
                .setColor(colors.transparent as ColorResolvable)
                .setThumbnail(trinket.image)
                .setDescription(`You've already found **${trinket.name}**! \n\n+**${trinket.value.toString()}** EXP`);
            
            array.push(embed);
        } else {
            embed = trinket.embed();
            array.push(embed);
        }

        this.experience += trinket.value;

        do {
            array.push(this.levelUp());
        } while (this.experience >= this.defaultExp * this.level * this.levelRate);

        await this.data();

        return array;
    }

    levelUp() {
        this.level = this.level + 1;
        let embed: EmbedBuilder;

        embed
            .setColor(colors.success as ColorResolvable)
            .setThumbnail(this.avatar)
            .setDescription(`You leveled up!\n`)
            .addFields(
                { name: "LEVEL", value: `${this.level.toString()}`, inline: true },
                { name: "EXP", value: `${this.experience.toString()}`, inline: true }
            );

        return embed;
    }

    async data() {
        let userData = await User.findOne({
            id: this.id,
        });
        if (!userData) {
            userData = new User(this);
        }
        userData.experience = this.experience;
        userData.inventory = this.inventory;
        userData.level = this.level;
        
        await userData.save();

        return userData;
    }

    async profile(): Promise<EmbedBuilder> {
        let embed = new EmbedBuilder();

        let userData = await this.data();

        const trinketLength = userData.inventory.length;
        const experience = userData.experience;
        const expBar = await experienceBar(this);
        const level = userData.level;

        embed
            .setTitle(userData.name)
            .setThumbnail(userData.avatar)
            .setColor(colors.transparent as ColorResolvable)
            .setDescription(`• trinket count: \`${trinketLength.toString}\`\n\n• level: \`${level.toString()}\`\n• experience: \`${experience.toString()}\`\n\n${expBar}`);
        
        return embed;
    }
}

userSchema.loadClass(UserClass);

const User = mongoose.model('User', userSchema);

export default User;
