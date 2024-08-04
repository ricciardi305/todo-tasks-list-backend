import { Injectable } from '@nestjs/common'

import { Prisma, Tasks } from '@prisma/client'
import { PrismaService } from '../prisma.service'
import { CreateTaskDto } from './dtos/create-task.dto'

@Injectable()
export class TasksService {
    constructor(private prisma: PrismaService) {}

    async getTask(id: string): Promise<Tasks | null> {
        return this.prisma.tasks.findUnique({
            where: {
                id: Number(id),
            },
        })
    }

    async getAllTasks(): Promise<Tasks[]> {
        return this.prisma.tasks.findMany()
    }

    async getFilteredTasks(query: {
        title?: string
        c?: string // completed = true
        p?: string // completed = false
        id?: string
    }): Promise<Tasks[]> {
        const { title, c, p, id } = query
        const titleFilter = title ? { title: { contains: title } } : {}
        let completedFilter = {}

        if (c !== undefined) {
            completedFilter = { completed: true }
        } else if (p !== undefined) {
            completedFilter = { completed: false }
        }

        const idFilter = id ? { id: Number(id) } : {}

        return this.prisma.tasks.findMany({
            where: {
                AND: [titleFilter, idFilter, completedFilter],
            },
        })
    }

    async createTask(data: CreateTaskDto): Promise<Tasks> {
        const list = await this.prisma.lists
            .findUnique({
                where: {
                    id: data.listId,
                },
            })
            .then((list) => list)
            .catch(() => null)

        const newTask = await this.prisma.tasks.create({
            data: {
                title: data.title,
                Users: {
                    connect: {
                        id: data.userId,
                    },
                },
                completed: false,
            },
        })

        if (list) {
            await this.prisma.tasks.update({
                where: {
                    id: newTask.id,
                },
                data: {
                    Lists: {
                        connect: {
                            id: list.id,
                        },
                    },
                },
            })
        }

        return this.getTask(String(newTask.id))
    }

    async updateTask(params: {
        where: Prisma.TasksWhereUniqueInput
        data: Prisma.TasksUpdateInput
    }): Promise<Tasks> {
        const { where, data } = params
        return this.prisma.tasks.update({
            where,
            data,
        })
    }

    async deleteTask(where: Prisma.TasksWhereUniqueInput) {
        this.prisma.tasks.delete({
            where,
        })
    }
}
