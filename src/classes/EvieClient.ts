import { Enumerable } from "@sapphire/decorators";
import { LogLevel, SapphireClient } from "@sapphire/framework";
import { Intents } from "discord.js";
import { Radio } from "./Radio";

export class EvieClient extends SapphireClient {
  @Enumerable(false)
  public override radio = new Radio();

  public constructor() {
    super({
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_MESSAGES,
      ],
      logger: {
        level: LogLevel.Info,
      },
      loadMessageCommandListeners: true,
      shards: "auto",
      allowedMentions: { users: [], roles: [] },
    });
  }
}

declare module "discord.js" {
  interface Client {
    readonly radio: Radio;
  }
}
