# SketchFlow

A real-time collaborative whiteboard. Draw together on a shared canvas, with every
shape persisted so a board is exactly where you left it.

Stack: **Next.js 15** (App Router, React 19, Tailwind v4) · **Express 4** REST API ·
**ws** realtime server · **PostgreSQL** via **Prisma** · **Turborepo** monorepo · **pnpm**.

![SketchFlow system design](docs/architecture.png)

> Full interactive diagrams — container view, auth sequence, authorization
> decision tree, ER model, and realtime event flow — are in
> [docs/architecture.md](docs/architecture.md).

---

## Quick start

Requires **Node >= 22.18** and **pnpm >= 9**.

> The shared packages (`@repo/common`, `@repo/db`, `@repo/backend-common`) compile to
> `dist/` and are loaded directly by the servers through their `exports` maps, so
> older Node releases cannot boot the backends.

```bash
pnpm install        # also runs `prisma generate`
cp .env.example .env
pnpm db:deploy      # apply migrations
pnpm dev            # runs all three apps via turbo
```

| App              | URL                   |
| ---------------- | --------------------- |
| Web app          | http://localhost:3000 |
| HTTP API         | http://localhost:3005 |
| WebSocket server | ws://localhost:8089   |

Generate a signing secret:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

---

## Environment

All variables live in a single `.env` at the repo root. The backends load it with
`dotenv`; the Prisma CLI commands load it through `dotenv-cli`. Real environment
variables always take precedence over the file.

| Variable                   | Required | Default                 | Notes                                     |
| -------------------------- | -------- | ----------------------- | ----------------------------------------- |
| `DATABASE_URL`             | yes      | —                       | Postgres connection string.               |
| `JWT_SECRET`               | yes      | —                       | **>= 32 chars.** Startup fails otherwise. |
| `JWT_EXPIRES_IN`           | no       | `7d`                    | Access token lifetime.                    |
| `BCRYPT_ROUNDS`            | no       | `12`                    | Password hashing cost.                    |
| `HTTP_BACKEND_PORT`        | no       | `3005`                  |                                           |
| `WS_BACKEND_PORT`          | no       | `8089`                  |                                           |
| `PUBLIC_API_ORIGIN`        | prod     | —                       | CORS allowlist. Required in production.   |
| `NEXT_PUBLIC_HTTP_BACKEND` | no       | `http://localhost:3005` | Web app -> API.                           |
| `NEXT_PUBLIC_WS_URL`       | no       | `ws://localhost:8089`   | Web app -> WebSocket.                     |

---

## Repository layout

```
apps/
  sketchflow-frontend   Next.js app: auth, dashboard, canvas
  http-backend          Express REST API
  ws-backend            WebSocket realtime server
packages/
  common                Zod schemas shared by client and server
  backend-common        env loading, bcrypt helpers, JWT sign/verify
  db                    Prisma client, schema, migrations
  eslint-config         shared lint configs (base / node / next-js / react-internal)
  typescript-config     shared tsconfigs
```

Every package is `private` and compiled to `dist/`. `turbo` builds dependencies
before dependents, and `dev` depends on `^build` so shared packages are always current.

---

## HTTP API

`http-backend` is the only process that touches the database. Every route except
signup and signin requires `Authorization: Bearer <token>`.

| Method   | Route              | Access        | Purpose                                  |
| -------- | ------------------ | ------------- | ---------------------------------------- |
| `POST`   | `/signup`          | public        | Create account, bcrypt-hash the password |
| `POST`   | `/signin`          | public        | Verify credentials, issue a JWT          |
| `POST`   | `/room`            | authenticated | Create a board; creator becomes a member |
| `GET`    | `/rooms`           | authenticated | Boards you are a member of               |
| `GET`    | `/room/:slug`      | member        | Board metadata and `isOwner`             |
| `POST`   | `/room/:slug/join` | authenticated | Join via a shared link (idempotent)      |
| `DELETE` | `/room/:slug`      | **owner**     | Delete board; chats and members cascade  |
| `GET`    | `/chats/:roomId`   | member        | Replay the drawing event log             |

