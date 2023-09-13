import { Command } from "@/discord/base";
import { settings } from "@/settings";
import { hexToRgb } from "@magicyan/discord";
import { ApplicationCommandType, EmbedBuilder, TextChannel } from "discord.js";

export default new Command({
    name: "post",
    description: "novo post",
    dmPermission: false,
    type: ApplicationCommandType.ChatInput,
    async run(interaction){
        const { client } = interaction;
        const channel = interaction.channel as TextChannel;

        interaction.deferReply({ ephemeral: true });

        const message = await channel.send({
            embeds: [new EmbedBuilder({
                color: hexToRgb(settings.colors.theme.magic),
                author: { name: `Nova postagem de ${client.user.displayName}` },
                thumbnail: { url: client.user.displayAvatarURL({ size: 512 }) },
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac ultrices quam, id scelerisque arcu. Vivamus dictum eget purus auctor bibendum. Vestibulum euismod nulla vel libero volutpat, id cursus nisl dignissim. Aenean tincidunt, quam quis tristique consequat.",
            })]
        });

        const customEmoji = interaction.guild.emojis.cache.get(settings.emojis.animated.heart)!;
        message.react(customEmoji);

    }
});