import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Post,
    Put,
    Query,
} from '@nestjs/common'
import { Tasks as TasksModel } from '@prisma/client'
import { TasksService } from './tasks.service'

@Controller()
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @Get('tasks/:id')
    async getTaskById(@Param('id') id: string): Promise<TasksModel> {
        return this.tasksService.getTask(id)
    }

    @Get('tasks')
    async getAllTasks(): Promise<TasksModel[]> {
        return this.tasksService.getAllTasks()
    }

    @Get('filtered-tasks')
    async getManyTasks(@Query() query): Promise<TasksModel[]> {
        return this.tasksService.getFilteredTasks(query)
    }

    @Post('tasks')
    async createTask(
        @Body() postData: { title: string; userId: number; listId?: number }
    ): Promise<TasksModel> {
        const { title, userId, listId } = postData
        return this.tasksService.createTask({ title, userId, listId })
    }

    @Put('tasks/:id')
    async updateTask(
        @Param('id') id: string,
        @Body()
        postData: { title: string; completed: boolean }
    ): Promise<TasksModel> {
        const { title, completed } = postData
        return this.tasksService.updateTask({
            where: { id: Number(id) },
            data: { title, completed },
        })
    }

    @Delete('tasks/:id')
    @HttpCode(204)
    async deleteTask(@Param('id') id: string) {
        this.tasksService.deleteTask({ id: Number(id) })
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
