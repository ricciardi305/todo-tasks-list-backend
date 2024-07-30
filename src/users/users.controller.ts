import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { RetrieveUserDto } from './dto/retrieve-user.dto'
import { UsersService } from './users.service'

@Controller()
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('users')
    async createUser(@Body() data): Promise<RetrieveUserDto> {
        return this.usersService.createUser(data)
    }

    @Get('users/:id')
    async findUser(@Param('id') id: string): Promise<RetrieveUserDto> {
        return this.usersService.findUser(id)
    }
}
