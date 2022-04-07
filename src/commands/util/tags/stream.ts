import { ReplyStatusEmbed, StatusEmoji } from "#root/classes/EvieEmbed";
import { registeredGuilds } from "#utils/parsers/envUtils";
import {
  ApplicationCommandRegistry,
  Command,
  RegisterBehavior,
} from "@sapphire/framework";
import type { CommandInteraction } from "discord.js";

export class Stream extends Command {
  public override async chatInputRun(
    interaction: CommandInteraction
  ): Promise<void> {
    if (!interaction.inCachedGuild()) return;
    // https://discordjs.guide/voice/audio-player.html#playing-audio
    try {
      const status = await interaction.client.radio.subscribeToGenre(
        "leaks",
        interaction.member
      );
      await ReplyStatusEmbed(StatusEmoji.SUCCESS, status, interaction);
    } catch (e) {
      await ReplyStatusEmbed(StatusEmoji.FAIL, e.message, interaction);
    }
  }

  public override registerApplicationCommands(
    registry: ApplicationCommandRegistry
  ) {
    registry.registerChatInputCommand(
      {
        name: this.name,
        description: "Start streaming the Juice WRLD radio.",
      },
      {
        guildIds: registeredGuilds,
        behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
      }
    );
  }
}
