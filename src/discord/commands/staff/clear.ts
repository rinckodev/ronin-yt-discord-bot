import { Command } from "@discord/base";
import { brBuilder } from "@magicyan/discord";
import { ApplicationCommandOptionType, ApplicationCommandType, codeBlock, roleMention } from "discord.js";

const moderationRoleId = "1144589177124573185";

export default new Command({
    name: "limpar",
    description: "Comando de limpar mensagens",
    dmPermission: false,
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "quantidade",
            description: "Quantidade de mensagens a serem limpas",
            type: ApplicationCommandOptionType.Integer,
        },
        {
            name: "autor",
            description: "Limpar mensagens de apenas um autor",
            type: ApplicationCommandOptionType.User,
        },
        {
            name: "mensagem",
            description: "Deletar uma mensagem específica do canal",
            type: ApplicationCommandOptionType.String,
            autocomplete: true,
        }
    ],
    async autoComplete(interaction) {
        const { options, channel } = interaction;
        const focused = options.getFocused(true);

        switch(focused.name){
            case "mensagem":{
                if (!channel?.isTextBased()) return;
                const messages = await channel.messages.fetch();
                const choices = Array.from(messages)
                .map(([id, { content, author, createdAt }]) => {
                    const time = createdAt.toLocaleTimeString("pt-BR");
                    const [hour, minute] = time.split(":");
                    const text = `${hour}:${minute} ${author.displayName}: ${content}`;
                    const name = text.length > 90 ? text.slice(0, 90) + "..." : text;
                    return { name, value: id };
                });

                const filtered = choices.filter(c => c.name.toLowerCase().includes(focused.value.toLowerCase()));
                interaction.respond(filtered.slice(0, 25));
                return;
            }
        }
    },
    async run(interaction){
        const { member, options, channel } = interaction;

        await interaction.deferReply({ ephemeral: true });

        if (!member.roles.cache.has(moderationRoleId)){
            interaction.editReply({ 
                content: `Apenas membros com o cargo ${roleMention(moderationRoleId)} podem utilizar este comando!`
            });
            return;
        }

        if (!channel?.isTextBased()){
            interaction.editReply({ content: "Não é possível utilizar este comando nesse canal!"});
            return;
        }

        const amount = options.getInteger("quantidade") || 1;
        const mention = options.getMember("autor");
        const messageId = options.getString("mensagem");

        if (messageId){
            channel.messages.delete(messageId)
            .then(() => interaction.editReply({ 
                content: "A mensagem foi deletada com sucesso!"
            }))
            .catch((err) => interaction.editReply({ 
                content: brBuilder("Não foi possível deletar a mensagem", codeBlock("ts", err))
            }));
            return;
        }

        if (mention){
            const messages = await channel.messages.fetch();
            const filtered = messages.filter(m => m.author.id == mention.id);
            channel.bulkDelete(filtered.first(Math.min(amount, 100)))
            .then(cleared => interaction.editReply({
                content: cleared.size 
                ? `${cleared.size} mensagens de ${mention} deletadas com sucesso!`
                : `Não há mensagens de ${mention} para serem deletadas!`,
            }))
            .catch((err) => interaction.editReply({ 
                content: brBuilder("Não foi possível deletar mensagens!", codeBlock("ts", err))
            }));
            return;
        }

        channel.bulkDelete(Math.min(amount, 100))
        .then(cleared => interaction.editReply({
            content: cleared.size 
            ? `${cleared.size} mensagens deletadas com sucesso!`
            : "Não há mensagens para serem deletadas!",
        }))
        .catch((err) => interaction.editReply({ 
            content: brBuilder("Não foi possível deletar mensagens!", codeBlock("ts", err))
        }));
    }
});