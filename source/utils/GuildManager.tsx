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

export interface GuildContextValue {
	guilds: TuiGuild[];
	setGuilds: Dispatch<SetStateAction<TuiGuild[]>>;
	focusedGuildId: string | null;
	setFocusedGuildId: Dispatch<SetStateAction<string | null>>;
	selectedGuildId: string | null;
	setSelectedGuildId: Dispatch<SetStateAction<string | null>>;
}

const GuildContext = createContext<GuildContextValue | null>(null);

export function GuildProvider({children}: {children: ReactNode}) {
	const [guilds, setGuilds] = useState<TuiGuild[]>([]);
	const [focusedGuildId, setFocusedGuildId] = useState<string | null>(null);
	const [selectedGuildId, setSelectedGuildId] = useState<string | null>(null);

	const value = useMemo(
		() => ({
			guilds,
			setGuilds,
			focusedGuildId,
			setFocusedGuildId,
			selectedGuildId,
			setSelectedGuildId,
		}),
		[guilds, focusedGuildId],
	);

	return <GuildContext value={value}>{children}</GuildContext>;
}

export class GuildsManager {
	constructor(
		public readonly list: TuiGuild[],
		public readonly focusedId: string | null,
		public readonly selectedId: string | null,
		private readonly setGuilds: Dispatch<SetStateAction<TuiGuild[]>>,
		private readonly setFocusedId: Dispatch<SetStateAction<string | null>>,
		private readonly setSelectedId: Dispatch<SetStateAction<string | null>>,
	) {}

	getFocusedGuild(): TuiGuild | null {
		return this.list.find(g => g.id === this.focusedId) || null;
	}

	getSelectedGuild(): TuiGuild | null {
		return this.list.find(g => g.id === this.selectedId) || null;
	}

	setList(guilds: TuiGuild[]) {
		this.setGuilds(guilds);
	}

	setFocusedGuildId(id: string | null) {
		this.setFocusedId(id);
	}

	setSelectedGuildId(id: string | null) {
		this.setSelectedId(id);
	}

	focusNext() {
		if (this.list.length === 0) return;
		const currentIndex = this.list.findIndex(g => g.id === this.focusedId);
		if (currentIndex === -1) return;
		const nextIndex = (currentIndex + 1) % this.list.length;
		this.setFocusedId(this.list[nextIndex]!.id);
	}

	focusPrevious() {
		if (this.list.length === 0) return;
		const currentIndex = this.list.findIndex(g => g.id === this.focusedId);
		if (currentIndex === -1) return;
		const nextIndex = (currentIndex - 1 + this.list.length) % this.list.length;
		this.setFocusedId(this.list[nextIndex]!.id);
	}

	selectFocusedGuild() {
		this.setSelectedId(this.focusedId);
	}
}

export function useAppGuilds(): GuildsManager {
	const context = useContext(GuildContext);
	if (!context) {
		throw new Error('useAppGuilds must be used within a GuildProvider');
	}

	const {
		guilds,
		setGuilds,
		focusedGuildId,
		setFocusedGuildId,
		selectedGuildId,
		setSelectedGuildId,
	} = context;

	return useMemo(() => {
		return new GuildsManager(
			guilds,
			focusedGuildId,
			selectedGuildId,
			setGuilds,
			setFocusedGuildId,
			setSelectedGuildId,
		);
	}, [guilds, focusedGuildId, setGuilds, setFocusedGuildId, selectedGuildId, setSelectedGuildId]);
}
