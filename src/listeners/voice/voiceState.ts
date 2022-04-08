import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener } from "@sapphire/framework";
import type { VoiceState } from "discord.js";

@ApplyOptions<Listener.Options>({
	once: false,
	event: Events.VoiceStateUpdate,
})
export class MessageCreate extends Listener {
	public async run(_oldState: VoiceState, newState: VoiceState) {
		if (!newState.channel?.members.size) {
			const c = newState.client.radio.connections.get(newState.guild.id);
			if (c) {
				c.destroy();
				newState.client.radio.connections.delete(newState.guild.id);
			}
		}
	}
}
