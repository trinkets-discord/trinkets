import mongoose, { Schema } from "mongoose";
import { v4 as uuidv4 } from 'uuid';

export const uuidSchema = new Schema({
    id: String,
    name: String,
});

export class UuidClass {
    id: string;
    name: string;

    async generate(name: string) {
        let id = uuidv4();

        let uuidData = await Uuid.findOne({
            name: name,
        });

        if (!uuidData) {
            this.id = id;
            this.name = name;
            uuidData = new Uuid(this);
            uuidData.save();
        } else {
            this.id = uuidData.id;
        }

        return this.id;
    }
}

uuidSchema.loadClass(UuidClass);

const Uuid = mongoose.model('UUID', uuidSchema);

export default Uuid;