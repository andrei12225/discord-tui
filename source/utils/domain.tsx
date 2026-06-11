import { Collection, Guild, GuildMember, Message, NewsChannel, TextChannel } from 'discord.js';

export type RawChannel = NewsChannel | TextChannel;

export class TuiChannel {
	constructor(public readonly raw: RawChannel) { }

	get id() {
		return this.raw.id;
	}

	get name() {
		return this.raw.name;
	}

	get istext() {
		return this.raw.isTextBased() && !this.raw.isVoiceBased();
	}

	get messages() {
		return this.raw.messages;
	}

	get members(): Collection<string, GuildMember> {
		return this.raw.members;
	}

	async sendMessage(content: string) {
		await this.raw.send({ content });
	}
}

export class TuiGuild {
	constructor(public readonly raw: Guild) { }

	get id() {
		return this.raw.id;
	}

	get name() {
		return this.raw.name;
	}

	async fetchChannels(): Promise<TuiChannel[]> {
		await this.raw.members.fetch();

		const channelsCollection = await this.raw.channels.fetch();
		return Array.from(channelsCollection.values())
			.filter((c): c is RawChannel => c !== null && c !== undefined)
			.map(c => new TuiChannel(c))
			.filter(c => c.istext);
	}
}

export class TuiMessage {
	constructor(public readonly raw: Message) { }

	get id() {
		return this.raw.id;
	}

	get content() {
		return this.raw.content;
	}

	get author() {
		return this.raw.author;
	}
}

export class TuiMember {
	constructor(public readonly raw: GuildMember) { }

	get id() {
		return this.raw.id;
	}

	get displayName() {
		return this.raw.displayName;
	}

	get status() {
		return this.raw.presence?.status || 'offline';
	}

	get statusColor() {
        if (!this.status) return process.env['color-offline'];
        return process.env[`color-${this.status}`];
    }
	
	get displayHexColor() {
		return this.raw.displayHexColor;
	}
}
