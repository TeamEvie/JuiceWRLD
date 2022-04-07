export const registeredGuilds = process.env.GUILD_IDS
  ? process.env.GUILD_IDS.split(",")
  : [];

export const botAdmins = process.env.BOT_ADMINS
  ? process.env.BOT_ADMINS.split(",")
  : ["97470053615673344"];
