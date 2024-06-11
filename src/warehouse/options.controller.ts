import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { OptionsService } from './options.service';
import { Response } from 'express';

@Controller('options')
export class OptionsController {
  constructor(private readonly optionsService: OptionsService) {}

  @Get('forklift-systems')
  getForkliftSystems(@Res() response: Response) {
    try {
      const forkliftSystems = this.optionsService.getForkliftSystems();
      return response.status(HttpStatus.OK).json({
        message: 'Forklift systems fetched successfully',
        data: forkliftSystems,
      });
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to fetch forklift systems',
        error: error.message || error,
      });
    }
  }

  @Get('racking-systems')
  getRackingSystems(@Res() response: Response) {
    try {
      const rackingSystems = this.optionsService.getRackingSystems();
      return response.status(HttpStatus.OK).json({
        message: 'Racking systems fetched successfully',
        data: rackingSystems,
      });
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to fetch racking systems',
        error: error.message || error,
      });
    }
  }

  @Get('lightings')
  getLightings(@Res() response: Response) {
    try {
      const lightings = this.optionsService.getLightings();
      return response.status(HttpStatus.OK).json({
        message: 'Lightings fetched successfully',
        data: lightings,
      });
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to fetch lightings',
        error: error.message || error,
      });
    }
  }

  @Get('loading-docks')
  getLoadingDocks(@Res() response: Response) {
    try {
      const loadingDocks = this.optionsService.getLoadingDocks();
      return response.status(HttpStatus.OK).json({
        message: 'Loading docks fetched successfully',
        data: loadingDocks,
      });
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to fetch loading docks',
        error: error.message || error,
      });
    }
  }

  @Get('securities')
  getSecurities(@Res() response: Response) {
    try {
      const securities = this.optionsService.getSecurities();
      return response.status(HttpStatus.OK).json({
        message: 'Securities fetched successfully',
        data: securities,
      });
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to fetch securities',
        error: error.message || error,
      });
    }
  }

  @Get('climate-controls')
  getClimateControls(@Res() response: Response) {
    try {
      const climateControls = this.optionsService.getClimateControls();
      return response.status(HttpStatus.OK).json({
        message: 'Climate controls fetched successfully',
        data: climateControls,
      });
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to fetch climate controls',
        error: error.message || error,
      });
    }
  }

  @Get('accessibilities')
  getAccessibilities(@Res() response: Response) {
    try {
      const accessibilities = this.optionsService.getAccessibilities();
      return response.status(HttpStatus.OK).json({
        message: 'Accessibilities fetched successfully',
        data: accessibilities,
      });
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to fetch accessibilities',
        error: error.message || error,
      });
    }
  }
}
