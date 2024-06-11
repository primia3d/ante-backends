import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class OptionsService {
  private readonly optionsFilePath = path.resolve(process.cwd(), 'data', 'warehouse-options.json');
  private getOptions() {
    const data = fs.readFileSync(this.optionsFilePath, 'utf8');
    return JSON.parse(data);
  }

  getForkliftSystems(): string[] {
    const options = this.getOptions();
    return options.forkliftSystems;
  }

  getRackingSystems(): string[] {
    const options = this.getOptions();
    return options.rackingSystems;
  }

  getLightings(): string[] {
    const options = this.getOptions();
    return options.lightings;
  }

  getLoadingDocks(): string[] {
    const options = this.getOptions();
    return options.loadingDocks;
  }

  getSecurities(): string[] {
    const options = this.getOptions();
    return options.securities;
  }

  getClimateControls(): string[] {
    const options = this.getOptions();
    return options.climateControls;
  }

  getAccessibilities(): string[] {
    const options = this.getOptions();
    return options.accessibilities;
  }
}
