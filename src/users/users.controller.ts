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

    @Get('users/:email')
    async findUserByEmail(
        @Param('email') email: string
    ): Promise<RetrieveUserDto> {
        return this.usersService.findUserByEmail(email)
    }

    @Put('users/:id')
    async updateUser(
        @Param('id') id: string,
        @Body() data
    ): Promise<RetrieveUserDto> {
        return this.usersService.updateUser(id, data)
    }

    @Put('users/:id/password')
    async updatePassword(
        @Param('id') id: string,
        @Body() data
    ): Promise<RetrieveUserDto> {
        return this.usersService.updatePassword(id, data.password)
    }

    @Delete('users/:id')
    @HttpCode(204)
    async deleteUser(@Param('id') id: string) {
        this.usersService.deleteUser(id)
    }
}
