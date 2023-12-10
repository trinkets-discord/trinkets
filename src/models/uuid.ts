import mongoose, { Schema } from "mongoose";
import { v4 as uuidv4 } from 'uuid';

export const uuidSchema = new Schema({
    id: String,
});

export class UuidClass {
    id: string;

    async generate() {
        let id = uuidv4();

        this.id = id;

        let idData = await Uuid.findOne({
            id: this.id
        });


        if (!idData) {
            idData = new Uuid(this);
        } else {
            this.id = idData.id;
        }
        await idData.save();

        return id;
    }
}

uuidSchema.loadClass(UuidClass);

const Uuid = mongoose.model('UUID', uuidSchema);

export default Uuid;