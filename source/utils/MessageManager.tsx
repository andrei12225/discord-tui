import {useContext, useMemo} from 'react';
import {MessageContext} from '../cli.js';
import {TuiMessage} from './domain.js';

export class MessagesManager {
	constructor(
		public readonly list: TuiMessage[]
	) {}
}

export function useAppMessages(): MessagesManager {
	const context = useContext(MessageContext);
	if (!context) {
		throw new Error(
			'useAppMessages must be used within a MessageContext provider',
		);
	}

	const {messages, setMessages} = context;

	return useMemo(() => {
		return new MessagesManager(messages);
	}, [messages, setMessages]);
}
