import React from "react";
import { TuiGuild } from "../../utils/domain.js";
import { Box, Text } from "ink";
import Option from "../../utils/option.js";
import { useAppGuilds } from "../../utils/GuildManager.js";
import { useAppChannels } from "../../utils/ChannelManager.js";

export default function TreeBranch({guild}: {guild: TuiGuild}) {
    const guilds = useAppGuilds();
    const channels = useAppChannels();

    const channelsList = guild.readChannels();

    const onChannelSelect = (channelId: string) => {
        guilds.selectGuild(guild.id);
        channels.setList(channelsList);
        channels.selectChannel(channelId);
    };

    return (
        <Box flexDirection='column'>
            <Text underline bold color={process.env['main-fg']}>
                {guild.name}
            </Text>
            <Box marginX={1} flexDirection='column'>
                {channelsList.map(ch => (
                    <Option
                        onSelect={() => onChannelSelect(ch.id)}
                        key={ch.id}
                        content={'#' + ch.name}
                    />
                ))}
            </Box>
        </Box>
    )
}