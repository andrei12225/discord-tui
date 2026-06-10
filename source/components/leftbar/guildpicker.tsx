import {Box, Newline, Text} from 'ink';
import React from 'react';
import {useAppGuilds} from '../../utils/GuildManager.js';
import Option from './option.js';

export default function LeftbarGuilds() {
	const guilds = useAppGuilds();
	
	const onGuildSelect = (guildId: string) => {
		guilds.selectGuild(guildId);
	}

	return (
		<Box
			width={'20%'}
			height={'100%'}
			flexDirection="column"
			borderStyle={'classic'}
			alignItems="center"
		>
			<Box width="100%" flexDirection="column" alignItems="center">
				<Text color="blue">Choose a guild by</Text>
				<Text color="blue">pressing ENTER</Text>
			</Box>
			<Newline></Newline>
			{guilds.list.map(guild => (
				<Option
					onSelect={() => onGuildSelect(guild.id)}
					key={guild.id}
					content={'# ' + guild.name}
				/>
			))}
		</Box>
	);
}
