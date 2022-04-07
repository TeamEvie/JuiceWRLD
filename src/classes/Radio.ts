import {
  AudioPlayer,
  AudioPlayerStatus,
  createAudioPlayer,
  entersState,
  generateDependencyReport,
  joinVoiceChannel,
  VoiceConnection,
  VoiceConnectionStatus,
} from "@discordjs/voice";
import { Collection, Guild, GuildMember, VoiceBasedChannel } from "discord.js";
import { glob } from "glob";
import { Song } from "./Song";

export class Radio {
  constructor() {
    console.log(`
    Initializing Radio
    ${generateDependencyReport()}
    `);
    this.getReady();
  }

  private connections = new Collection<string, VoiceConnection>();
  public queues = new Collection<string, Song[]>();
  public radios = new Collection<string, AudioPlayer>();
  public nowPlaying = new Collection<string, Song>();

  private async getReady() {
    const songs = await this.getMusic();

    songs.forEach((songFile) => {
      console.log(
        `Found song: ${songFile} with the genre ${songFile.split("/")[2]}`
      );
      this.queues.set(
        songFile.split("/")[2],
        this.queues
          .get(songFile.split("/")[2])
          ?.concat(new Song(songFile, songFile.split("/")[2])) ?? [
          new Song(songFile, songFile.split("/")[2]),
        ]
      );
    });

    this.queues.forEach((queue) => {
      console.log(`Creating station for ${queue[0].genre}`);
      this.createRadio(queue[0].genre);
      this.playRandomSong(queue[0].genre);
    });
  }

  private createRadio(genre: string) {
    this.radios.set(
      genre,
      createAudioPlayer().on(AudioPlayerStatus.Idle, () => {
        this.playRandomSong(genre);
      })
    );
  }

  public playRandomSong(genre: string): void {
    const songs = this.queues.get(genre);

    if (!songs) throw new Error("No songs found for this genre.");

    const song = songs[Math.floor(Math.random() * songs.length)];

    if (song == this.nowPlaying.get(genre)) {
      this.playRandomSong(genre);
      return;
    }

    if (songs) {
      this.nowPlaying.set(genre, song);
      this.radios.get(genre)?.play(song.audioResource);
      return;
    }
  }

  public async createConnection(channel: VoiceBasedChannel) {
    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });
    this.connections.set(channel.guildId, connection);
    connection.on(
      VoiceConnectionStatus.Disconnected,
      async (oldState, newState) => {
        try {
          await Promise.race([
            entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
            entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
          ]);
          // Seems to be reconnecting to a new channel - ignore disconnect
        } catch (error) {
          connection.destroy();
          this.connections.delete(channel.guildId);
        }
      }
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
        throw new Error("Already streaming in this guild.");
      } else {
        await this.createConnection(voice.channel);
        const connection = this.connections.get(guild.id);
        if (!connection) throw new Error("Connection not found.");

        const radio = this.radios.get(genre);
        if (!radio) throw new Error("Station not found.");

        connection.subscribe(radio);
        return `Tuned into ${genre}`;
      }
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  private async getMusic(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      glob(`./music/**/*{.mp3, .wav}`, (err, files) => {
        if (err) {
          reject(err);
        }
        resolve(files);
      });
    });
  }
}
