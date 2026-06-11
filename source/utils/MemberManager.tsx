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
import { TuiMember, TuiChannel } from './domain.js';
import { Collection, GuildMember } from 'discord.js';

export interface MemberContextValue {
    members: TuiMember[];
    setMembers: Dispatch<SetStateAction<TuiMember[]>>;
    allMembers: TuiMember[];
    setAllMembers: Dispatch<SetStateAction<TuiMember[]>>;
}

const MemberContext = createContext<MemberContextValue | null>(null);

export function MemberProvider({ children }: { children: ReactNode }) {
    const [members, setMembers] = useState<TuiMember[]>([]);
    const [allMembers, setAllMembers] = useState<TuiMember[]>([]);

    const value = useMemo(
        () => ({
            members,
            setMembers,
            allMembers,
            setAllMembers,
        }),
        [members, allMembers],
    );

    return <MemberContext value={value}>{children}</MemberContext>;
}

export class MembersManager {
    private readonly members_height_ratio = 38 / 45;

    constructor(
        public readonly list: TuiMember[],
        private readonly setMembers: Dispatch<SetStateAction<TuiMember[]>>,
        private readonly allMembers: TuiMember[],
        private readonly setAllMembers: Dispatch<SetStateAction<TuiMember[]>>,
        private readonly membersCollectionRef: RefObject<Collection<string, GuildMember>>,
    ) { }

    private sliceForHeight(
        source: TuiMember[],
        height: number,
    ): TuiMember[] {
        const availableLines = Math.floor(height * this.members_height_ratio);
        return source.slice(0, availableLines);
    }

    setList(members: TuiMember[]) {
        this.setMembers(members);
    }

    clearAll() {
        this.setMembers([]);
        this.setAllMembers([]);
    }

    async fetchAndSetAllMembers(
        selectedChannel: TuiChannel | null,
        height: number,
    ) {
        if (!selectedChannel) return;

        this.membersCollectionRef.current = selectedChannel.members;
        const fetchedMembers = selectedChannel.members.map(m => new TuiMember(m));

        this.setAllMembers(fetchedMembers);
        this.setMembers(this.sliceForHeight(fetchedMembers, height));
    }

    updateMembersHeight(height: number) {
        const display = this.sliceForHeight(this.allMembers, height);
        this.setMembers(display);
    }

    async updatePresence(memberId: string) {
        const member = this.membersCollectionRef.current.get(memberId);
        if (!member) return;

        const newMember = await member.fetch();

        this.membersCollectionRef.current.set(newMember.id, newMember);

        const updatedAll = this.membersCollectionRef.current.map(m => new TuiMember(m));
        this.setAllMembers(updatedAll);
        this.setMembers(updatedAll);
    }
}

export function useAppMembers(): MembersManager {
    const context = useContext(MemberContext);
    if (!context) {
        throw new Error('useAppMembers must be used within a MemberProvider');
    }

    const { members, setMembers, allMembers, setAllMembers } =
        context;

    const membersCollectionRef = useRef<Collection<string, GuildMember>>(new Collection());

    return useMemo(() => {
        return new MembersManager(
            members,
            setMembers,
            allMembers,
            setAllMembers,
            membersCollectionRef,
        );
    }, [members, allMembers]);
}
