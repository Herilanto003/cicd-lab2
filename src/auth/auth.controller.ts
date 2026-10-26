import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { JwtAuthGuard } from './jwt-auth.guard.js';
import { CurrentUser } from './current-user.decorator.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { UsersService } from '../users/users.service.js';
import type { AuthResponse, AuthUser } from './auth.types.js';
import type { PublicUser } from '../users/users.service.js';

const authResponseSchema = {
  example: {
    accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    user: { id: '3f1c2a1e-...', email: 'john.doe@example.com' },
  },
};

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Crée un utilisateur et retourne un token JWT' })
  @ApiCreatedResponse({
    description: 'Utilisateur créé',
    schema: authResponseSchema,
  })
  register(@Body() dto: RegisterDto): Promise<AuthResponse> {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authentifie un utilisateur et retourne un token JWT' })
  @ApiOkResponse({ description: 'Authentification réussie', schema: authResponseSchema })
  @ApiUnauthorizedResponse({ description: 'Identifiants invalides' })
  login(@Body() dto: LoginDto): Promise<AuthResponse> {
    return this.authService.login(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Retourne l'utilisateur authentifié" })
  @ApiOkResponse({
    description: 'Utilisateur courant',
    schema: {
      example: {
        id: '3f1c2a1e-...',
        email: 'john.doe@example.com',
        createdAt: '2026-01-01T00:00:00.000Z',
      },
    },
  })
  me(@CurrentUser() user: AuthUser): Promise<PublicUser> {
    return this.usersService.getPublicById(user.id);
  }
}
