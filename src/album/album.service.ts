import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { DatabaseService } from 'src/database/database.service';
import { v4 } from 'uuid';
import { Album } from './entities/album.entity';
import { TrackService } from 'src/track/track.service';
import { FavoritesService } from 'src/favorites/favorites.service';

const DB_KEY = 'albums';

@Injectable()
export class AlbumService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly trackService: TrackService,
    private readonly favoritesService: FavoritesService,
  ) {}

  async create(createAlbumDto: CreateAlbumDto) {
    const newAlbum: Album = {
      id: v4(),
      ...createAlbumDto,
    };

    const album = await this.databaseService.create(DB_KEY, newAlbum);

    return new Album(album);
  }

  async findAll() {
    const albums = await this.databaseService.findAll(DB_KEY);

    return albums.map((album) => new Album(album));
  }

  async findOne(id: string) {
    const album = await this.databaseService.findOne(DB_KEY, id);

    if (!album) throw new NotFoundException('Album not found');

    return new Album(album);
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const album = await this.databaseService.findOne(DB_KEY, id);

    if (!album) throw new NotFoundException('Album not found');

    const dataForUpdate = {
      ...album,
      ...updateAlbumDto,
    };

    const updatedAlbum = await this.databaseService.update(
      DB_KEY,
      id,
      dataForUpdate,
    );

    return new Album(updatedAlbum);
  }

  async remove(id: string) {
    const removedAlbum = await this.databaseService.remove(DB_KEY, id);

    if (!removedAlbum) throw new NotFoundException('Album not found');

    const tracks = await this.trackService.findAll();

    const tracksForUpdate = tracks.filter(
      (track) => track.albumId === removedAlbum.id,
    );

    tracksForUpdate.forEach(async (track) => {
      await this.trackService.update(track.id, { ...track, albumId: null });
    });

    const favAlbums = await this.favoritesService.findAllAlbums();

    const favAlbumsForUpdate = favAlbums.filter(
      (album) => album.id === removedAlbum.id,
    );

    favAlbumsForUpdate.forEach(async (album) => {
      await this.favoritesService.removeAlbum(album.id);
    });

    return removedAlbum;
  }
}
