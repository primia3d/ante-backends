import { Module } from '@nestjs/common';
import { WorkflowStateController } from './workflow-state.controller';
import { WorkflowStateService } from './workflow-state.service';
import { UtilityService } from 'lib/utility.service';
import { PrismaService } from 'lib/prisma.service';
import { TableHandlerService } from 'lib/table.handler/table.handler.service';
import { LoggingService } from 'lib/logging.service';
import { WorkflowService } from '../workflow.service';

@Module({
  controllers: [WorkflowStateController],
  providers: [
    WorkflowStateService,
    UtilityService,
    PrismaService,
    TableHandlerService,
    LoggingService,
    WorkflowService,
  ],
})
export class WorkflowStateModule {}
