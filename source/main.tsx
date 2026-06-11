import React from 'react';
import {Box, useWindowSize} from 'ink';
import LeftbarGuilds from './components/leftbar/guildpicker.js';
import LeftbarChannelPicker from './components/leftbar/channelpicker.js';
import {useAppGuilds} from './utils/GuildManager.js';
import MessagesDisplay from './components/middle/messagesdisplay.js';
import MembersDisplay from './components/rightbar/membersdisplay.js';

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
			<MembersDisplay />
		</Box>
	);
}
