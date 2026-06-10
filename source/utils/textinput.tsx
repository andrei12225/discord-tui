import {Box, Text, useFocus, useInput} from 'ink';
import React, { useState } from 'react';

type props = {
    placeholder?: string;
}

export default function TextInput({placeholder}: props) {
	const focus = useFocus();
    const [value, setValue] = useState<string>('');

    useInput((event, key) => {
        if (!focus.isFocused) return;
        if (key.return) return;
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
