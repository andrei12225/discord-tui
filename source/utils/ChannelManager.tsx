import React, {
	createContext,
	Dispatch,
	SetStateAction,
	useContext,
	useMemo,
	useState,
	ReactNode,
} from 'react';
import {TuiChannel} from './domain.js';

export interface ChannelContextValue {
	channels: TuiChannel[];
	setChannels: Dispatch<SetStateAction<TuiChannel[]>>;
	focusedChannelId: string | null;
	setFocusedChannelId: Dispatch<SetStateAction<string | null>>;
}

const ChannelContext = createContext<ChannelContextValue | null>(null);

export function ChannelProvider({children}: {children: ReactNode}) {
	const [channels, setChannels] = useState<TuiChannel[]>([]);
	const [focusedChannelId, setFocusedChannelId] = useState<string | null>(null);

	const value = useMemo(
		() => ({channels, setChannels, focusedChannelId, setFocusedChannelId}),
		[channels, focusedChannelId],
	);

	return <ChannelContext value={value}>{children}</ChannelContext>;
}

export class ChannelsManager {
	constructor(
		public readonly list: TuiChannel[],
		public readonly focusedId: string | null,
		private readonly setChannels: Dispatch<SetStateAction<TuiChannel[]>>,
		private readonly setFocusedId: Dispatch<SetStateAction<string | null>>,
	) {}

	getFocusedChannel(): TuiChannel | null {
		return this.list.find(c => c.id === this.focusedId) || null;
	}

	setList(channels: TuiChannel[]) {
		this.setChannels(channels);
	}

	setFocusedChannelId(id: string | null) {
		this.setFocusedId(id);
	}

	focusNext() {
		if (this.list.length === 0) return;
		const currentIndex = this.list.findIndex(c => c.id === this.focusedId);
		if (currentIndex === -1) return;
		const nextIndex = (currentIndex + 1) % this.list.length;
		this.setFocusedId(this.list[nextIndex]!.id);
	}

	focusPrevious() {
		if (this.list.length === 0) return;
		const currentIndex = this.list.findIndex(c => c.id === this.focusedId);
		if (currentIndex === -1) return;
		const nextIndex = (currentIndex - 1 + this.list.length) % this.list.length;
		this.setFocusedId(this.list[nextIndex]!.id);
	}
}

export function useAppChannels(): ChannelsManager {
	const context = useContext(ChannelContext);
	if (!context) {
		throw new Error('useAppChannels must be used within a ChannelProvider');
	}

	const {channels, setChannels, focusedChannelId, setFocusedChannelId} =
		context;

	return useMemo(() => {
		return new ChannelsManager(
			channels,
			focusedChannelId,
			setChannels,
			setFocusedChannelId,
		);
	}, [channels, focusedChannelId, setChannels, setFocusedChannelId]);
}
