import { Command } from "@/discord/base";
import { settings } from "@/settings";
import { brBuilder, hexToRgb, createRow } from "@magicyan/discord";
import { ActionRowBuilder, ApplicationCommandOptionType, ApplicationCommandType, ButtonBuilder, ButtonStyle, ColorResolvable, ComponentType, EmbedBuilder, codeBlock } from "discord.js";

export default new Command({
    name: "embed",
    description: "Cria um embed",
    dmPermission: false,
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "título",
            description: "Título do embed",
            type: ApplicationCommandOptionType.String,
        },
        {
            name: "descrição",
            description: "Descrição do embed",
            type: ApplicationCommandOptionType.String,
        },
        {
            name: "cor",
            description: "Cor da embed. (Ex: #22c55e)",
            type: ApplicationCommandOptionType.String,
        },
        {
            name: "autor",
            description: "Autor do embed",
            type: ApplicationCommandOptionType.User,
        }
    ],
    async run(interaction){
        const { options, channel } = interaction;

        await interaction.deferReply({ ephemeral: true, fetchReply: true });

        if (!channel?.isTextBased()){
            interaction.editReply({ content: "Não é possível utilizar este comando nesse canal!"});
            return;
        }

        const title = options.getString("título");
        const description = options.getString("descrição");
        const color = options.getString("cor");
        const mention = options.getUser("autor");
        const author = mention ? { name: mention.username, iconURL: mention.displayAvatarURL() } : undefined;

        if (!title && !description){
            interaction.editReply({
                content: "É necessário pelo menos especificar o título ou a descrição do embed!"
            });
            return;
        }

        if (title && title.length > 256){
            interaction.editReply({
                content: brBuilder(
                    "O título do embed deve ter no máximo 256 caracters!",
                    `O título que você enviou tem ${title.length} caracteres!`
                )
            });
            return;
        }

        if (description && description.length > 4096){
            interaction.editReply({
                content: brBuilder(
                    "A descrição do embed deve ter no máximo 4096 caracters!",
                    `A descrição que você enviou tem ${description.length} caracteres!`
                )
            });
            return;
        }

        const embed = new EmbedBuilder({ author, color: hexToRgb(settings.colors.theme.default) });

        try {
            embed
            .setTitle(title)
            .setDescription(description);
            (color) && embed.setColor(color as ColorResolvable);
        } catch (err: any){
            interaction.editReply({
                content: brBuilder("Não foi possível criar o embed", codeBlock("ts", err))
            });
            return;
        }

        const message = await interaction.editReply({
            embeds: [embed, new EmbedBuilder({
                description: "Deseja enviar a mensagem nesse canal?",
                color: hexToRgb(settings.colors.theme.default)
            })],
            components: [createRow(
                new ButtonBuilder({customId: "embed-confirm-button", label: "Confirmar", style: ButtonStyle.Success}),
                new ButtonBuilder({customId: "embed-cancel-button", label: "Cancelar", style: ButtonStyle.Danger}),
            )]
        });

        const collector = message.createMessageComponentCollector({ componentType: ComponentType.Button });
        collector.on("collect", async subInteraction => {
            collector.stop();
            const clearData = { components: [], embeds: [], };

            if (subInteraction.customId == "embed-cancel-button"){
                subInteraction.update({ ...clearData,
                    embeds: [new EmbedBuilder({
                        description: "Você cancelou a ação!",
                        color: hexToRgb(settings.colors.theme.default)
                    })]
                });
                return;
            }

            channel.send({embeds: [embed]})
            .then(msg => subInteraction.update({ ...clearData,
                content: `Mensagem enviada: ${msg.url}`
            }))
            .catch(err => subInteraction.update({ ...clearData,
                content: brBuilder("Não foi possível enviar a mensagem com o embed", codeBlock(err))
            }));

        });
    }
});