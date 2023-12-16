import { ColorResolvable, EmbedBuilder } from "discord.js";
import mongoose, { Schema } from "mongoose";
import { colors, constants, values, emojis } from '../config.json';
import { Tier } from "../util/types";
import { PlayerClass } from "./player";
import { v4 as uuidv4 } from 'uuid';
import "colors";


export type ItemType = {
    name: string;
    image: string;
    uuid: string;
    value: number;
    guildId?: string;
    tier: string;
}

export const itemSchema: Schema<ItemType> = new Schema({
    name: String,
    image: {type: String, unique: true},
    uuid: {type: String, unique: true},
    value: Number,
    guildId: String,
    tier: String,
});

export class ItemClass {
    name: string;
    image: string;
    uuid: string;
    value: number;
    guildId: string;
    user?: PlayerClass;
    tier: Tier;

    constructor(user: PlayerClass) {
        this.user = user;
    }

    async build(name: string, image: string, guildId: string) {
        this.name = name;
        this.image = image;
        this.guildId = guildId;

        let embed = new EmbedBuilder();

        if (await this.exists()) {
            embed
                .setColor(colors.error as ColorResolvable)
                .setDescription(`**${name}** has already been added by this guild!`);
        } else {
            this.uuid = this.assignUuid();
            this.value = this.assignValue();
            this.tier = this.assignTier();
            await this.data();

            embed
                .setColor(colors.success as ColorResolvable)
                .setDescription(`**${name}** added!`)
                .setThumbnail(image);
        }

        return embed;
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

        this.tier = tier;

        return tier;
    }

    emoji(): string {
        let emoji: string;
        let tier = this.assignTier();

        if (tier === 'common') emoji = emojis.tiers.common;
        if (tier === 'uncommon') emoji = emojis.tiers.uncommon;
        if (tier === 'rare') emoji = emojis.tiers.common;
        if (tier === 'epic') emoji = emojis.tiers.epic;
        if (tier === 'legendary') emoji = emojis.tiers.legendary;

        return emoji;
    }

    assignColor(): string {
        const tier = this.assignTier();

        let color = colors.tiers.common;

        if (tier === 'common') color = colors.tiers.common;
        if (tier === 'uncommon') color = colors.tiers.uncommon;
        if (tier === 'rare') color = colors.tiers.rare;
        if (tier === 'epic') color = colors.tiers.epic;
        if (tier === 'legendary') color = colors.tiers.legendary;

        return color;
    }

    assignUuid() {
        const uuid = uuidv4();
        this.uuid = uuid;

        return uuid;
    }

    async data() {
        let itemData = await Item.findOne({
            name: this.name,
            guildId: this.guildId,
        });
        let uuidData = await Item.findOne({
            uuid: this.uuid
        });

        if (!itemData) {
            if (!uuidData) {
                itemData = new Item(this);
                itemData.uuid = this.uuid;
            } else {
                itemData = new Item(this);
                itemData.uuid = uuidData.id;
            }

            await itemData.save();
        }

        return itemData;
    }

    async exists() {
        let itemData = await Item.findOne({
            name: this.name,
            guildId: this.guildId,
            image: this.image,
        });

        if (!itemData) {
            return false;
        } else {
            return true;
        }
    }

    async reveal(user: PlayerClass): Promise<EmbedBuilder[]> {
        return await user.find(this);
    }

    embed(): EmbedBuilder {
        const color = this.assignColor();

        let embed = new EmbedBuilder();

        embed
            .setColor(color as ColorResolvable)
            .setThumbnail(this.image)
            .setAuthor({ name: this.user.name, iconURL: this.user.avatar })
            .setDescription(`${this.emoji()} You found **${this.name}**!`)
            .addFields(
                { name: "VALUE", value: `${this.value.toString()}`, inline: true },
                { name: "TIER", value: `${this.assignTier()}`, inline: true },
            );

        return embed;
    }
}

itemSchema.loadClass(ItemClass);

const Item = mongoose.model("Item", itemSchema);

export default Item;