import {Box, Newline, Text} from 'ink';
import React, { useContext } from 'react';
import {useAppChannels} from '../../utils/ChannelManager.js';
import { AppContext, AppElements } from '../../cli.js';

export default function MiddleChannelPicker() {
	const channels = useAppChannels();
	const {focusedElement} = useContext(AppContext)!;
    const focusedChannel = channels.getFocusedChannel()!;
    
    const channelsCurrentlyFocused = focusedElement === AppElements.CHANNELS;

	return (
		<Box
			width={'60%'}
			height={'100%'}
			flexDirection="column"
			borderStyle={'classic'}
			alignItems="center"
		>
            <Box width="100%" flexDirection="column" alignItems="center">
                <Text color="green">Choose a channel by</Text>
                <Text color="green">pressing ENTER</Text>
            </Box>
            <Newline></Newline>
			{channels.list.map(channel => (
				<Text key={channel.id}>
					#{' '}
					<Text
						backgroundColor={focusedChannel.id === channel.id && channelsCurrentlyFocused ? 'blue' : ''}
						color={focusedChannel.id === channel.id && channelsCurrentlyFocused ? 'black' : 'white'}
					>
						{channel.name}
					</Text>
				</Text>
			))}
		</Box>
	);
}
