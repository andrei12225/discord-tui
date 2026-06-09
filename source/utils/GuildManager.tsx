import {Guild} from 'discord.js';
import { useMemo, useState } from 'react';

export type TuiGuild = Guild & {isFocused: boolean};

export function useAppGuilds(initialGuilds: Guild[]) {
    const [guildList, setGuildList] = useState<TuiGuild[]>(() => 
        initialGuilds.map((guild, index) => 
            Object.assign(guild, { isFocused: index === 0 })
        )
    );

    const focusedGuild = useMemo(() => {
        return guildList.find(g => g.isFocused);
    }, [guildList]);

    const setFocus = (guildId: string) => {
        setGuildList(prev => 
            prev.map(guild =>
                Object.assign(guild, { isFocused: guild.id === guildId })
        ));
    };

    return {
        guildList,
        focusedGuild,
        setFocus
    }
}