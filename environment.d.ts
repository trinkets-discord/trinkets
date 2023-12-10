declare global {
    namespace NodeJS {
        interface ProcessEnv {
            BOT_TOKEN: string;
            GUILD_ID: string;
            environment: "dev" | "prod" | "debug";
            MONGO_URI: string;
        }
    }
}

export { };