import {
	EvieEmbed,
	ReplyStatusEmbed,
	StatusEmoji,
} from "#root/classes/EvieEmbed";
import { registeredGuilds } from "#utils/parsers/envUtils";
import {
	ApplicationCommandRegistry,
	Command,
	RegisterBehavior,
} from "@sapphire/framework";
import {
	AutocompleteInteraction,
	CommandInteraction,
	MessageActionRow,
	MessageButton,
} from "discord.js";

export class Stream extends Command {
	public override async chatInputRun(
		interaction: CommandInteraction
	): Promise<void> {
		if (!interaction.inCachedGuild()) return;
		const station = interaction.options.getString("station");

		if (!station) {
			await ReplyStatusEmbed(
				StatusEmoji.FAIL,
				"No station specified.",
				interaction,
				true
			);
			return;
		}

		interaction.reply({
			embeds: [
				new EvieEmbed().setTitle("Info").setDescription(
					`Juice WRLD is currently shut down, as we thought unreleased music would not have any copyright issues.
            After more research, we have come to the conclusion that we will be contacting [Grade A](https://gradeaproduction.com/),
            before streaming anymore music. We're sorry for the inconvenience, we recommend for the moment to use [Activities](https://discord.com/oauth2/authorize?client_id=819778342818414632&scope=bot%20applications.commands)
            a bot that can allow you to use YouTube Together to watch YouTube at the same time with others in a voice chat.`
				),
			],
			components: [
				new MessageActionRow().addComponents(
					new MessageButton()
						.setURL("https://discord.gg/5MWQeVgP7f")
						.setLabel("Support Server")
						.setStyle("LINK")
				),
			],
		});

		// const status = await interaction.client.radio.subscribeToGenre(
		//   station,
		//   interaction.member
		// );
		// await ReplyStatusEmbed(
		//   status.error ? StatusEmoji.FAIL : StatusEmoji.SUCCESS,
		//   status.message,
		//   interaction
		// );
	}

	public override async autocompleteRun(
		interaction: AutocompleteInteraction
	) {
		if (!interaction.guild) return;
		const stationData = interaction.client.radio.radios;
		const query = interaction.options.getString("station") ?? "";

		// Collection<string, AudioPlayer>();
		// filter the stations by the query, the station name is the string key

		return await interaction.respond(
			// stationData.map((value, key) => {
			//   return {
			//     name: `📻 ${key}`,
			//     value: key,
			//   };
			// })
			[
				{
					name: `📻 Leaks`,
					value: "nope",
				},
			]
		);
	}

	public override registerApplicationCommands(
		registry: ApplicationCommandRegistry
	) {
		registry.registerChatInputCommand(
			{
				name: this.name,
				description: "Tune-in to a Juice WRLD radio station.",
				options: [
					{
						name: "station",
						description: "The station to tune-in to.",
						type: "STRING",
						autocomplete: true,
						required: true,
					},
				],
			},
			{
				guildIds: registeredGuilds,
				behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
			}
		);
	}
}
