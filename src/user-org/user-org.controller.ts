import {
  Inject,
  Controller,
  Get,
  Response as NestResponse,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { UserOrgService } from './user-org.service';
import { UtilityService } from 'lib/utility.service';
import { Response } from 'express';
import { CommonIdDTO } from 'dto/common.id.dto';

@Controller('user-org')
export class UserOrgController {
  @Inject() public utility: UtilityService;
  @Inject() public userOrgService: UserOrgService;

  @Get('tree')
  async roleTreeWithUsers(@NestResponse() response: Response) {
    try {
      const tree = await this.userOrgService.getUserTree();
      return response.status(HttpStatus.OK).json({
        message: 'User Org tree successfully fetched.',
        tree,
      });
    } catch (err) {
      return this.utility.errorResponse(
        response,
        err,
        'User Org tree failed to fetched',
      );
    }
  }
  @Get('parent-list')
  async getUserParentList(
    @NestResponse() response: Response,
    @Query() parameters: CommonIdDTO,
  ) {
    try {
      const parentUserDropdownList =
        await this.userOrgService.findParentUserDropdownList(parameters);
      return response.status(HttpStatus.OK).json({
        message: 'Parent List Successfully fetch.',
        parentUserDropdownList,
      });
    } catch (error) {
      return this.utility.errorResponse(
        response,
        error,
        `'Parent List Failed to fetch.'`,
      );
    }
  }
}
