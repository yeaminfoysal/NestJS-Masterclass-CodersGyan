import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class NotesService {
  constructor(private readonly prismaService: PrismaService) { }

  async create(createNoteDto: CreateNoteDto, userId: number) {
    return await this.prismaService.note.create({
      data: {
        title: createNoteDto.title,
        body: createNoteDto.body,
        userId
      }
    });
  }

  findAll({ take, skip }, userId: number) {
    return this.prismaService.note.findMany({
      take,
      skip,
      where: {
        userId
      },
    });
  }

  async findOne(id: number, userId: number) {
    const note = await this.prismaService.note.findUnique({
      where: { id }
    });
    if (!note) {
      throw new NotFoundException('Note not found');
    }
    if (note.userId !== userId) {
      throw new ForbiddenException('Not allowed to access this note');
    }
    return note;
  }

  async update(id: number, updateNoteDto: UpdateNoteDto, userId: number) {
    const note = await this.prismaService.note.findUnique({
      where: { id }
    });
    if (!note) {
      throw new NotFoundException('Note not found');
    }
    if (note.userId !== userId) {
      throw new ForbiddenException('Not allowed to update this note');
    }
    return await this.prismaService.note.update({
      where: { id },
      data: updateNoteDto
    });
  }

  async remove(id: number, userId: number) {
    try {
      const note = await this.prismaService.note.findFirst({
        where: { id, userId },
      });

      if (!note) {
        throw new NotFoundException('Note not found');
      }

      return await this.prismaService.note.delete({
        where: { id },
      });

    } catch (error) {
      throw error;
    }
  }
}
