import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { v4 } from 'uuid';
import { Artist } from './entities/artist.entity';
import { DatabaseService } from 'src/database/database.service';

const DB_KEY = 'artists';

@Injectable()
export class ArtistService {
  constructor(private readonly databaseService: DatabaseService) {}

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
    const isRemoved = await this.databaseService.remove(DB_KEY, id);

    if (!isRemoved) throw new NotFoundException('Artist not found');

    return isRemoved;
  }
}
