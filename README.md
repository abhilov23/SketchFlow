# SketchFlow

A real-time collaborative whiteboard. Draw together on a shared canvas, with every
shape persisted so a board is exactly where you left it.

Stack: **Next.js 15** (App Router, React 19, Tailwind v4) · **Express 4** REST API ·
**ws** realtime server · **PostgreSQL** via **Prisma** · **Turborepo** monorepo.

---

## Quick start

**Requirements:** Node **≥ 22.18** and pnpm ≥ 9.

> The workspace packages (`@repo/common`, `@repo/db`, `@repo/backend-common`) ship
> compiled `dist/` output that the servers `require()` directly, so anything older
> than Node 22.18 will not boot the backends.

```bash
pnpm install                 # also runs `prisma generate` via postinstall
cp .env.example .env         # then fill in DATABASE_URL and JWT_SECRET
pnpm db:deploy               # apply migrations
pnpm dev                     # runs all three apps via turbo
```

| App              | URL                   |
| ---------------- | --------------------- |
| Web app          | http://localhost:3000 |
| HTTP API         | http://localhost:3005 |
| WebSocket server | ws://localhost:8089   |

Generate a signing secret with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

---

## Environment

All variables live in a single `.env` at the repo root. The backends load it
automatically (via `dotenv`), and the Prisma CLI commands load it through
`dotenv-cli`. Real environment variables always take precedence over the file.

| Variable                   | Required | Default                 | Notes                                                  |
| -------------------------- | -------- | ----------------------- | ------------------------------------------------------ |
| `DATABASE_URL`             | yes      | —                       | Postgres connection string.                            |
| `JWT_SECRET`               | yes      | —                       | **≥ 32 chars.** The servers refuse to start otherwise. |
| `JWT_EXPIRES_IN`           | no       | `7d`                    | Access token lifetime.                                 |
| `BCRYPT_ROUNDS`            | no       | `12`                    | Password hashing cost. Higher is slower and stronger.  |
| `HTTP_BACKEND_PORT`        | no       | `3005`                  |                                                        |
| `WS_BACKEND_PORT`          | no       | `8089`                  |                                                        |
| `PUBLIC_API_ORIGIN`        | prod     | —                       | CORS allowlist. **Required in production.**            |
| `NEXT_PUBLIC_HTTP_BACKEND` | no       | `http://localhost:3005` | Frontend → API.                                        |
| `NEXT_PUBLIC_WS_URL`       | no       | `ws://localhost:8089`   | Frontend → WebSocket.                                  |

---

## Repository layout

```
apps/
  sketchflow-frontend   Next.js app (auth, dashboard, canvas)
  http-backend          Express REST API
  ws-backend            WebSocket realtime server
packages/
  common                Zod schemas shared by client and server
  backend-common        env config, bcrypt helpers, JWT sign/verify
  db                    Prisma client, schema and migrations
  ui                    shared React components
  eslint-config         shared lint configs (base / node / next-js / react-internal)
  typescript-config     shared tsconfigs
```

Shared packages compile to `dist/` and are consumed through their `exports` maps.

---

## Scripts

| Command            | Description                            |
| ------------------ | -------------------------------------- |
| `pnpm dev`         | Run every app in watch mode            |
| `pnpm build`       | Build all packages and apps            |
| `pnpm lint`        | ESLint across all workspaces           |
| `pnpm check-types` | `tsc --noEmit` across all workspaces   |
| `pnpm verify`      | lint + check-types + build             |
| `pnpm format`      | Prettier write                         |
| `pnpm db:generate` | Regenerate the Prisma client           |
| `pnpm db:migrate`  | Create/apply a migration (development) |
| `pnpm db:deploy`   | Apply pending migrations (production)  |
| `pnpm db:studio`   | Prisma Studio                          |

---

## Data model

- **User** — `email` (unique), bcrypt `password`, `name`.
- **Room** — a board. `slug` is unique and appears in the URL. `adminId` is the owner.
- **RoomMember** — join table backing board access. The creator is inserted as a
  member when the board is created; collaborators join via a shared link.
- **Chat** — an **append-only log of drawing events**, one row per add/erase/undo.
  It is not a chat transcript.

> **Known limitation:** because drawing state is an append-only event log, a board's
> history grows forever and `/chats/:roomId` replays all of it on every page load.
> Board load time therefore degrades as a board accumulates activity. Replacing the
> log with a `Shape` table (upsert on add, delete on erase) is the intended fix;
> it is not done yet.

---

## Security notes

- Passwords are hashed with bcrypt (cost 12 by default). The sign-in path performs a
  transparent one-time upgrade for any row still holding a legacy plaintext password.
- Password comparison is always executed against a dummy hash when the account does
  not exist, so response timing does not reveal whether an email is registered.
- Access tokens carry an expiry. There is no default `JWT_SECRET`; a missing or weak
  secret is a startup error rather than a silent fallback.
- `GET /room/:slug`, `GET /chats/:roomId` and `GET /rooms` all require a valid token
  **and** room membership. Board ids are sequential, so membership is enforced
  explicitly rather than relying on unguessable URLs.
- The WebSocket server re-checks room membership on **every** inbound message, so a
  revoked membership takes effect immediately.
- Deleting a board requires ownership (`403` otherwise).
- `/signin` and `/signup` are rate limited per IP (20 requests / 15 minutes).
- Errors return a generic message; stack traces are logged server-side, never sent.

### Before deploying

- [ ] Rotate the database password that was previously committed to `.env` on disk.
- [ ] Set `PUBLIC_API_ORIGIN` so CORS is not left on localhost defaults.
- [ ] Set a strong, unique `JWT_SECRET`.

---

## Contributing

```bash
pnpm install
pnpm verify     # lint + check-types + build — must be clean
pnpm dev
```

CI runs `lint`, `check-types`, `build`, a Prettier check, and a dependency audit on
every push and pull request.
