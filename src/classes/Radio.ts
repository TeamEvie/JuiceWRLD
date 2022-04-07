import {
  createAudioPlayer,
  createAudioResource,
  generateDependencyReport,
  joinVoiceChannel,
  VoiceConnection,
} from "@discordjs/voice";
import { Collection, Guild, GuildMember, VoiceBasedChannel } from "discord.js";
import { glob } from "glob";
import type { EvieClient } from "./EvieClient";
import { Song } from "./Song";

export class Radio {
  constructor(client: EvieClient) {
    console.log(`
    Initializing Radio
    ${generateDependencyReport()}
    `);
    this.getReady();
  }

  private connections = new Collection<string, VoiceConnection>();
  private songs: Song[] = [];

  public songRadio = createAudioPlayer();
  private freestyleRadio = createAudioPlayer();

  public async createConnection(channel: VoiceBasedChannel) {
    this.connections.set(
      channel.guildId,
      joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
      })
    );
  }

  public doesConnectionExist(guild: Guild): boolean {
    return this.connections.has(guild.id);
  }

  public async subscribeToGenre(genre: string, member: GuildMember) {
    const { voice, guild } = member;

    if (!voice.channel)
      throw new Error("You must be in a voice channel to use this command.");
    try {
      if (this.doesConnectionExist(guild)) {
        return "Already subscribed to this genre.";
      } else {
        await this.createConnection(voice.channel);
        const connection = this.connections.get(guild.id);
        if (!connection) throw new Error("Connection not found.");
        connection.subscribe(this.songRadio);
        return `Subscribed to ${genre}`;
      }
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  private async getMusic(genre: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      glob(`./music/${genre}/*.mp3`, (err, files) => {
        if (err) {
          reject(err);
        }
        resolve(files);
      });
    });
  }

  private async getReady() {
    const songs = await this.getMusic("leaks");

    songs.forEach((song) => {
      this.songs.push(new Song(createAudioResource(song), "leaks"));
    });
    this.songRadio.play(this.songs[0].audioResource);
  }
}
