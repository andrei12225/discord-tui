import {useContext, useMemo} from 'react';
import {ChannelContext} from '../cli.js';
import {TuiChannel} from './domain.js';

export class ChannelsManager {
	constructor(
		public readonly list: TuiChannel[],
		public readonly focusedId: string | null,
	) {}

	getFocusedChannel(): TuiChannel | null {
		return this.list.find(c => c.id === this.focusedId) || null;
	}
}

export function useAppChannels(): ChannelsManager {
	const context = useContext(ChannelContext);
	if (!context) {
		throw new Error(
			'useAppChannels must be used within a ChannelContext provider',
		);
	}

	const {channels, setChannels, focusedChannelId} = context;

	return useMemo(() => {
		return new ChannelsManager(channels, focusedChannelId);
	}, [channels, focusedChannelId, setChannels]);
}
