import { Command } from "@/discord/base";
import { ApplicationCommandType, Collection, time } from "discord.js";

const colldowns: Collection<string, Date> = new Collection();

new Command({
    name: "boasorte",
    description: "Comando de boa sorte", 
    dmPermission,
    type: ApplicationCommandType.ChatInput,
    async run(interaction){
        const { member } = interaction;
        const now = new Date();
        const colldown = colldowns.get(member.id) || now;
        if (colldown && colldown > now){
            interaction.reply({ ephemeral, 
                content: `Você poderá desejar boa sorte novamente ${time(colldown, "R")}`
            });
            return;
        }

        interaction.reply({ ephemeral, content: "Você desejou boa sorte a todos!" });

        const future = new Date();
        future.setSeconds(future.getSeconds() + 30);
        
        colldowns.set(member.id, future);
    }
});