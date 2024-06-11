import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { PrismaService } from 'lib/prisma.service';
import { EncryptionService } from 'lib/encryption.service';
import { UtilityService } from 'lib/utility.service';
import { AccountController } from './account/account.controller';
import { AuthMiddleware } from 'middleware/auth.middleware';
import { LoggingService } from 'lib/logging.service';
import { TableHandlerService } from 'lib/table.handler/table.handler.service';
import { RoleController } from './role/role.controller';
import { RoleService } from './role/role.service';
import { ScopeController } from './scope/scope.controller';
import { ScopeService } from './scope/scope.service';
import { AccountService } from './account/account.service';
import { RoleGroupController } from './role-group/role-group.controller';
import { RoleGroupService } from './role-group/role-group.service';
import { ProjectController } from './project/project.controller';
import { ProjectService } from './project/project.service';
import { ClientService } from './client/client.service';
import { HasRoleScopeGuard } from 'guards/has-role-scope.guard';
import { UserOrgController } from './user-org/user-org.controller';
import { UserOrgService } from './user-org/user-org.service';
import { BoardLaneController } from './board-lane/board-lane.controller';
import { BoardLaneService } from './board-lane/board-lane.service';
import { SocketModule } from './socket/socket.module';
import { TopicService } from './topic/topic.service';
import { TaskService } from './task/task.service';
import { TaskController } from './task/task.controller';
import { NotificationService } from './notification/notification.service';
import { NotificationController } from './notification/notification.controller';
import { OptionsController } from './warehouse/options.controller';
import { OptionsService } from './warehouse/options.service';
import { WarehouseController } from './warehouse/warehouse.controller';
import { WarehouseService } from './warehouse/warehouse.service';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
    }),
    SocketModule,
  ],
  controllers: [
    AuthController,
    AccountController,
    RoleController,
    ScopeController,
    RoleGroupController,
    ProjectController,
    UserOrgController,
    BoardLaneController,
    TaskController,
    NotificationController,
    OptionsController,
    WarehouseController
  ],
  providers: [
    AuthService,
    PrismaService,
    EncryptionService,
    UtilityService,
    TableHandlerService,
    LoggingService,
    RoleService,
    ScopeService,
    AccountService,
    RoleGroupService,
    ProjectService,
    ClientService,
    HasRoleScopeGuard,
    UserOrgService,
    BoardLaneService,
    TopicService,
    TaskService,
    NotificationService,
    OptionsService,
    WarehouseService
  ],
})
export class AppModule implements NestModule {
  async configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).exclude('auth/(.*)').forRoutes('*');
  }
}
