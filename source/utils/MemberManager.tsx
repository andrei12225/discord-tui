import React, {
    createContext,
    Dispatch,
    SetStateAction,
    useContext,
    useMemo,
    useRef,
    useState,
    ReactNode,
    RefObject,
} from 'react';
import {TuiMember, TuiChannel} from './domain.js';
import { Collection, GuildMember } from 'discord.js';

export interface MemberContextValue {
    members: TuiMember[];
    setMembers: Dispatch<SetStateAction<TuiMember[]>>;
}

const MemberContext = createContext<MemberContextValue | null>(null);

export function MemberProvider({children}: {children: ReactNode}) {
    const [members, setMembers] = useState<TuiMember[]>([]);

    const value = useMemo(
        () => ({
            members,
            setMembers,
        }),
        [members],
    );

    return <MemberContext value={value}>{children}</MemberContext>;
}

export class MembersManager {
    constructor(
        public readonly list: TuiMember[],
        private readonly setMembers: Dispatch<SetStateAction<TuiMember[]>>,
        private readonly membersCollectionRef: RefObject<Collection<string, GuildMember>>,
    ) {}

    setList(members: TuiMember[]) {
        this.setMembers(members);
    }

    async fetchAndSetAllMembers(selectedChannel: TuiChannel | null) {
        if (!selectedChannel) return;

        this.membersCollectionRef.current = selectedChannel.members;
        const fetchedMembers = selectedChannel.members.map(m => new TuiMember(m));
        this.setList(fetchedMembers);
    }

    async updatePresence(memberId: string) {
        const member = this.membersCollectionRef.current.get(memberId);
        if (!member) return;
        
        const newMember = await member.fetch();

        this.membersCollectionRef.current.set(newMember.id, newMember);

        this.setList(this.membersCollectionRef.current.map(m => new TuiMember(m)));
    }
}

export function useAppMembers(): MembersManager {
    const context = useContext(MemberContext);
    if (!context) {
        throw new Error('useAppMembers must be used within a MemberProvider');
    }

    const {members, setMembers} =
        context;

    const membersCollectionRef = useRef<Collection<string, GuildMember>>(new Collection());

    return useMemo(() => {
        return new MembersManager(
            members,
            setMembers,
            membersCollectionRef,
        );
    }, [members]);
}
