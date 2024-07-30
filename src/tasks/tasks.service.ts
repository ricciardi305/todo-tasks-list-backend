import { Injectable } from '@nestjs/common'

import { Prisma, Tasks } from '@prisma/client'
import { PrismaService } from '../prisma.service'

@Injectable()
export class TasksService {
    constructor(private prisma: PrismaService) {}

    async getTask(
        taskWhereUniqueInput: Prisma.TasksWhereUniqueInput
    ): Promise<Tasks | null> {
        return this.prisma.tasks.findUnique({
            where: taskWhereUniqueInput,
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

    async createTask(data: Prisma.TasksCreateInput): Promise<Tasks> {
        return this.prisma.tasks.create({
            data,
        })
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

    async deleteTask(where: Prisma.TasksWhereUniqueInput): Promise<Tasks> {
        return this.prisma.tasks.delete({
            where,
        })
    }

    // create(createTaskDto: CreateTaskDto) {
    //   return 'This action adds a new task';
    // }

    // findAll() {
    //   return `This action returns all tasks`;
    // }

    // findOne(id: number) {
    //   return `This action returns a #${id} task`;
    // }

    // update(id: number, updateTaskDto: UpdateTaskDto) {
    //   return `This action updates a #${id} task`;
    // }

    // remove(id: number) {
    //   return `This action removes a #${id} task`;
    // }
}
