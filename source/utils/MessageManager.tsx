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
import {Message, PartialMessage} from 'discord.js';

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
	private readonly messages_height_ratio = 38 / 45;

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

	removeMessage(message: TuiMessage) {
		this.setAllMessages(prev => prev.filter(m => m.id !== message.id));
		this.setMessages(prev => prev.filter(m => m.id !== message.id));
	}

	setList(messages: TuiMessage[]) {
		this.setMessages(messages);
	}

	clearAll() {
		this.setMessages([]);
		this.setAllMessages([]);
	}

	private sliceForHeight(
		source: TuiMessage[],
		height: number,
		width: number,
	): TuiMessage[] {
		const availableLines = Math.floor(height * this.messages_height_ratio);
		const usableWidth = Math.max(width * 0.5, 10);

		// Walk backwards through messages, accumulating lines until we fill the view
		let totalLines = 0;
		let startIndex = source.length;

		for (let i = source.length - 1; i >= 0; i--) {
			const msg = source[i]!;
			const rendered = `${msg.author.tag}: ${msg.content}`;
			const linesOccupied = Math.max(
				1,
				Math.ceil(rendered.length / usableWidth),
			);
			if (totalLines + linesOccupied > availableLines) break;
			totalLines += linesOccupied;
			startIndex = i;
		}

		return source.slice(startIndex);
	}

	async fetchAndSetAllMessages(
		channel: TuiChannel | null,
		height: number,
		width: number,
	) {
		if (!channel) return;

		const fetched = await channel.messages.fetch();
		const allMsgs = fetched.map(m => new TuiMessage(m)).reverse();

		this.setAllMessages(allMsgs);
		this.setMessages(this.sliceForHeight(allMsgs, height, width));
	}

	updateMessagesHeight(height: number, width: number) {
		const display = this.sliceForHeight(this.allMessages, height, width);
		this.setMessages(display);
	}

	handleNewMessage = (message: Message) => {
		const tuiMessage = new TuiMessage(message);
		this.addMessage(tuiMessage);
	};

	handleMessageDelete = (message: Message | PartialMessage) => {
		const tuiMessage = new TuiMessage(message as Message);
		this.removeMessage(tuiMessage);
	}
}

export function useAppMessages(): MessagesManager {
	const context = useContext(MessageContext);
	if (!context) {
		throw new Error('useAppMessages must be used within a MessageProvider');
	}

	const {messages, setMessages, allMessages, setAllMessages} = context;

	return useMemo(() => {
		return new MessagesManager(
			messages,
			setMessages,
			allMessages,
			setAllMessages,
		);
	}, [messages, allMessages]);
}
