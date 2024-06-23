import { Module } from '@nestjs/common';
import { WorkflowService } from './workflow.service';
import { WorkflowController } from './workflow.controller';
import { UtilityService } from 'lib/utility.service';
import { PrismaService } from 'lib/prisma.service';
import { TableHandlerService } from 'lib/table.handler/table.handler.service';
import { LoggingService } from 'lib/logging.service';

@Module({
  controllers: [WorkflowController],
  providers: [
    WorkflowService,
    UtilityService,
    PrismaService,
    TableHandlerService,
    LoggingService,
  ],
})
export class WorkflowModule {}
