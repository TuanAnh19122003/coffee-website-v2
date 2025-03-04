import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateSpecialDto } from './dto/create-special.dto';
import { UpdateSpecialDto } from './dto/update-special.dto';
import { Special } from 'src/database/entities/special.entity';

@Injectable()
export class SpecialsService {
  constructor(
    @Inject('SPECIAL_REPOSITORY')
    private readonly specialRepository: Repository<Special>,
  ) {}

  async findAll() {
    return await this.specialRepository.find();
  }

  async create(createSpecialDto: CreateSpecialDto): Promise<Special> {
    const special = this.specialRepository.create(createSpecialDto)
    return await this.specialRepository.save(special);
  }


  async findOne(id: number): Promise<Special> {
    const special = await this.specialRepository.findOne({ where: { id } });
    if (!special) {
      throw new NotFoundException(`Special with ID ${id} not found`);
    }
    return special;
  }

  async update(id: number, updateSpecialDto: UpdateSpecialDto): Promise<Special> {
    const special = await this.findOne(id);
    if (!special) {
      throw new NotFoundException(`Special with ID ${id} not found`);
    }
    Object.assign(special, updateSpecialDto);
    return await this.specialRepository.save(special);
  }

  async remove(id: number): Promise<void> {
    await this.specialRepository.delete(id);
  }
}
