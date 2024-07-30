import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Post,
    Put,
} from '@nestjs/common'
import { Lists as ListsModel } from '@prisma/client'
import { ListsService } from './lists.service'

@Controller()
export class ListsController {
    constructor(private readonly listsService: ListsService) {}

    @Get('lists')
    async getAllLists(): Promise<ListsModel[]> {
        return this.listsService.findAllLists()
    }

    @Get('lists/:id')
    async getListById(@Param('id') id: string): Promise<ListsModel> {
        return this.listsService.findListById({ id: Number(id) })
    }

    @Post('lists')
    async createList(
        @Body() postData: { title: string; description?: string }
    ): Promise<ListsModel> {
        const { title, description } = postData
        return this.listsService.createList({ title, description })
    }

    @Put('lists/:id')
    async updateList(
        @Param('id') id: string,
        @Body() postData: { title: string; description?: string }
    ): Promise<ListsModel> {
        const { title, description } = postData
        return this.listsService.updateList({
            where: { id: Number(id) },
            data: { title, description },
        })
    }

    @Delete('lists/:id')
    @HttpCode(204)
    async deleteList(@Param('id') id: string) {
        this.listsService.deleteList({ id: Number(id) })
    }

    @Put('lists/:id/tasks/:taskId/add')
    async addTaskToList(
        @Param('id') id: string,
        @Param('taskId') taskId: string
    ): Promise<ListsModel> {
        return this.listsService.addTaskToList({
            listId: Number(id),
            taskId: Number(taskId),
        })
    }

    @Put('lists/:id/tasks/:taskId/remove')
    async removeTaskFromList(
        @Param('id') id: string,
        @Param('taskId') taskId: string
    ): Promise<ListsModel> {
        return this.listsService.removeTaskFromList({
            listId: Number(id),
            taskId: Number(taskId),
        })
    }
}
