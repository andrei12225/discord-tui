import {useContext, useMemo} from 'react';
import {AppContext} from '../cli.js';

export function useAppGuilds() {
	const context = useContext(AppContext);
	if (!context) {
		throw new Error('useAppGuilds must be used within an AppContext provider');
	}

	const {guilds, focusedGuildId, setFocusedGuildId} = context;

	const focusedGuild = useMemo(() => {
		return guilds.find(g => g.id === focusedGuildId) || null;
	}, [guilds, focusedGuildId]);

	return {
		guildList: guilds,
		focusedGuild,
		setFocus: setFocusedGuildId,
	};
}
