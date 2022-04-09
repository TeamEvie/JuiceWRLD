import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener } from "@sapphire/framework";
import type { VoiceState } from "discord.js";

@ApplyOptions<Listener.Options>({
	once: false,
	event: Events.VoiceStateUpdate,
})
export class MessageCreate extends Listener {
	public async run(oldState: VoiceState, _newState: VoiceState) {
		if (!oldState.guild.me) return;

		if (
			oldState.channel?.members.size === 1 &&
			oldState.client.radio.connections.get(oldState.guild.id)?.channel
				.id === oldState.channelId
		) {
			console.log(oldState.channel?.members.size);

			const c = oldState.client.radio.connections.get(oldState.guild.id);
			if (c) {
				c.vc.destroy();
				oldState.client.radio.connections.delete(oldState.guild.id);
			}
		}
	}
}
