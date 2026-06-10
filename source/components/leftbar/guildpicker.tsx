import {Box, Newline, Text} from 'ink';
import React from 'react';
import {useAppGuilds} from '../../utils/GuildManager.js';

export default function LeftbarGuilds() {
	const guilds = useAppGuilds();
	const focusedGuild = guilds.getFocusedGuild()!;

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
				<Text key={guild.id}>
					#{' '}
					<Text
						backgroundColor={
							focusedGuild.id === guild.id ? process.env['focused-bg'] : ''
						}
						color={
							focusedGuild.id === guild.id
								? process.env['focused-fg']
								: process.env['main-fg']
						}
					>
						{guild.name}
					</Text>
				</Text>
			))}
		</Box>
	);
}
