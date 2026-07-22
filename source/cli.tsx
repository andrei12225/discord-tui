#!/usr/bin/env node
import React, {useEffect, useRef, useState} from 'react';
import {render, Text, useFocusManager, useInput, useWindowSize} from 'ink';
import {Client, Events, GatewayIntentBits, GuildMember, Message, PartialGuildMember, PartialMessage, Presence} from 'discord.js';
import {GuildProvider, useAppGuilds} from './utils/GuildManager.js';
import {ChannelProvider, useAppChannels} from './utils/ChannelManager.js';
import {MessageProvider, useAppMessages} from './utils/MessageManager.js';
import MainPage from './main.js';
import { MemberProvider, useAppMembers } from './utils/MemberManager.js';

process.loadEnvFile('.env');

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildPresences
	],
});

function AppInner() {
	const [ready, setReady] = useState(false);
	const guildsManager = useAppGuilds();
	const channelsManager = useAppChannels();
	const messagesManager = useAppMessages();
	const membersManager = useAppMembers();
	const {rows, columns} = useWindowSize();
	const focusManager = useFocusManager();

	const channelsManagerRef = useRef(channelsManager);
	channelsManagerRef.current = channelsManager;
	const membersManagerRef = useRef(membersManager);
	membersManagerRef.current = membersManager;

	useEffect(() => {
		const handleReady = async () => {
			await guildsManager.fetchAndSetAllGuilds(client);

			setReady(true);
		};
		const handlePresenceUpdate = async (_: Presence | null, newPresence: Presence) => {
			const selectedChannel = channelsManagerRef.current.getSelectedChannel();
			if (!selectedChannel) return;
			if (!newPresence.member) return;
			// If the member that updated presence isn't in the selected channel, do nothing
			if (!selectedChannel.members.has(newPresence.member.id)) return;
			await membersManagerRef.current.updatePresence(newPresence.member.id);
		};
		const handleNewMember = async (member: GuildMember) => {
			const selectedChannel = channelsManagerRef.current.getSelectedChannel();
			if (!selectedChannel) return;
			// If the member that joined isn't in the selected channel, do nothing
			if (!selectedChannel.members.has(member.id)) return;
			membersManagerRef.current.handleNewMember(member);
		};
		const handleMemberRemove = async (member: GuildMember | PartialGuildMember) => {
			const selectedChannel = channelsManagerRef.current.getSelectedChannel();
			if (!selectedChannel) return;
			// If the member that left isn't in the selected channel, do nothing
			if (!selectedChannel.members.has(member.id)) return;
			membersManagerRef.current.handleMemberRemove(member);
		};
		const handleMessageCreate = async (message: Message) => {
			if (message.channel.isDMBased()) return;
			const selectedChannel = channelsManagerRef.current.getSelectedChannel();
			if (!selectedChannel) return;
			// If the message that was created isn't in the selected channel, do nothing
			if (message.channelId !== selectedChannel.id) return;
			messagesManager.handleNewMessage(message);
		};
		const handleMessageDelete = async (message: Message | PartialMessage) => {
			if (message.channel.isDMBased()) return;
			const selectedChannel = channelsManagerRef.current.getSelectedChannel();
			if (!selectedChannel) return;
			// If the message that was deleted isn't in the selected channel, do nothing
			if (message.channelId !== selectedChannel.id) return;
			messagesManager.handleMessageDelete(message);
		};

		client.on(Events.MessageCreate, handleMessageCreate);
		client.on(Events.MessageDelete, handleMessageDelete);
		client.on(Events.GuildMemberAdd, handleNewMember);
		client.on(Events.GuildMemberRemove, handleMemberRemove);
		client.on(Events.PresenceUpdate, handlePresenceUpdate);
		client.on(Events.ClientReady, handleReady);

		return () => {
			client.off(Events.MessageCreate, messagesManager.handleNewMessage);
			client.off(Events.PresenceUpdate, handlePresenceUpdate);
			client.off(Events.GuildMemberAdd, handleNewMember);
			client.off(Events.GuildMemberRemove, handleMemberRemove);
			client.off(Events.ClientReady, handleReady);
		};
	}, [client]);

	useEffect(() => {
		const selectedChannel = channelsManager.getSelectedChannel();
		messagesManager.fetchAndSetAllMessages(
			selectedChannel,
			rows,
			columns,
		);
		membersManager.fetchAndSetAllMembers(selectedChannel, rows);
	}, [channelsManager.selectedId]);

	useEffect(() => {
		messagesManager.updateMessagesHeight(rows, columns);
	}, [rows, messagesManager.list.length]);

	useEffect(() => {
		membersManager.updateMembersHeight(rows);
	}, [rows, membersManager.list.length]);

	useInput(async (event, key) => {
		if (key.escape) {
			if (channelsManager.hasSelectedChannel()) {
				guildsManager.deselectGuild();
				channelsManager.deselectChannel();
				channelsManager.setList([]);
				messagesManager.clearAll();
				membersManager.clearAll();
			}
		} else if (event == '/') {
			if (channelsManager.hasSelectedChannel())
				focusManager.focus(process.env['chatbox-id']!);
		}
	});

	return ready ? (
		<MainPage />
	) : (
		<Text color={'blue'} italic>
			Bot loading...
		</Text>
	);
}

function App() {
	return (
		<GuildProvider>
			<ChannelProvider>
				<MemberProvider>
					<MessageProvider>
						<AppInner />
					</MessageProvider>
				</MemberProvider>
			</ChannelProvider>
		</GuildProvider>
	);
}

render(<App />);

client.login(process.env['BOT_TOKEN']);
