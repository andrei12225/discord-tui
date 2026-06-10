import React, {
	createContext,
	Dispatch,
	SetStateAction,
	useContext,
	useMemo,
	useState,
	ReactNode,
} from 'react';
import {TuiChannel, TuiGuild} from './domain.js';

export interface ChannelContextValue {
	channels: TuiChannel[];
	setChannels: Dispatch<SetStateAction<TuiChannel[]>>;
	selectedChannelId: string | null;
	setSelectedChannelId: Dispatch<SetStateAction<string | null>>;
}

const ChannelContext = createContext<ChannelContextValue | null>(null);

export function ChannelProvider({children}: {children: ReactNode}) {
	const [channels, setChannels] = useState<TuiChannel[]>([]);
	const [selectedChannelId, setSelectedChannelId] = useState<string | null>(
		null,
	);

	const value = useMemo(
		() => ({
			channels,
			setChannels,
			selectedChannelId,
			setSelectedChannelId,
		}),
		[channels, selectedChannelId],
	);

	return <ChannelContext value={value}>{children}</ChannelContext>;
}

export class ChannelsManager {
	constructor(
		public readonly list: TuiChannel[],
		public readonly selectedId: string | null,
		private readonly setChannels: Dispatch<SetStateAction<TuiChannel[]>>,
		private readonly setSelectedId: Dispatch<SetStateAction<string | null>>,
	) {}

	setList(channels: TuiChannel[]) {
		this.setChannels(channels);
	}

	setSelectedChannelId(id: string | null) {
		this.setSelectedId(id);
	}

	async fetchAndSetAllChannels(selectedGuild: TuiGuild | null) {
		if (!selectedGuild) return;

		const fetchedChannels = await selectedGuild.fetchChannels();
		this.setList(fetchedChannels);
	}

	selectChannel(channelId: string) {
		this.setSelectedChannelId(channelId);
	}

	hasSelectedChannel() {
		return this.selectedId !== null;
	}

	getSelectedChannel() {
		return this.list.find(x => x.id === this.selectedId) || null;
	}
}

export function useAppChannels(): ChannelsManager {
	const context = useContext(ChannelContext);
	if (!context) {
		throw new Error('useAppChannels must be used within a ChannelProvider');
	}

	const {
		channels,
		setChannels,
		selectedChannelId,
		setSelectedChannelId,
	} = context;

	return useMemo(() => {
		return new ChannelsManager(
			channels,
			selectedChannelId,
			setChannels,
			setSelectedChannelId,
		);
	}, [channels, selectedChannelId]);
}
