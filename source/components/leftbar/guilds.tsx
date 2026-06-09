import {Box, Text} from 'ink';
import React from 'react';
import {useAppGuilds} from '../../utils/GuildManager.js';

export default function LeftbarGuilds() {
	const {guildList, focusedGuild} = useAppGuilds();

	return (
		<Box
			width={'20%'}
			height={'100%'}
			flexDirection="column"
			borderStyle={'classic'}
			alignItems="center"
		>
			{guildList.map(guild => (
				<Text key={guild.id}>
					# <Text backgroundColor={guild.id === focusedGuild?.id ? 'blue' : ''}
                            color={guild.id === focusedGuild?.id ? 'black' : 'white'}>
                            {guild.name}
                      </Text>
				</Text>
			))}
		</Box>
	);
}
