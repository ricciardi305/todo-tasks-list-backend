import { Lists, Tasks } from '@prisma/client'

export class RetrieveUserDto {
    id: number
    email: string
    name: string
    createdAt: Date
    lists: Lists[]
    tasks: Tasks[]
}
