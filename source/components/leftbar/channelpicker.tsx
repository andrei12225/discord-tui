import {Box} from 'ink';
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
