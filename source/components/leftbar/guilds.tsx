import { Box, Text } from "ink";
import React, { useContext } from "react";
import { AppContext } from "../../cli.js";
import { useAppGuilds } from "../../utils/GuildManager.js";

export default function LeftbarGuilds() {
    const appContext: AppContext = useContext(AppContext) as AppContext;
    const {guildList, focusedGuild} = useAppGuilds(appContext.guilds);

    return (
        <Box width={'20%'} height={'100%'} 
             flexDirection="column" borderStyle={"classic"}
             alignItems="center">
            {
                appContext.guilds.map(guild => (
                    <Text key={guild.id}>	
                        # <Text bold={guild.id === focusedGuild?.id}>{guild.name}</Text>
                    </Text>
                ))
            }
        </Box>
    );
}