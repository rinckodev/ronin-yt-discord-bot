import { Command } from "@/discord/base";
import { settings } from "@/settings";
import { hexToRgb } from "@magicyan/discord";
import { ApplicationCommandType, EmbedBuilder } from "discord.js";

new Command({
    name: "avatar",
    dmPermission: false,
    type: ApplicationCommandType.User,
    async run(interaction){
        const { targetMember } = interaction;
        
        interaction.reply({ ephemeral: true, 
            embeds: [new EmbedBuilder({
                author: { name: `Avatar de ${targetMember.displayName}` },
                image: { url: targetMember.displayAvatarURL({ size: 1024 }) },
                color: hexToRgb(settings.colors.theme.primary)
            })]
        });
    }
});