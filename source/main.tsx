import React, {useContext} from 'react';
import {Text, Box, useWindowSize, Newline} from 'ink';
import {ChannelContext, MessageContext} from './cli.js';
import LeftbarGuilds from './components/leftbar/guilds.js';
import { useAppGuilds } from './utils/GuildManager.js';

export default function MainPage() {
	const messageContext: MessageContext = useContext(MessageContext) as MessageContext;
	const channelContext: ChannelContext = useContext(ChannelContext) as ChannelContext;
	const {focusedGuild} = useAppGuilds();
	const {columns, rows} = useWindowSize();
	const messages = messageContext.messages;
	const channels = channelContext.channels?.filter(c => c?.isTextBased() && !c?.isVoiceBased());

	return (
		<Box width={columns} height={rows - 1} margin={1} gap={1}>
			<LeftbarGuilds />
			<Box borderStyle="classic" width={'60%'} padding={1}>
				<Text>
					<Text>Showing channels for: {focusedGuild?.name}</Text>
					<Newline></Newline>
					{channels.map(c => `${c?.name}`).join('\n')}
				</Text>
			</Box>
			<Box width={'20%'}>
				<Text>
					{messages.map(m => `${m.author.tag}: ${m.content}`).join('\n')}
				</Text>
			</Box>
		</Box>
	);
}
