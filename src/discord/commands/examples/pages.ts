import { Command } from "@/discord/base";
import { settings } from "@/settings";
import { hexToRgb, brBuilder, createRow } from "@magicyan/discord";
import { ApplicationCommandType, ButtonBuilder, ButtonStyle, EmbedBuilder, escapeMarkdown, formatEmoji, hyperlink } from "discord.js";


export default new Command({
    name: "pages",
    description: "pages",
    dmPermission: false,
    type: ApplicationCommandType.ChatInput,
    async run(interaction){

        interaction.reply({
            embeds: [new EmbedBuilder({
                color: hexToRgb(settings.colors.theme.primary),
                title: "1.20.2 Pre-Release 1",
                url: "https://www.minecraft.net/en-us/article/minecraft-1-20-2-pre-release-1",
                description: brBuilder(
                    "# Changes",
                    "- 🔍 The Recipe Book search has been updated with the following changes",
                    "- The search will only match the beginning of any word in the item's name",
                    "- 🗺️ Updated structure icons on explorer maps sold by Cartographers",
                    "- When villagers unlock new trades, the order of those trades in the UI is now always random instead of sometimes being deterministic",
                    "- The data pack version is now 18",
                    "- 🗺️ Cartographers now sell 7 new maps: Desert Village Map, Jungle Explorer Map, Plains Village Map, Savanna Village Map, Snow Village Map, Swamp Explorer Map, and Taiga Village Map.",
                    "- 📚 Certain Enchanted Books now have a high chance of generating in some structures",
                )
            })],
            components: [createRow(
                new ButtonBuilder({
                    customId: "back", label: "Voltar", 
                    emoji: { id: settings.emojis.static.back }, 
                    style: ButtonStyle.Danger
                }),
                new ButtonBuilder({
                    customId: "home", label: "Início", 
                    emoji: { id: settings.emojis.static.home }, 
                    style: ButtonStyle.Primary
                }),
                new ButtonBuilder({
                    customId: "next", label: "Avançar", 
                    emoji: { id: settings.emojis.static.next }, 
                    style: ButtonStyle.Success
                }),
            )]
        });
    }
});

