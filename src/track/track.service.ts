import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { DatabaseService } from 'src/database/database.service';
import { v4 } from 'uuid';
import { FavoritesService } from 'src/favorites/favorites.service';

const DB_KEY = 'tracks';

@Injectable()
export class TrackService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly favoritesService: FavoritesService,
  ) {}

  async create(createTrackDto: CreateTrackDto) {
    const newTrack: Track = {
      id: v4(),
      ...createTrackDto,
    };

    const track = await this.databaseService.create(DB_KEY, newTrack);

    return new Track(track);
  }

  async findAll() {
    const tracks = await this.databaseService.findAll(DB_KEY);

    return tracks.map((track) => new Track(track));
  }

  async findOne(id: string) {
    const track = await this.databaseService.findOne(DB_KEY, id);

    if (!track) throw new NotFoundException('Track not found');

    return new Track(track);
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    const track = await this.databaseService.findOne(DB_KEY, id);

    if (!track) throw new NotFoundException('Track not found');

    const dataForUpdate = {
      ...track,
      ...updateTrackDto,
    };

    const updatedTrack = await this.databaseService.update(
      DB_KEY,
      id,
      dataForUpdate,
    );

    return new Track(updatedTrack);
  }

  async remove(id: string) {
    const removedTrack = await this.databaseService.remove(DB_KEY, id);

    if (!removedTrack) throw new NotFoundException('Track not found');

    const favTracks = await this.favoritesService.findAllTracks();

    const favTracksForUpdate = favTracks.filter(
      (track) => track.id === removedTrack.id,
    );

    favTracksForUpdate.forEach(async (track) => {
      await this.favoritesService.removeTrack(track.id);
    });

    return removedTrack;
  }
}
