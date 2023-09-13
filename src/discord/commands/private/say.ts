import { Command } from "@/discord/base";
import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";

export default new Command({
    name: "say",
    description: "say command",
    dmPermission: false,
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "text",
            description: "some text",
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],
    async run(interaction){
        const { options, channel } = interaction;
        await interaction.deferReply({ ephemeral: true });
        
        if (!channel?.isTextBased()) {
            interaction.editReply({ content: "Não é possível enviar mensagens neste canal!" });
            return;
        }

        const content = options.getString("text", true);

        channel.send({ content });

        interaction.editReply({ content: "Mensagem enviada! "});
    },
});