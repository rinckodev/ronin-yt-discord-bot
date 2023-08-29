import { Command } from "@/discord/base";
import { ApplicationCommandType } from "discord.js";

export default new Command({
    name: "uppercase",
    dmPermission: false,
    type: ApplicationCommandType.Message,
    async run({ interaction }){
        const { targetMessage } = interaction;
        
        interaction.reply({ ephemeral: true, 
            content: targetMessage.content.toUpperCase()
        });
    }
});