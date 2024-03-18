import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { v4 } from 'uuid';
import { Artist } from './entities/artist.entity';
import { DatabaseService } from 'src/database/database.service';
import { TrackService } from 'src/track/track.service';
import { AlbumService } from 'src/album/album.service';
import { FavoritesService } from 'src/favorites/favorites.service';

const DB_KEY = 'artists';

@Injectable()
export class ArtistService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly trackService: TrackService,
    private readonly albumService: AlbumService,
    private readonly favoritesService: FavoritesService,
  ) {}

  async create(createArtistDto: CreateArtistDto) {
    const newArtist: Artist = {
      id: v4(),
      ...createArtistDto,
    };

    const artist = await this.databaseService.create(DB_KEY, newArtist);

    return new Artist(artist);
  }

  async findAll() {
    const artists = await this.databaseService.findAll(DB_KEY);

    return artists.map((artist) => new Artist(artist));
  }

  async findOne(id: string) {
    const artist = await this.databaseService.findOne(DB_KEY, id);

    if (!artist) throw new NotFoundException('Artist not found');

    return new Artist(artist);
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    const artist = await this.databaseService.findOne(DB_KEY, id);

    if (!artist) throw new NotFoundException('Artist not found');

    const dataForUpdate = {
      ...artist,
      ...updateArtistDto,
    };

    const updatedArtist = await this.databaseService.update(
      DB_KEY,
      id,
      dataForUpdate,
    );

    return new Artist(updatedArtist);
  }

  async remove(id: string) {
    const removedArtist = await this.databaseService.remove(DB_KEY, id);

    if (!removedArtist) throw new NotFoundException('Artist not found');

    const tracks = await this.trackService.findAll();

    const tracksForUpdate = tracks.filter(
      (track) => track.artistId === removedArtist.id,
    );

    tracksForUpdate.forEach(async (track) => {
      await this.trackService.update(track.id, { ...track, artistId: null });
    });

    const albums = await this.albumService.findAll();

    const albumsForUpdate = albums.filter(
      (album) => album.artistId === removedArtist.id,
    );

    albumsForUpdate.forEach(async (album) => {
      await this.albumService.update(album.id, { ...album, artistId: null });
    });

    const favArtists = await this.favoritesService.findAllArtists();

    const favArtistsForUpdate = favArtists.filter(
      (artist) => artist.id === removedArtist.id,
    );

    favArtistsForUpdate.forEach(async (artist) => {
      await this.favoritesService.removeArtist(artist.id);
    });

    return removedArtist;
  }
}
