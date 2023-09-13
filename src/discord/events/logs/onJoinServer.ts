import { Event } from "@/discord/base";
import { settings } from "@/settings";
import { hexToRgb, brBuilder } from "@magicyan/discord";
import { EmbedBuilder, TextChannel, time } from "discord.js";

const channelId = "1148466995872931860";

new Event({
    name: "guildMemberAdd",
    run(member) {
        
        const channel = member.guild.channels.cache.get(channelId) as TextChannel;
        const memberAvatarUrl = member.displayAvatarURL({ size: 512 });

        channel.send({
            embeds: [new EmbedBuilder({
                color: hexToRgb(settings.colors.theme.success),
                author: {
                    name: `${member.displayName} entrou no servidor!`,
                    iconURL: memberAvatarUrl
                },
                thumbnail: { url: memberAvatarUrl },
                description: brBuilder(  
                    `💚 ${member} acabou de entrar no servidor`,
                    time(new Date(), "f")
                )
            })]
        });

    },
});