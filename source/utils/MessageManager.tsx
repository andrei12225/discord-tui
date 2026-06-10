import React, {
	createContext,
	Dispatch,
	SetStateAction,
	useContext,
	useMemo,
	useState,
	ReactNode,
} from 'react';
import {TuiMessage} from './domain.js';

export interface MessageContextValue {
	messages: TuiMessage[];
	setMessages: Dispatch<SetStateAction<TuiMessage[]>>;
}

const MessageContext = createContext<MessageContextValue | null>(null);

export function MessageProvider({children}: {children: ReactNode}) {
	const [messages, setMessages] = useState<TuiMessage[]>([]);

	const value = useMemo(() => ({messages, setMessages}), [messages]);

	return <MessageContext value={value}>{children}</MessageContext>;
}

export class MessagesManager {
	constructor(
		public readonly list: TuiMessage[],
		public readonly setMessages: Dispatch<SetStateAction<TuiMessage[]>>,
	) {}

	addMessage(message: TuiMessage) {
		this.setMessages(prev => [...prev, message]);
	}
}

export function useAppMessages(): MessagesManager {
	const context = useContext(MessageContext);
	if (!context) {
		throw new Error('useAppMessages must be used within a MessageProvider');
	}

	const {messages, setMessages} = context;

	return useMemo(() => {
		return new MessagesManager(messages, setMessages);
	}, [messages, setMessages]);
}
