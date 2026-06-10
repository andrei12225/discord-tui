import React, {
	createContext,
	Dispatch,
	SetStateAction,
	useContext,
	useMemo,
	useState,
	ReactNode,
} from 'react';
import {TuiGuild} from './domain.js';
import {Client} from 'discord.js';

export interface GuildContextValue {
	guilds: TuiGuild[];
	setGuilds: Dispatch<SetStateAction<TuiGuild[]>>;
	selectedGuildId: string | null;
	setSelectedGuildId: Dispatch<SetStateAction<string | null>>;
}

const GuildContext = createContext<GuildContextValue | null>(null);

export function GuildProvider({children}: {children: ReactNode}) {
	const [guilds, setGuilds] = useState<TuiGuild[]>([]);
	const [selectedGuildId, setSelectedGuildId] = useState<string | null>(null);

	const value = useMemo(
		() => ({
			guilds,
			setGuilds,
			selectedGuildId,
			setSelectedGuildId,
		}),
		[guilds, selectedGuildId],
	);

	return <GuildContext value={value}>{children}</GuildContext>;
}

export class GuildsManager {
	constructor(
		public readonly list: TuiGuild[],
		public readonly selectedId: string | null,
		private readonly setGuilds: Dispatch<SetStateAction<TuiGuild[]>>,
		private readonly setSelectedId: Dispatch<SetStateAction<string | null>>,
	) {}

	getSelectedGuild(): TuiGuild | null {
		return this.list.find(g => g.id === this.selectedId) || null;
	}

	setList(guilds: TuiGuild[]) {
		this.setGuilds(guilds);
	}

	selectGuild(guildId: string) {
		this.setSelectedId(guildId);
	}

	deselectGuild() {
		this.setSelectedId(null);
	}

	async fetchAndSetAllGuilds(client: Client) {
		const allOAuthGuilds = await client.guilds.fetch();
		const fetchedGuilds = await Promise.all(
			Array.from(allOAuthGuilds.values()).map(g => g.fetch()),
		);

		const wrappedGuilds = fetchedGuilds.map(g => new TuiGuild(g));
		this.setList(wrappedGuilds);
	}

	hasSelectedGuild() {
		return this.selectedId !== null;
	}
}

export function useAppGuilds(): GuildsManager {
	const context = useContext(GuildContext);
	if (!context) {
		throw new Error('useAppGuilds must be used within a GuildProvider');
	}

	const {guilds, setGuilds, selectedGuildId, setSelectedGuildId} = context;

	return useMemo(() => {
		return new GuildsManager(
			guilds,
			selectedGuildId,
			setGuilds,
			setSelectedGuildId,
		);
	}, [guilds, selectedGuildId]);
}
