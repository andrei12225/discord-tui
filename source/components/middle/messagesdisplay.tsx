import {Box, Newline, Text} from 'ink';
import React from 'react';
import TextInput from '../../utils/textinput.js';
import {useAppMessages} from '../../utils/MessageManager.js';
import { useAppChannels } from '../../utils/ChannelManager.js';
import { useAppGuilds } from '../../utils/GuildManager.js';

const shortcuts = [
	{ key: 'Tab',       description: 'Switch focus' },
	{ key: 'Shift+Tab', description: 'Switch focus backwards' },
	{ key: 'Esc',       description: 'Back to this menu' },
	{ key: 'Ctrl',      description: 'Focus chatbox' },
];

function KeyboardShortcuts() {
	return (
		<Box flexDirection="column" alignItems="center" justifyContent="center" flexGrow={1}>
			<Text>Welcome to the <Text bold>(っ◔◡◔)っ ♥ Discord Terminal Interface ♥</Text></Text>
			<Newline></Newline>
			<Newline></Newline>
			<Text bold color="cyan">Keyboard Shortcuts</Text>
			<Newline></Newline>
			{shortcuts.map(s => (
				<Box key={s.key} gap={2}>
					<Text bold color="yellow">{s.key}</Text>
					<Text dimColor>{s.description}</Text>
				</Box>
			))}
			<Text> </Text>
			<Text dimColor italic>Select a channel first</Text>
		</Box>
	);
}

export default function MessagesDisplay() {
	const messagesManager = useAppMessages();
	const messages = messagesManager.list;
	const channelsManager = useAppChannels();
	const guildsManager = useAppGuilds();

	return (
		<Box
			borderStyle={'classic'}
			width={'50%'}
			paddingX={2}
			flexDirection="column"
			overflowY="hidden"
		>
			{guildsManager.hasSelectedGuild() ? (
				<>
					<Box flexGrow={1} overflowY="hidden" flexDirection="column">
						{messages.map(m => (
							<Text key={m.id} wrap="wrap">
								{`${m.author.tag}: ${m.content}`}
							</Text>
						))}
					</Box>
					{channelsManager.hasSelectedChannel() && 
						<TextInput placeholder='Enter message...' />
					}
				</>
			) : (
				<KeyboardShortcuts />
			)}
		</Box>
	);
}
