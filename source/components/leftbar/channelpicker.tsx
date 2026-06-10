import {Box, Newline, Text} from 'ink';
import React from 'react';
import {useAppChannels} from '../../utils/ChannelManager.js';
import {AppElements, useAppFocus} from '../../utils/FocusManager.js';

export default function LeftbarChannelPicker() {
	const channels = useAppChannels();
	const focus = useAppFocus();
	const focusedChannel = channels.getFocusedChannel()!;

	const channelsCurrentlyFocused =
		focus.focusedElement === AppElements.CHANNELS;

	return (
		<Box
			width={'20%'}
			height={'100%'}
			flexDirection="column"
			borderStyle={'classic'}
			alignItems="center"
		>
			<Box width="100%" flexDirection="column" alignItems="center">
				<Text color="blue">Choose a channel by</Text>
				<Text color="blue">pressing ENTER</Text>
			</Box>
			<Newline></Newline>
			{channels.list.map(channel => (
				<Text key={channel.id}>
					#{' '}
					<Text
						backgroundColor={
							focusedChannel.id === channel.id && channelsCurrentlyFocused
								? 'blue'
								: ''
						}
						color={
							focusedChannel.id === channel.id && channelsCurrentlyFocused
								? 'black'
								: 'white'
						}
					>
						{channel.name}
					</Text>
				</Text>
			))}
		</Box>
	);
}
