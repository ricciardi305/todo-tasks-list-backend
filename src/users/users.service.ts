import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { genSaltSync, hashSync } from 'bcrypt'
import { PrismaService } from './../prisma.service'
import { RetrieveUserDto } from './dto/retrieve-user.dto'

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async createUser(data: Prisma.UsersCreateInput): Promise<RetrieveUserDto> {
        const { password } = data

        const salt = genSaltSync(10)
        const hash = hashSync(password, salt)

        const createdUser = await this.prisma.users.create({
            data: {
                ...data,
                password: hash,
                lists: {
                    create: {
                        title: 'Minha lista de tarefas',
                    },
                },
            },
        })

        return this.findUser(String(createdUser.id))
    }

    async getAllUsers(): Promise<RetrieveUserDto[]> {
        return this.prisma.users.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                lists: true,
                tasks: true,
            },
        })
    }

    async findUser(id: string): Promise<RetrieveUserDto> {
        return this.prisma.users.findUnique({
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                lists: true,
                tasks: true,
            },
            where: {
                id: Number(id),
            },
        })
    }

    async findUserByEmail(email: string): Promise<RetrieveUserDto> {
        return this.prisma.users.findUnique({
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                lists: true,
                tasks: true,
            },
            where: {
                email: email,
            },
        })
    }

    async updateUser(id: string, data: Prisma.UsersUpdateInput) {
        this.prisma.users.update({
            data: {
                email: data.email,
                name: data.name,
            },
            where: {
                id: Number(id),
            },
        })

        return this.findUser(id)
    }

    async updatePassword(id: string, password: string) {
        const salt = genSaltSync(10)
        const hash = hashSync(password, salt)

        this.prisma.users.update({
            data: {
                password: hash,
            },
            where: {
                id: Number(id),
            },
        })

        return this.findUser(id)
    }

    async deleteUser(id: string) {
        return this.prisma.users.delete({
            where: {
                id: Number(id),
            },
        })
    }
}