Status codes: `400` invalid input, `401` missing/invalid/expired token, `403`
authenticated but not the owner, `404` not found or not a member, `409` name taken.

---

## Data model

- **User** — `email` (unique), bcrypt `password`, `name`.
- **Room** — a board. `slug` is unique and appears in the URL. `adminId` is the owner.
- **RoomMember** — join table backing board access. The creator is inserted as a
  member when the board is created; collaborators join through a shared link.
- **Chat** — an **append-only log of drawing events**, one row per add/erase/undo.
  Despite the name it is not a chat transcript.

> **Known limitation.** Because drawing state is an append-only event log, a board's
> history grows without bound and `GET /chats/:roomId` replays all of it on every
> page load, so load time degrades as a board accumulates activity. Replacing the log
> with a `Shape` table (upsert on add, delete on erase) is the intended fix; it is
> not done yet.

---

## Canvas

A single imperative Canvas 2D engine in `app/draw/index.ts`, driven from React
through the `DrawInstance` handle. Tools: pencil, line, rectangle, circle, diamond,
text, eraser. Plus undo, PNG export, theme toggle, and pan/zoom.

Pan with <kbd>Space</kbd>-drag, middle-drag, or <kbd>Shift</kbd>-drag. Zoom with
<kbd>Ctrl</kbd>-scroll or the toolbar buttons.

The toolbar wraps to a second row on narrow viewports rather than overflowing, and
the Share button copies the board URL with a clipboard fallback for non-secure
origins, confirming success or failure inline.

---

## Security

- Passwords are hashed with bcrypt (cost 12 by default). The sign-in path performs a
  transparent one-time upgrade for any row still holding a legacy plaintext password.
- Password verification always runs against a dummy hash when the account does not
  exist, so response timing does not reveal whether an email is registered.
- Access tokens carry an expiry. There is no default `JWT_SECRET`: a missing or weak
  secret is a startup error, not a silent fallback.
- Board reads require a valid token **and** membership. Board ids are sequential, so
  membership is enforced explicitly rather than relying on unguessable URLs.
- The WebSocket server re-checks room membership on **every** inbound message, so a
  revoked membership takes effect immediately instead of on the next reconnect.
- Deleting a board requires ownership.
- `/signin` and `/signup` are rate limited per IP (20 requests / 15 minutes) and
  malformed WebSocket frames are dropped without killing the socket.
- Errors return a generic message. Stack traces are logged server-side, never sent.

### Before deploying

- [ ] Rotate the database password that previously sat in plaintext on disk.
- [ ] Set `PUBLIC_API_ORIGIN` so CORS is not left on localhost defaults.
- [ ] Set a strong, unique `JWT_SECRET`.

---

## Scripts

| Command             | Description                           |
| ------------------- | ------------------------------------- |
| `pnpm dev`          | Run every app in watch mode           |
| `pnpm build`        | Build all packages and apps           |
| `pnpm lint`         | ESLint across every workspace         |
| `pnpm check-types`  | `tsc --noEmit` across every workspace |
| `pnpm verify`       | lint + check-types + build            |
| `pnpm format`       | Prettier write                        |
| `pnpm format:check` | Prettier check (used in CI)           |
| `pnpm db:generate`  | Regenerate the Prisma client          |
| `pnpm db:migrate`   | Create and apply a migration (dev)    |
| `pnpm db:deploy`    | Apply pending migrations (production) |
| `pnpm db:studio`    | Prisma Studio                         |

---

## Contributing

```bash
pnpm install
pnpm verify        # must be clean
pnpm dev
```

CI runs `lint`, `check-types`, `build`, a Prettier check, and a dependency audit on
every push and pull request. There is no test suite yet; changes to auth, board
authorization, or the drawing engine should be verified manually against a running
stack before merging.
