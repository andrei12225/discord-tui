import {Box, Text} from 'ink';
import React from 'react';
import {useAppGuilds} from '../../utils/GuildManager.js';
import TreeBranch from './treebranch.js';

export default function LeftbarGuilds() {
	const guilds = useAppGuilds();

	return (
		<Box width={'20%'}
			 height={'100%'}
			 flexDirection='column'
			 borderStyle={'classic'}
			 justifyContent='space-between'>
			<Box
				width={'100%'}
				flexDirection='column'
				alignItems='flex-start'
				paddingX={1.5}
				gap={1}
			>
				{guilds.list.map(guild => (
					<React.Suspense key={guild.id} fallback={<Text dimColor>Loading...</Text>}>
						<TreeBranch guild={guild}/>
					</React.Suspense>
				))}
			</Box>
			<Box alignSelf='center'><Text>← Main Menu</Text></Box>
		</Box>
	);
}
