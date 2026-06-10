import React from 'react';
import {Text, Box, useWindowSize} from 'ink';
import LeftbarGuilds from './components/leftbar/guilds.js';
import {useAppMessages} from './utils/MessageManager.js';
import MiddleChannelPicker from './components/middle/channelpicker.js';

export default function MainPage() {
	const {columns, rows} = useWindowSize();
	const messagesManager = useAppMessages();
	const messages = messagesManager.list;

	return (
		<Box width={columns} height={rows - 1} margin={1} gap={1}>
			<LeftbarGuilds />
			<MiddleChannelPicker />
			<Box width={'20%'}>
				<Text>
					{messages.map(m => `${m.author.tag}: ${m.content}`).join('\n')}
				</Text>
			</Box>
		</Box>
	);
}
