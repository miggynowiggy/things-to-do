import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Task } from './entities/task.entity';
import { EntityRepository, wrap, EntityManager } from '@mikro-orm/mongodb';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: EntityRepository<Task>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    const { content } = createTaskDto;
    const newTask = this.taskRepository.create({ content, isDone: false });
    await this.taskRepository.insert(newTask);
    return newTask;
  }

  async findAll() {
    const all = await this.taskRepository.findAll();
    return all;
  }

  async findOne(id: string) {
    const task = await this.taskRepository.findOne({ id });
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    const task = await this.taskRepository.findOneOrFail({ id });

    if (!task) {
      return null;
    }

    task.content = updateTaskDto.content ?? '';
    task.isDone = updateTaskDto.isDone ?? false;
    wrap(task).assign(updateTaskDto);
    await this.entityManager.flush();

    const updatedTask = await this.taskRepository.findOne({ id });
    return updatedTask;
  }

  async remove(id: string) {
    const task = await this.taskRepository.findOne({ id });

    if (!task) {
      return null;
    }

    await this.taskRepository.nativeDelete({ id });
    return task;
  }
}
