import { ColorResolvable, EmbedBuilder } from "discord.js";
import mongoose, { Schema } from "mongoose";
import { colors, constants, values } from '../config.json';
import { Tier } from "../util/types";
import { UserClass } from "./user";
import { UuidClass } from "./uuid";


export type ItemType = {
    name: string;
    image: string;
    uuid: string;
    value: number;
    guildId?: string;
}

export const itemSchema: Schema<ItemType> = new Schema({
    name: String,
    image: String,
    uuid: String,
    value: Number,
    guildId: String,
});

export class ItemClass {
    name: string;
    image: string;
    uuid: string;
    value: number;
    guildId: string;
    user?: UserClass;

    constructor(user: UserClass) {
        this.user = user;
    }

    async build(name: string, image: string, guildId: string) {
        this.name = name;
        this.image = image;
        this.guildId = guildId;

        this.value = this.assignValue();

        await this.data();
    }

    assignValue() {
        let min = values.common.min;
        let max = values.legendary.max;
        let bias = constants.value_bias;

        const range = max - min;
        const biasFactor = Math.pow(Math.random(), bias);
        const random = min + biasFactor * range;

        const value = Math.floor(random);

        this.value = value;

        return value;
    }

    assignTier(): Tier {
        let tier: Tier;

        if (this.value >= values.common.min || this.value <= values.common.max && this.value < values.uncommon.min) {
            tier = 'common';
        } else if (this.value >= values.uncommon.min || this.value <= values.uncommon.max && this.value < values.rare.min) {
            tier = 'uncommon';
        } else if (this.value >= values.rare.min || this.value <= values.rare.max && this.value < values.epic.min) {
            tier = 'rare';
        } else if (this.value >= values.epic.min || this.value <= values.epic.max && this.value < values.legendary.min) {
            tier = 'epic';
        } else {
            tier = 'legendary';
        } 

        return tier;
    }

    assignColor(): string {
        const tier = this.assignTier();

        let color = colors.tiers.common;

        if (tier === 'common') color = colors.tiers.common;
        if (tier === 'uncommon') color  = colors.tiers.uncommon;
        if (tier === 'rare') color = colors.tiers.rare;
        if (tier === 'epic') color = colors.tiers.epic;
        if (tier === 'legendary') color = colors.tiers.legendary;

        return color;
    }

    async assignUuid() {
        const uuid = await new UuidClass().generate();
        this.uuid = uuid;
        return uuid;
    }

    async data() {

        const uuid = await this.assignUuid();

        let itemData = await Item.findOne({
            uuid,
        });

        if (!itemData) {
            this.uuid = uuid;
            itemData = new Item(this);
        }

        itemData.name = this.name;
        itemData.uuid = this.uuid;
        itemData.value = this.value;
        itemData.image = this.image;
        itemData.guildId = this.guildId;

        await itemData.save();

        return itemData;
    }

    async reveal(user: UserClass): Promise<EmbedBuilder[]> {
        return await user.find(this);
    }

    embed(): EmbedBuilder {
        const color = this.assignColor();

        let embed = new EmbedBuilder();

        embed
            .setColor(color as ColorResolvable)
            .setThumbnail(this.image)
            .setAuthor({ name: this.user.name, iconURL: this.user.avatar })
            .setDescription(`You found **${this.name}**!`)
            .addFields(
                { name: "VALUE", value: `${this.value.toString()}`, inline: true },
                { name: "TIER", value: `${this.assignTier()}`, inline: true }
        );
        
        return embed;
    }
}

itemSchema.loadClass(ItemClass);

const Item = mongoose.model("Item", itemSchema);

export default Item;