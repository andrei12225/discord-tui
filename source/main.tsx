import React from 'react';
import {Box, useWindowSize} from 'ink';
import LeftbarGuilds from './components/leftbar/guildtree.js';
import MessagesDisplay from './components/middle/messagesdisplay.js';
import MembersDisplay from './components/rightbar/membersdisplay.js';

export default function MainPage() {
	const {columns, rows} = useWindowSize();

	return (
		<React.Suspense>
			<Box width={columns} height={rows - 1} margin={1} gap={1}>
				<LeftbarGuilds />
				<MessagesDisplay />
				<MembersDisplay />
			</Box>
		</React.Suspense>
	);
}
