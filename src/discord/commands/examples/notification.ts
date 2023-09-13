import { Command } from "@/discord/base";
import { brBuilder, hexToRgb } from "@/functions";
import { settings } from "@/settings";
import { ApplicationCommandType, EmbedBuilder, formatEmoji, hyperlink } from "discord.js";

export default new Command({
    name: "notificação",
    description: "notificação",
    dmPermission: false,
    type: ApplicationCommandType.ChatInput,
    async run({ interaction }){

        const content = brBuilder(
            `# ${formatEmoji(settings.emojis.animated.bell, true)} Novo vídeo do canal Rincko Dev!`,
            hyperlink("Acesse clicando aqui", "https://youtu.be/Hzb9th3pRvE?si=bJmXbn4LdMl9rm0W")
        );

        interaction.reply({ content });


    }
});