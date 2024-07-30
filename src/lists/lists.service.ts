import { Injectable } from '@nestjs/common'
import { Lists, Prisma } from '@prisma/client'
import { PrismaService } from '../prisma.service'

@Injectable()
export class ListsService {
    constructor(private prisma: PrismaService) {}

    async createList(data: Prisma.ListsCreateInput): Promise<Lists> {
        return this.prisma.lists.create({ data })
    }

    async findAllLists(): Promise<Lists[]> {
        return this.prisma.lists.findMany({
            include: {
                tasks: true,
                _count: true,
            },
        })
    }

    async findListById(
        listWhereUniqueInput: Prisma.ListsWhereUniqueInput
    ): Promise<Lists> {
        return this.prisma.lists.findUnique({
            where: listWhereUniqueInput,
            include: {
                tasks: true,
                _count: true,
            },
        })
    }

    async updateList(params: {
        where: Prisma.ListsWhereUniqueInput
        data: Prisma.ListsUpdateInput
    }): Promise<Lists> {
        return this.prisma.lists.update({
            where: params.where,
            data: params.data,
        })
    }

    async deleteList(where: Prisma.ListsWhereUniqueInput): Promise<Lists> {
        return this.prisma.lists.delete({
            where,
        })
    }

    async addTaskToList(params: {
        listId: number
        taskId: number
    }): Promise<Lists> {
        return this.prisma.lists.update({
            where: { id: params.listId },
            data: {
                tasks: {
                    connect: {
                        id: params.taskId,
                    },
                },
            },
            include: {
                tasks: true,
            },
        })
    }

    async removeTaskFromList(params: {
        listId: number
        taskId: number
    }): Promise<Lists> {
        return this.prisma.lists.update({
            where: { id: params.listId },
            data: {
                tasks: {
                    disconnect: {
                        id: params.taskId,
                    },
                },
            },
            include: {
                tasks: true,
            },
        })
    }
}
