import Player, { PlayerClass } from "../models/player";
import { emojis } from '../config.json';

export const experienceBar = async (user: PlayerClass) => {
    let userData = await Player.findOne({
        id: user.id,
    });

    if (!userData) {
        userData = new Player(user);
        await userData.save();
    }
    const barLength = 10;

    const experience = userData.experience;
    const level = userData.level;

    const maxExp = user.defaultExp * level * user.levelRate;

    const percentage = Math.min((experience / maxExp) * maxExp, maxExp);

    const filledLength = Math.floor((percentage / maxExp) * barLength);

    const bar =  "**[** " + emojis.icon.repeat(filledLength) + emojis.icon_grey.repeat(barLength - filledLength) + " **]**";

    return bar;
}