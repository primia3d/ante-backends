import {
  Inject,
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  Headers,
  Ip,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AccountCreateDTO } from 'dto/account.create.dto';
import { AccountLoginDTO } from 'dto/account.login.dto';
import { UtilityService } from 'lib/utility.service';

@Controller('auth')
export class AuthController {
  @Inject() public authService: AuthService;
  @Inject() public utility: UtilityService;

  @Post('login')
  async login(
    @Res() response,
    @Body() params: AccountLoginDTO,
    @Headers() headers,
    @Ip() ip,
  ) {
    try {
      const serviceResponse = await this.authService.login(params, headers, ip);
      const token = serviceResponse['token'];
      delete serviceResponse['token'];
      return response.status(HttpStatus.OK).json({
        message: 'Account Successfully Signed In',
        accountInformation: serviceResponse,
        token,
      });
    } catch (err) {
      return this.utility.errorResponse(
        response,
        err,
        'Account sign-in error.',
      );
    }
  }

  @Post('registration')
  async registration(@Res() response, @Body() params: AccountCreateDTO) {
    try {
      const serviceResponse = await this.authService.createAccount(params);
      return response.status(HttpStatus.CREATED).json({
        message: 'Account Successfully Created',
        accountInformation: serviceResponse,
      });
    } catch (err) {
      return this.utility.errorResponse(
        response,
        err,
        'Account creation error.',
      );
    }
  }
}
