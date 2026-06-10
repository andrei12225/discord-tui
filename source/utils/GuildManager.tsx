import {useContext, useMemo} from 'react';
import {GuildContext} from '../cli.js';
import {TuiGuild} from './domain.js';

export class GuildsManager {
	constructor(
		public readonly list: TuiGuild[],
		public readonly focusedId: string | null,
	) {}

	getFocusedGuild(): TuiGuild | null {
		return this.list.find(g => g.id === this.focusedId) || null;
	}
}

export function useAppGuilds(): GuildsManager {
	const context = useContext(GuildContext);
	if (!context) {
		throw new Error('useAppGuilds must be used within a GuildContext provider');
	}

	const {guilds, focusedGuildId} = context;

	return useMemo(() => {
		return new GuildsManager(guilds, focusedGuildId);
	}, [guilds, focusedGuildId]);
}
