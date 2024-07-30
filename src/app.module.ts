import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ListsModule } from './lists/lists.module'
import { TasksModule } from './tasks/tasks.module'
import { UsersModule } from './users/users.module'

@Module({
    imports: [ConfigModule.forRoot(), TasksModule, ListsModule, UsersModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
