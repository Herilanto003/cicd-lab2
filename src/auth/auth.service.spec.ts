import { Test } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { AuthService } from './auth.service.js';
import { UsersService } from '../users/users.service.js';

describe('AuthService', () => {
  const usersService = {
    findForAuthByEmail: vi.fn(),
    create: vi.fn(),
    getPublicById: vi.fn(),
  };
  const jwtService = {
    signAsync: vi.fn(),
  };

  let authService: AuthService;

  const user = {
    id: '3f1c2a1e-0000-4000-8000-000000000000',
    email: 'john.doe@example.com',
    createdAt: new Date(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    jwtService.signAsync.mockResolvedValue('signed-token');

    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    authService = moduleRef.get(AuthService);
  });

  it('registers a user with a hashed password and returns a token', async () => {
    usersService.findForAuthByEmail.mockResolvedValue(undefined);
    usersService.create.mockResolvedValue(user);

    const result = await authService.register({
      email: '  John.Doe@Example.com ',
      password: 'motdepasse123',
    });

    expect(usersService.findForAuthByEmail).toHaveBeenCalledWith(
      'john.doe@example.com',
    );
    const [, passwordHash] = usersService.create.mock.calls[0] as [
      string,
      string,
    ];
    expect(passwordHash).not.toBe('motdepasse123');
    expect(await bcrypt.compare('motdepasse123', passwordHash)).toBe(true);
    expect(result).toEqual({
      accessToken: 'signed-token',
      user: { id: user.id, email: user.email },
    });
  });

  it('rejects registration when the email already exists', async () => {
    usersService.findForAuthByEmail.mockResolvedValue({
      ...user,
      passwordHash: 'hash',
    });

    await expect(
      authService.register({
        email: 'john.doe@example.com',
        password: 'motdepasse123',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('logs in with valid credentials', async () => {
    usersService.findForAuthByEmail.mockResolvedValue({
      ...user,
      passwordHash: await bcrypt.hash('motdepasse123', 4),
    });

    const result = await authService.login({
      email: 'john.doe@example.com',
      password: 'motdepasse123',
    });

    expect(result.accessToken).toBe('signed-token');
  });

  it('rejects login with an invalid password', async () => {
    usersService.findForAuthByEmail.mockResolvedValue({
      ...user,
      passwordHash: await bcrypt.hash('motdepasse123', 4),
    });

    await expect(
      authService.login({
        email: 'john.doe@example.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
