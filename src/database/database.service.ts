import { Injectable } from '@nestjs/common';

@Injectable()
export class DatabaseService {
  private db: Record<string, any[]>;

  async create(key: string, newEntity: any) {
    if (Array.isArray(this.db[key])) {
      this.db[key].push(newEntity);
    } else {
      this.db[key] = [newEntity];
    }

    return newEntity;
  }

  async findAll(key: string) {
    return this.db[key] || [];
  }

  async findOne(key: string, id: string) {
    return this.db[key]?.find((entity) => entity.id === id) || null;
  }

  async findIndex(key: string, id: string) {
    return this.db[key]?.findIndex((entity) => entity.id === id) || -1;
  }

  async update(key: string, id: string, updatedEntity: any) {
    const index = await this.findIndex(key, id);

    if (index !== -1) {
      this.db[key][index] = {
        ...this.db[key][index],
        ...updatedEntity,
      };
    }

    return null;
  }

  async remove(key: string, id: string) {
    const index = await this.findIndex(key, id);

    if (index !== -1) {
      this.db[key].splice(index, 1);
    }

    return null;
  }
}
