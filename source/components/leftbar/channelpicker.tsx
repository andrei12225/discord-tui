import {Box, Newline, Text} from 'ink';
import React from 'react';
import {useAppChannels} from '../../utils/ChannelManager.js';
import Option from '../../utils/option.js';

export default function LeftbarChannelPicker() {
	const channels = useAppChannels();

	const onChannelSelect = (channelId: string) => {
		channels.selectChannel(channelId);
	};

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
				<Option
					onSelect={() => onChannelSelect(channel.id)}
					key={channel.id}
					content={'# ' + channel.name}
				/>
			))}
		</Box>
	);
}
