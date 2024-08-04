import { Injectable } from '@nestjs/common'
import { Lists, Prisma } from '@prisma/client'
import { PrismaService } from '../prisma.service'
import { CreateListDto } from './dtos/create-list.dto'

@Injectable()
export class ListsService {
    constructor(private prisma: PrismaService) {}

    async createList(data: CreateListDto): Promise<Lists> {
        const newList = await this.prisma.lists.create({
            data: {
                title: data.title,
                description: data.description,
                Users: {
                    connect: {
                        id: data.userId,
                    },
                },
            },
        })

        return this.findListById(String(newList.id))
    }

    async findAllLists(): Promise<Lists[]> {
        return this.prisma.lists.findMany({
            include: {
                tasks: true,
                Users: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                _count: {
                    select: {
                        tasks: true,
                    },
                },
            },
        })
    }

    async findListById(id: string): Promise<Lists> {
        return this.prisma.lists.findUnique({
            where: {
                id: Number(id),
            },
            include: {
                tasks: true,
                Users: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                _count: {
                    select: {
                        tasks: true,
                    },
                },
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
