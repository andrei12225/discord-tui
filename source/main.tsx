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
			{!guildsManager.selectedId ? (
				<LeftbarGuilds />
			) : (
				<LeftbarChannelPicker />
			)}
			<Box borderStyle={'classic'} width={'50%'}>
				<Text>
					{messages.map(m => `${m.author.tag}: ${m.content}`).join('\n')}
				</Text>
			</Box>
			<Box borderStyle={'classic'} width={'20%'}>
				<Text>
					{messages.map(m => `${m.author.tag}: ${m.content}`).join('\n')}
				</Text>
			</Box>
		</Box>
	);
}
