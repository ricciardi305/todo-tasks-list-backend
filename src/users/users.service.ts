import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { hash } from 'bcrypt'
import { PrismaService } from './../prisma.service'
import { RetrieveUserDto } from './dto/retrieve-user.dto'

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async createUser(data: Prisma.UsersCreateInput): Promise<RetrieveUserDto> {
        const { password } = data

        hash(password, 10, (err, hash) => {
            if (err) throw err
            data.password = hash
        })

        const createdUser = await this.prisma.users.create({
            data,
        })

        return this.findUser(String(createdUser.id))
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
}
