import { Command } from "@/discord/base";
import { ApplicationCommandType } from "discord.js";

export default new Command({
    name: "pop",
    description: "pop",
    dmPermission: false,
    type: ApplicationCommandType.ChatInput,
    run({ interaction, client }){
        
    }
});
