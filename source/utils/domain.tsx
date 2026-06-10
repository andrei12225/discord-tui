import {
	Guild,
	Message,
	CategoryChannel,
	ForumChannel,
	MediaChannel,
	NewsChannel,
	StageChannel,
	TextChannel,
	VoiceChannel,
} from 'discord.js';

export type RawChannel =
	| CategoryChannel
	| NewsChannel
	| StageChannel
	| TextChannel
	| VoiceChannel
	| ForumChannel
	| MediaChannel;

export class TuiChannel {
	constructor(public readonly raw: RawChannel) {}

	get id() {
		return this.raw.id;
	}

	get name() {
		return this.raw.name;
	}

	get istext() {
		return this.raw.isTextBased() && !this.raw.isVoiceBased();
	}
}

export class TuiGuild {
	constructor(public readonly raw: Guild) {}

	get id() {
		return this.raw.id;
	}

	get name() {
		return this.raw.name;
	}

	async fetchChannels(): Promise<TuiChannel[]> {
		const channelsCollection = await this.raw.channels.fetch();
		return Array.from(channelsCollection.values())
			.filter((c): c is RawChannel => c !== null && c !== undefined)
			.map(c => new TuiChannel(c))
			.filter(c => c.istext);
	}
}

export class TuiMessage {
	constructor(public readonly raw: Message) {}

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
