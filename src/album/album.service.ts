import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { DatabaseService } from 'src/database/database.service';
import { v4 } from 'uuid';
import { Album } from './entities/album.entity';

const DB_KEY = 'albums';

@Injectable()
export class AlbumService {
  constructor(private readonly databaseService: DatabaseService) {}

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
    const isRemoved = await this.databaseService.remove(DB_KEY, id);

    if (!isRemoved) throw new NotFoundException('Album not found');

    return isRemoved;
  }
}
