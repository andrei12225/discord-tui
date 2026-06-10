import React from 'react';
import {Text, Box, useWindowSize} from 'ink';
import LeftbarGuilds from './components/leftbar/guildpicker.js';
import LeftbarChannelPicker from './components/leftbar/channelpicker.js';
import {useAppGuilds} from './utils/GuildManager.js';
import MessagesDisplay from './components/middle/messagesdisplay.js';

export default function MainPage() {
	const {columns, rows} = useWindowSize();
	const guildsManager = useAppGuilds();

	return (
		<Box width={columns} height={rows - 1} margin={1} gap={1}>
			{!guildsManager.hasSelectedGuild() ? (
				<LeftbarGuilds />
			) : (
				<LeftbarChannelPicker />
			)}
			<MessagesDisplay />
			<Box borderStyle={'classic'} width={'20%'}>
				<Text>users</Text>
			</Box>
		</Box>
	);
}
