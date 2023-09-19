import { Event } from "@/discord/base";
import { log, settings } from "@/settings";
import { hexToRgb } from "@magicyan/discord";
import { ChannelType, EmbedBuilder, formatEmoji, spoiler, userMention } from "discord.js";

const mainChannelId = "1151769569803894824";

new Event({
    name: "voiceStateUpdate",
    async run(oldState, newState) {
        const { guild, channel, member } = oldState;
        const mainChannel = guild.channels.cache.get(mainChannelId);
        
        if (!mainChannel?.isVoiceBased()) return;
        if (!member) return;

        // onLeave
        if (channel 
            && newState.channelId !== channel.id
            && channel.parentId == mainChannel.parentId
            && channel.name.includes(member.id)
        ){
            channel.delete().catch(log.error);
        }
        
        // onJoin
        if (newState.channelId == mainChannelId){

            if (channel?.parentId == mainChannel.parentId){
                member?.voice.disconnect();
                return;
            }

            guild.channels.create({
                name: `${member.displayName} - ${member.id}`,
                parent: mainChannel.parentId,
                type: ChannelType.GuildVoice,
                permissionOverwrites: [
                    { id: member.id, allow: ["Connect"] },
                    { id: guild.id, allow: ["Connect"] },
                ]
            })
            .then(voiceChannel => {
                member.voice.setChannel(voiceChannel);

                const emoji = formatEmoji(settings.emojis.static.check);

                voiceChannel.send({ 
                    content: spoiler(userMention(member.id)), 
                    embeds: [ new EmbedBuilder({
                        color: hexToRgb(settings.colors.theme.success),
                        description: `${emoji} Sua sala foi criada com sucesso!`
                    })]
                });
            })
            .catch((err) => {
                member.voice.disconnect();
                log.error(err); 
            });
        }
    },
});