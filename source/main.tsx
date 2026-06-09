import React, {useContext} from 'react';
import {Text, Box, useWindowSize} from 'ink';
import {AppContext} from './cli.js';
import LeftbarGuilds from './components/leftbar/guilds.js';

export default function MainPage() {
	const appContext: AppContext = useContext(AppContext) as AppContext;
	const {columns, rows} = useWindowSize();
	const messages = appContext.messages;

	return (
		<Box width={columns} height={rows - 1} margin={1} gap={1}>
			<LeftbarGuilds />
			<Box borderStyle="single" width={'60%'}>
				<Text>	
					{messages.map(m => `${m.author.tag}: ${m.content}`).join("\n")}
				</Text>
			</Box>
			<Box width={'20%'}>
				<Text>	
					{messages.map(m => `${m.author.tag}: ${m.content}`).join("\n")}
				</Text>
			</Box>
		</Box>
	);
}
