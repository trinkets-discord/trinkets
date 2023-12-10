import { Document } from "mongoose";
import Item, { ItemClass, ItemType } from "../models/item";
import { UserClass } from "../models/user";

export const generate = async (user: UserClass) => {
    const array: Array<Document<ItemType>> = await Item.find();;
    const length = await Item.countDocuments();

    const random = Math.floor(Math.random() * length);

    const item = array[random].toJSON<ItemType>();
    
    const itemClass = new ItemClass(user);

    itemClass.uuid = item.uuid;
    itemClass.value = item.value;
    itemClass.name = item.name;
    itemClass.image = item.image;

    return await itemClass.reveal(user);
}