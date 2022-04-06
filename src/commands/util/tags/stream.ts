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
    // https://discordjs.guide/voice/audio-player.html#playing-audio

    await ReplyStatusEmbed(
      StatusEmoji.SUCCESS,
      "woah! you successfully stole evie's source code and removed everything but the utils folder!",
      interaction
    );
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
