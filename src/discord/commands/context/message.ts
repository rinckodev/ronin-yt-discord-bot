import { Command } from "@/discord/base";
import { ApplicationCommandType } from "discord.js";

new Command({
    name: "uppercase",
    dmPermission,
    type: ApplicationCommandType.Message,
    async run(interaction){
        const { targetMessage } = interaction;
        
        interaction.reply({ ephemeral,
            content: targetMessage.content.toUpperCase()
        });
    }
});