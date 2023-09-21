import { Command } from "@/discord/base";
import { ApplicationCommandOptionType, ApplicationCommandType, Collection, time } from "discord.js";

const colldowns: Collection<string, Collection<string, Date>> = new Collection();

new Command({
    name: "comida",
    description: "Comando de exemplo no tema de comidas",
    dmPermission,
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "pizza",
            description: "🍕 Pizza",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "sabor",
                    description: "Sabor da pizza",
                    type: ApplicationCommandOptionType.String,
                    choices: [
                        { name: "🍖 Calabresa", value: "Calabresa" },
                        { name: "🧀 Mussarela", value: "Mussarela" },
                        { name: "🧀 Quatro queijos", value: "Quatro queijos" },
                        { name: "🥩 Lombo ao creme", value: "Lombo ao creme" },
                    ],
                    required
                }
            ],
        },
        {
            name: "sorvete",
            description: "🍦 Sorvete",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "sabor",
                    description: "Sabor do sorvete",
                    type: ApplicationCommandOptionType.String,
                    choices: [
                        { name: "🍫 Chocolate", value: "Chocolate" },
                        { name: "🌼 Baunilha", value: "Baunilha" },
                        { name: "🍓 Morango", value: "Morango" },
                    ],
                    required
                }
            ],
        },
        {
            name: "salgado",
            description: "🌭 Salgado",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "tipo",
                    description: "Tipo de salgado",
                    type: ApplicationCommandOptionType.String,
                    choices: [
                        { name: "🧀 Bolinha de queijo", value: "Bolinha de queijo" },
                        { name: "🌭 Enroladinho de salsicha", value: "Enroladinho de salsicha" },
                        { name: "🐔 Coxinha de frango", value: "Coxinha de frango" },
                    ],
                    required
                }
            ],
        },
    ],
    async run(interaction){
        const { member, options } = interaction;
        
        const memberColldowns = colldowns.get(member.id) || new Collection();
        const now = new Date();

        switch(options.getSubcommand(true)){
            case "pizza":{
                const colldown = memberColldowns?.get("pizza") || now;
                if (colldown > now){
                    interaction.reply({ ephemeral,
                        content: `Você poderá pedir outra pizza novamente ${time(colldown, "R")}`
                    });
                    return;
                }
                const flavor = options.getString("sabor", true);
                interaction.reply({ ephemeral,
                    content: `Você escolheu pizza de ${flavor}`
                });

                const future = new Date();
                future.setMinutes(future.getMinutes() + 2);

                memberColldowns.set("pizza", future);
                colldowns.set(member.id, memberColldowns);
                return;
            }
            case "sorvete":{
                const colldown = memberColldowns?.get("sorvete") || now;
                if (colldown > now){
                    interaction.reply({ ephemeral,
                        content: `Você poderá pedir outro sorvete novamente ${time(colldown, "R")}`
                    });
                    return;
                }
                const flavor = options.getString("sabor", true);
                interaction.reply({ ephemeral,
                    content: `Você escolheu sorvete de ${flavor}`
                });

                const future = new Date();
                future.setSeconds(future.getSeconds() + 50);

                memberColldowns.set("sorvete", future);
                colldowns.set(member.id, memberColldowns);
                return;
            }
            case "salgado":{
                const colldown = memberColldowns?.get("salgado") || now;
                if (colldown > now){
                    interaction.reply({ ephemeral,
                        content: `Você poderá pegar outro salgado novamente ${time(colldown, "R")}`
                    });
                    return;
                }
                const type = options.getString("tipo", true);
                interaction.reply({ ephemeral,
                    content: `Você escolheu ${type}`
                });

                const future = new Date();
                future.setSeconds(future.getSeconds() + 20);

                memberColldowns.set("salgado", future);
                colldowns.set(member.id, memberColldowns);
                return;
            }
        }
    }
});