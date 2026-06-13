import {Box, Text, useFocus, useInput} from 'ink';
import React, { useState } from 'react';
import { useAppChannels } from './ChannelManager.js';

type props = {
    placeholder?: string;
    focusId?: string;
}

export default function TextInput({placeholder, focusId}: props) {
	const focus = useFocus({id: focusId});
    const [value, setValue] = useState<string>('');
    const channelManager = useAppChannels();

    useInput((event, key) => {
        if (!focus.isFocused) return;
        if (key.return) {
            if (value.length === 0) return;
            channelManager.getSelectedChannel()!.sendMessage(value);
            return setValue('');
        }
        if (key.backspace) return setValue(prev => prev.slice(0, -1));
        setValue(value + event);
    });
    
	return (
		<Box
			alignSelf="flex-end"
			borderStyle={focus.isFocused ? 'double' : 'single'}
            paddingX={1}
			width={'100%'}
		>
            {placeholder && value === '' ? 
                <Text dimColor>{placeholder}</Text>
                :
                <Text>{value}</Text>
            }
		</Box>
	);
}
