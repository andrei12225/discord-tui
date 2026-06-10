import {Box, Text} from 'ink';
import React from 'react';
import TextInput from '../../utils/textinput.js';
import {useAppMessages} from '../../utils/MessageManager.js';

export default function MessagesDisplay() {
	const messagesManager = useAppMessages();
	const messages = messagesManager.list;

	return (
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
			<TextInput placeholder='Enter message...' />
		</Box>
	);
}
