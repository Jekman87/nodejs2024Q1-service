import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { ApiTags } from '@nestjs/swagger';
import { TrackService } from 'src/track/track.service';
import { AlbumService } from 'src/album/album.service';
import { ArtistService } from 'src/artist/artist.service';

@ApiTags('Favorites')
@Controller('favs')
export class FavoritesController {
  constructor(
    private readonly favoritesService: FavoritesService,
    private readonly trackService: TrackService,
    private readonly albumService: AlbumService,
    private readonly artistService: ArtistService,
  ) {}

  @Get()
  async findAll() {
    return this.favoritesService.findAll();
  }

  @Post('track/:id')
  async addTrack(@Param('id', new ParseUUIDPipe()) id: string) {
    try {
      const track = await this.trackService.findOne(id);

      return this.favoritesService.addTrack(track);
    } catch {
      throw new UnprocessableEntityException('Track not found');
    }
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeTrack(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.favoritesService.removeTrack(id);
  }

  @Post('album/:id')
  async addAlbum(@Param('id', new ParseUUIDPipe()) id: string) {
    try {
      const album = await this.albumService.findOne(id);

      return this.favoritesService.addAlbum(album);
    } catch {
      throw new UnprocessableEntityException('Album not found');
    }
  }

  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAlbum(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.favoritesService.removeAlbum(id);
  }

  @Post('artist/:id')
  async addArtist(@Param('id', new ParseUUIDPipe()) id: string) {
    try {
      const artist = await this.artistService.findOne(id);

      return this.favoritesService.addArtist(artist);
    } catch {
      throw new UnprocessableEntityException('Artist not found');
    }
  }

  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeArtist(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.favoritesService.removeArtist(id);
  }
}
