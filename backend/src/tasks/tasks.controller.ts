import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Task } from './entities/task.entity';
import EntityNotFoundException from 'src/exceptions/EntityNotFound';

@ApiTags('task')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiOperation({ summary: 'Get all task' })
  @ApiResponse({
    status: 200,
    description: 'List of tasks',
    type: Task,
    isArray: true,
  })
  findAll() {
    return this.tasksService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a single task based on ID' })
  @ApiParam({
    name: 'id',
    description: 'ID of the task',
    required: true,
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Task that is looked up',
    type: Task,
  })
  @ApiResponse({
    status: 404,
    description: 'Task is not found',
  })
  async findOne(@Param('id') id: string) {
    const task = await this.tasksService.findOne(id);
    if (!task) {
      throw new EntityNotFoundException();
    }
    return task;
  }

  @Post()
  @ApiOperation({ summary: 'Creates a task' })
  @ApiBody({ required: true, description: 'payload', type: CreateTaskDto })
  @ApiResponse({ status: 200, description: 'Created task', type: Task })
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update contents of a task based on ID' })
  @ApiBody({ type: UpdateTaskDto, required: true })
  @ApiResponse({ status: 200, description: 'The updated task', type: Task })
  @ApiResponse({ status: 404, description: 'Task is not found' })
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    const updatedTask = await this.tasksService.update(id, updateTaskDto);
    if (!updatedTask) {
      throw new EntityNotFoundException();
    }
    return updatedTask;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task based on ID' })
  @ApiResponse({
    status: 200,
    type: Task,
    description: 'return details of the task that was deleted',
  })
  @ApiResponse({ status: 404, description: 'Task is not found' })
  async remove(@Param('id') id: string) {
    const task = await this.tasksService.remove(id);
    if (!task) {
      throw new EntityNotFoundException();
    }
    return task;
  }
}
