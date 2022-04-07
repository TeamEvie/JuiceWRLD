import { botAdmins } from "#root/utils/parsers/envUtils";
import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener } from "@sapphire/framework";
import { Message, Permissions } from "discord.js";

@ApplyOptions<Listener.Options>({
  once: false,
  event: Events.MessageCreate,
})
export class MessageCreate extends Listener {
  public async run(message: Message) {
    // Make sure the message is not from a bot or a DM and the client exists
    if (message.author.bot || !message.inGuild() || !message.client.user)
      return;

    if (!message.guild.me) return;

    // Perm Checking
    if (
      !(
        botAdmins.includes(message.author.id) &&
        message.channel
          .permissionsFor(message.guild.me)
          .has(Permissions.FLAGS.SEND_MESSAGES)
      )
    )
      return;

    const ping = `<@${message.client.user.id}>`;

    if (message.content == `${ping} reset app`) {
      this.resetApp(message);
    } else if (message.content == `${ping} status`) {
      message.reply("I'm alive!");
    } else if (message.content == `${ping} skip leaks`) {
      this.skipLeaks(message);
    }
  }

  private async skipLeaks(message: Message) {
    try {
      message.client.radio.playRandomSong(`leaks`);
      message.reply("Skipped leaks");
    } catch (e: any) {
      message.reply(`Error: ${e.message}`);
    }
  }

  private async resetApp(message: Message) {
    const status = await message.reply(
      "Resetting global application commands.."
    );
    await message.client.application?.commands.set([]);
    await status.edit("Resetting per guild commands...");
    message.client.guilds.cache.forEach(async (guild) => {
      console.log(`Resetting commands for ${guild.name}...`);
      await message.client.application?.commands
        .set([], guild.id)
        .catch(console.error);
      console.log(`Reset commands for ${guild.name}`);
    });
    await status.edit("Done!");
  }
}
