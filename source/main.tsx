import React from 'react';
import {Text, Box, useWindowSize} from 'ink';
import LeftbarGuilds from './components/leftbar/guildpicker.js';
import {useAppMessages} from './utils/MessageManager.js';
import LeftbarChannelPicker from './components/leftbar/channelpicker.js';
import {useAppGuilds} from './utils/GuildManager.js';

export default function MainPage() {
	const {columns, rows} = useWindowSize();
	const messagesManager = useAppMessages();
	const guildsManager = useAppGuilds();
	const messages = messagesManager.list;

	return (
		<Box width={columns} height={rows - 1} margin={1} gap={1}>
			{!guildsManager.selectedId ? <LeftbarGuilds /> : <LeftbarChannelPicker />}
			<Box
				borderStyle={'classic'}
				width={'50%'}
				paddingX={2}
				flexDirection="column"
				overflowY="hidden"
			>
				<Box flexGrow={1} overflowY="hidden" flexDirection="column">
					{messages.map(m => (
						<Text key={m.id} wrap="wrap">
							{`${m.author.tag}: ${m.content}`}
						</Text>
					))}
				</Box>
				<Box alignSelf="flex-end" borderStyle={'single'} width={'100%'}>
					<Text>Enter Message...</Text>
				</Box>
			</Box>
			<Box borderStyle={'classic'} width={'20%'}>
				<Text>users</Text>
			</Box>
		</Box>
	);
}
