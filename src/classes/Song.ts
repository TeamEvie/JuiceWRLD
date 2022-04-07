import type { AudioResource } from "@discordjs/voice";

export class Song {
  constructor(public audioResource: AudioResource, public genre: string) {}
}
