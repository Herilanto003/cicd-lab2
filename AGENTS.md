# AGENTS.md

## Stack
NestJS 12 (ESM), TypeScript 6, pnpm 12, Vitest (not Jest), oxlint, Prettier.

## Commands
- Install: `pnpm install`
- Dev server: `pnpm start:dev`
- Build: `pnpm build`
- All unit tests: `pnpm test`
- One unit test: `pnpm exec vitest run src/hello/hello.controller.spec.ts`
- All e2e tests: `pnpm test:e2e`
- One e2e test: `pnpm exec vitest run --config ./vitest.config.e2e.ts test/app.e2e-spec.ts`
- Lint: `pnpm lint`
- Format: `pnpm format`

## Critical conventions
- The project is ESM (`"type": "module"`): every relative import must end in `.js`, e.g. `import { HelloService } from './hello.service.js'`.
- With `isolatedModules` + `emitDecoratorMetadata`, types used in decorated signatures must use `import type` (TS1272).
- App-wide setup lives in `src/app.setup.ts`: it sets the global `api` prefix and Swagger. Do not call `setGlobalPrefix` elsewhere.
- All routes are served under `/api` (`GET /api/hello`, `GET /api/health`). Swagger UI is `/api/docs`, JSON is `/api/docs-json`.
- Add features as `src/<feature>/` modules (controller/service/module) and import them in `src/app.module.ts`.
- E2E tests must call `configureApp(app)` before `app.init()`, otherwise tested routes are not prefixed with `/api`.
- Document endpoints with `@ApiTags`, `@ApiOperation`, `@ApiOkResponse`; the Swagger CLI plugin is enabled in `nest-cli.json`.

## Toolchain gotchas
- `pnpm-workspace.yaml` is pnpm 12 config, not a monorepo declaration. Keep `allowBuilds` there; when a new dependency has build scripts, use `pnpm approve-builds` instead of deleting the file.
- `pnpm lint` (`oxlint --type-aware`) currently fails on this Windows machine because AppLocker blocks `tsgolint.exe` (`spawnSync ... UNKNOWN`). This is environmental; do not weaken lint config to work around it. Verify with `pnpm build` + tests instead.

## Agent skills
Project-local NestJS guidance: `.agents/skills/nestjs-best-practices/SKILL.md` (module architecture, DI, security, health checks).
