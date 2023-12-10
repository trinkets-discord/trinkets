import "colors";
import db from "../../lib/mongoose";

module.exports = async () => {
    await db().catch((err) => `[ERROR] Error connecting to database! \n${err}`);
}