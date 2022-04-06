import {
  AudioResource,
  createAudioPlayer,
  createAudioResource,
  generateDependencyReport,
  VoiceConnection,
} from "@discordjs/voice";
import { Collection } from "discord.js";
import { glob } from "glob";
import type { EvieClient } from "./EvieClient";

export class Radio {
  constructor(client: EvieClient) {
    console.log(`
    Initializing Radio
    ${generateDependencyReport()}
    `);
    this.getReady();
  }

  private connections = new Collection<string, VoiceConnection>();

  private songs: AudioResource[] = [];

  public songRadio = createAudioPlayer();
  private freestyleRadio = createAudioPlayer();

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
    const songs = await this.getMusic("songs");

    songs.forEach((song) => {
      this.songs.push(createAudioResource(song));
    });

    this.songRadio.play(this.songs[0]);
  }
}
