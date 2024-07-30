import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
} from '@nestjs/common';
import { Tasks as TasksModel } from '@prisma/client';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get(':id')
  async getTaskById(@Param('id') id: string): Promise<TasksModel> {
    return this.tasksService.getTask({ id: Number(id) });
  }

  @Get()
  async getAllTasks(): Promise<TasksModel[]> {
    return this.tasksService.getAllTasks();
  }

  @Get(':paramsString')
  async getManyTasks(
    @Param('paramsString') paramsString: string,
  ): Promise<TasksModel[]> {
    return this.tasksService.getManyTasks({
      where: {
        OR: [
          { title: { contains: paramsString } },
          { description: { contains: paramsString } },
        ],
      },
    });
  }

  @Post()
  async createTask(
    @Body() postData: { title: string; description: string },
  ): Promise<TasksModel> {
    const { title, description } = postData;
    return this.tasksService.createTask({ title, description });
  }

  @Put(':id')
  async updateTask(
    @Param('id') id: string,
    @Body()
    postData: { title: string; description: string; completed: boolean },
  ): Promise<TasksModel> {
    const { title, description, completed } = postData;
    return this.tasksService.updateTask({
      where: { id: Number(id) },
      data: { title, description, completed },
    });
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: string): Promise<TasksModel> {
    return this.tasksService.deleteTask({ id: Number(id) });
  }

  // @Post()
  // create(@Body() createTaskDto: CreateTaskDto) {
  //     return this.tasksService.create(createTaskDto)
  // }

  // @Get()
  // findAll() {
  //     return this.tasksService.findAll()
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //     return this.tasksService.findOne(+id)
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
  //     return this.tasksService.update(+id, updateTaskDto)
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //     return this.tasksService.remove(+id)
  // }
}
