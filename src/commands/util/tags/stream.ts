import { ReplyStatusEmbed, StatusEmoji } from "#root/classes/EvieEmbed";
import { registeredGuilds } from "#utils/parsers/envUtils";
import {
  ApplicationCommandRegistry,
  Command,
  RegisterBehavior,
} from "@sapphire/framework";
import type { AutocompleteInteraction, CommandInteraction } from "discord.js";

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

    try {
      const status = await interaction.client.radio.subscribeToGenre(
        station,
        interaction.member
      );
      await ReplyStatusEmbed(StatusEmoji.SUCCESS, status, interaction);
    } catch (e: any) {
      await ReplyStatusEmbed(
        StatusEmoji.FAIL,
        e.message ?? "Unknown Error",
        interaction,
        true
      );
      return;
    }
  }

  public override async autocompleteRun(interaction: AutocompleteInteraction) {
    if (!interaction.guild) return;
    const stationData = interaction.client.radio.radios;
    const query = interaction.options.getString("station") ?? "";

    // Collection<string, AudioPlayer>();
    // filter the stations by the query, the station name is the string key

    return await interaction.respond(
      stationData.map((value, key) => {
        return {
          name: `📻${key}`,
          value: key,
        };
      })
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
