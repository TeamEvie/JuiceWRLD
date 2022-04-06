import {
  ButtonInteraction,
  CommandInteraction,
  ContextMenuInteraction,
  Message,
  MessageEmbed,
  ModalSubmitInteraction,
} from "discord.js";
import type { APIMessage } from "discord.js/node_modules/discord-api-types/v9";

export enum StatusEmoji {
  SUCCESS = "<a:success:952340083418230874>",
  FAIL = "<a:fail:952340157858709594>",
}
export class EvieEmbed extends MessageEmbed {
  public constructor() {
    super();
    this.setColor(`#23272A`).setTimestamp().setFooter({
      text: "Evie",
      iconURL: "https://eviebot.rocks/assets/EvieIcon.png",
    });
  }
}

export async function StatusEmbed(status: StatusEmoji, description: string) {
  return new MessageEmbed()
    .setColor(status === StatusEmoji.SUCCESS ? "#00ff00" : "#ff0000")
    .setTimestamp()
    .setFooter({
      text: "Evie",
      iconURL: "https://eviebot.rocks/assets/EvieIcon.png",
    })
    .setDescription(`${status} ${description}`);
}

export async function ReplyStatusEmbed(
  status: StatusEmoji,
  description: string,
  i:
    | CommandInteraction
    | ModalSubmitInteraction
    | ContextMenuInteraction
    | ButtonInteraction,
  ephemeral: boolean = false
): Promise<Message | Message<boolean> | APIMessage | void> {
  const embed = new MessageEmbed()
    .setColor(status === StatusEmoji.SUCCESS ? "#00ff00" : "#ff0000")
    .setTimestamp()
    .setFooter({
      text: "Evie",
      iconURL: "https://eviebot.rocks/assets/EvieIcon.png",
    })
    .setDescription(`${status} ${description}`);

  return i.replied
    ? i.followUp({
        embeds: [embed],
        ephemeral,
      })
    : i.reply({
        embeds: [embed],
        ephemeral,
      });
}
