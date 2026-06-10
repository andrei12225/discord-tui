import React, {
	createContext,
	Dispatch,
	SetStateAction,
	useContext,
	useMemo,
	useState,
	ReactNode,
} from 'react';
import {TuiChannel, TuiMessage} from './domain.js';

export interface MessageContextValue {
	messages: TuiMessage[];
	setMessages: Dispatch<SetStateAction<TuiMessage[]>>;
	allMessages: TuiMessage[];
	setAllMessages: Dispatch<SetStateAction<TuiMessage[]>>;
}

const MessageContext = createContext<MessageContextValue | null>(null);

export function MessageProvider({children}: {children: ReactNode}) {
	const [messages, setMessages] = useState<TuiMessage[]>([]);
	const [allMessages, setAllMessages] = useState<TuiMessage[]>([]);

	const value = useMemo(
		() => ({messages, setMessages, allMessages, setAllMessages}),
		[messages, allMessages],
	);

	return <MessageContext value={value}>{children}</MessageContext>;
}

export class MessagesManager {
	private readonly messages_height_ratio = 40 / 45;

	constructor(
		public readonly list: TuiMessage[],
		private readonly setMessages: Dispatch<SetStateAction<TuiMessage[]>>,
		private readonly allMessages: TuiMessage[],
		private readonly setAllMessages: Dispatch<SetStateAction<TuiMessage[]>>,
	) {}

	addMessage(message: TuiMessage) {
		this.setAllMessages(prev => [...prev, message]);
		this.setMessages(prev => [...prev, message]);
	}

	setList(messages: TuiMessage[]) {
		this.setMessages(messages);
	}

	clearAll() {
		this.setMessages([]);
		this.setAllMessages([]);
	}

	private sliceForHeight(source: TuiMessage[], height: number): TuiMessage[] {
		const maxMessages = Math.floor(height * this.messages_height_ratio);
		if (source.length <= maxMessages) return source;
		return source.slice(source.length - maxMessages);
	}

	async fetchAndSetAllMessages(channel: TuiChannel | null, height: number) {
		if (!channel) return;

		const fetched = await channel.messages.fetch();
		const allMsgs = fetched.map(m => new TuiMessage(m)).reverse();

		this.setAllMessages(allMsgs);
		this.setMessages(this.sliceForHeight(allMsgs, height));
	}

	updateMessagesHeight(height: number) {
		const display = this.sliceForHeight(this.allMessages, height);
		this.setMessages(display);
	}
}

export function useAppMessages(): MessagesManager {
	const context = useContext(MessageContext);
	if (!context) {
		throw new Error('useAppMessages must be used within a MessageProvider');
	}

	const {messages, setMessages, allMessages, setAllMessages} = context;

	return useMemo(() => {
		return new MessagesManager(messages, setMessages, allMessages, setAllMessages);
	}, [messages, allMessages]);
}

