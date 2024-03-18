import { Injectable, NotFoundException } from '@nestjs/common';
import { Album } from 'src/album/entities/album.entity';
import { Artist } from 'src/artist/entities/artist.entity';
import { DatabaseService } from 'src/database/database.service';
import { Track } from 'src/track/entities/track.entity';

const DB_KEY_TRACK = 'favs_track';
const DB_KEY_ALBUM = 'favs_album';
const DB_KEY_ARTIST = 'favs_artist';

@Injectable()
export class FavoritesService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAllArtists() {
    const favArtists = await this.databaseService.findAll(DB_KEY_ARTIST);

    return favArtists.map((favAlbum) => new Artist(favAlbum));
  }

  async findAllAlbums() {
    const favAlbums = await this.databaseService.findAll(DB_KEY_ALBUM);

    return favAlbums.map((favAlbum) => new Album(favAlbum));
  }

  async findAllTracks() {
    const favTracks = await this.databaseService.findAll(DB_KEY_TRACK);

    return favTracks.map((favTrack) => new Track(favTrack));
  }

  async findAll() {
    const [artists, albums, tracks] = await Promise.all([
      this.findAllArtists(),
      this.findAllAlbums(),
      this.findAllTracks(),
    ]);

    return {
      artists,
      albums,
      tracks,
    };
  }

  async addTrack(track: Track) {
    return await this.databaseService.create(DB_KEY_TRACK, track);
  }

  async removeTrack(id: string) {
    const isRemoved = await this.databaseService.remove(DB_KEY_TRACK, id);

    if (!isRemoved) throw new NotFoundException('Track not found');

    return isRemoved;
  }

  async addAlbum(album: Album) {
    return await this.databaseService.create(DB_KEY_ALBUM, album);
  }

  async removeAlbum(id: string) {
    const isRemoved = await this.databaseService.remove(DB_KEY_ALBUM, id);

    if (!isRemoved) throw new NotFoundException('Album not found');

    return isRemoved;
  }

  async addArtist(artist: Artist) {
    return await this.databaseService.create(DB_KEY_ARTIST, artist);
  }

  async removeArtist(id: string) {
    const isRemoved = await this.databaseService.remove(DB_KEY_ARTIST, id);

    if (!isRemoved) throw new NotFoundException('Artist not found');

    return isRemoved;
  }
}
