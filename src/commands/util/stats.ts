import { EvieEmbed } from "#root/classes/EvieEmbed";
import { registeredGuilds } from "#root/utils/parsers/envUtils";
import {
  ApplicationCommandRegistry,
  Command,
  RegisterBehavior,
} from "@sapphire/framework";
import {
  CommandInteraction,
  MessageActionRow,
  MessageButton,
} from "discord.js";

export class Stats extends Command {
  public override async chatInputRun(interaction: CommandInteraction) {
    interaction.reply({
      embeds: [
        new EvieEmbed()
          .setTitle("Juice WRLD Stats")
          .setDescription(
            "Juice WRLD is part of the [Evie Discord Bot family](https://discord.gg/5MWQeVgP7f)."
          )
          .addField(
            `__Shard Stats__`,
            `
            **Users**: ${interaction.client.guilds.cache.reduce(
              (acc, guild) => acc + guild.memberCount,
              0
            )}
            **Servers**: ${interaction.client.guilds.cache.reduce(
              (acc) => acc + 1,
              0
            )}
            **Streaming to**: ${interaction.client.voice.adapters.size} channels
          `,
            true
          )
          .addField(
            `__Radio Stats__`,
            interaction.client.radio.radios
              .map((_value, key) => {
                return `
                  **${key}** (${
                  interaction.client.radio.queues.get(key)?.length ?? 0
                } songs)
                  Now Playing: **${
                    interaction.client.radio.nowPlaying.get(key)?.title ??
                    "Nothing"
                  }**
                  `;
              })
              .join("")
          ),
      ],
      components: [
        new MessageActionRow().addComponents(
          new MessageButton()
            .setURL(
              "https://discord.com/api/oauth2/authorize?client_id=961142622636871781&permissions=3146752&scope=bot%20applications.commands"
            )
            .setLabel("Invite me to your server")
            .setStyle("LINK")
        ),
      ],
    });
  }

  public override registerApplicationCommands(
    registry: ApplicationCommandRegistry
  ) {
    registry.registerChatInputCommand(
      {
        name: this.name,
        description: "View stats and what's currently playing.",
      },
      {
        guildIds: registeredGuilds,
        behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
      }
    );
  }
}
