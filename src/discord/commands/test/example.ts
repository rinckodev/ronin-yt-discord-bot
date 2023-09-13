import { Command } from "@/discord/base";
import { ApplicationCommandType, ButtonBuilder, ButtonStyle, formatEmoji } from "discord.js";

export default new Command({
    name: "example",
    description: "Example command",
    dmPermission: false,
    type: ApplicationCommandType.ChatInput,
    async run(interaction){
        const { guild } = interaction;
        
        
    }
});
