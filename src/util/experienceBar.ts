import User, { UserClass } from "../models/user";

export const experienceBar = async (user: UserClass) => {
    let userData = await User.findOne({
        id: user.id,
    });

    if (!userData) {
        userData = new User(user);
        await userData.save();
    }
    const barLength = 10;

    const experience = userData.experience;
    const level = userData.level;

    const maxExp = user.defaultExp * level * user.levelRate;

    const percentage = Math.min((experience / maxExp) * maxExp, maxExp);

    const filledLength = Math.floor((percentage / maxExp) * barLength);

    const bar =  "**[** " + `<:trinkets:1182021229633359993>`.repeat(filledLength) + `<:trinketGrey:1182021640155058307>`.repeat(barLength - filledLength) + " **]**";

    return bar;
}