import {Text, useFocus, useInput} from 'ink';
import React from 'react';

type props = {
	key: string;
	content: string;
	onSelect: () => void;
};

export default function Option({key, content, onSelect}: props) {
	const focus = useFocus({id: key});

	useInput(async (_, key) => {
		if (key.return && focus.isFocused) {
			onSelect();
		}
	});

	return (
		<Text key={key}>
			<Text
				backgroundColor={focus.isFocused ? process.env['focused-bg'] : ''}
				color={
					focus.isFocused ? process.env['focused-fg'] : process.env['main-fg']
				}
			>
				{content}
			</Text>
		</Text>
	);
}
