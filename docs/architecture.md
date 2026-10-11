# SketchFlow — System Design

## 1. Container view

```mermaid
flowchart LR
  Browser["Browser<br/><small>Next.js 15 · React 19 · Tailwind v4</small>"]

  subgraph Node["Node processes (Node >= 22.18)"]
    Frontend["sketchflow-frontend<br/><small>:3000 · App Router</small>"]
    Api["http-backend<br/><small>:3005 · Express 4</small>"]
    Ws["ws-backend<br/><small>:8089 · ws</small>"]
  end

  DB[("PostgreSQL<br/><small>Prisma 6.5 · Neon</small>")]

  Browser -->|"HTTPS · Bearer JWT"| Api
  Browser <-->|"WSS · ?token=…"| Ws
  Api -->|"Prisma"| DB
  Ws -->|"Prisma"| DB

  Frontend -.->|"@repo/common<br/>zod schemas"| Api
  Api -.->|"@repo/db · @repo/backend-common"| DB

  classDef web fill:#7c3aed,stroke:#5b21b6,color:#fff
  classDef svc fill:#ffffff,stroke:#d9d4e2,color:#211f2b
  classDef data fill:#211f2b,stroke:#211f2b,color:#fff
  class Browser,Frontend web
  class Api,Ws svc
  class DB data
```

## 2. Shared packages

```mermaid
flowchart TB
  subgraph pkgs["packages/ — private, compiled to dist/"]
    Common["@repo/common<br/><small>Zod schemas</small>"]
    BackendCommon["@repo/backend-common<br/><small>env · bcrypt · JWT</small>"]
    Db["@repo/db<br/><small>Prisma client</small>"]
    Eslint["@repo/eslint-config"]
    Tsconfig["@repo/typescript-config"]
  end

  Frontend["sketchflow-frontend"] --> Common
  Api["http-backend"] --> Common
  Api --> BackendCommon
  Ws["ws-backend"] --> BackendCommon
  Api --> Db
  Ws --> Db
  Db --> BackendCommon

  Frontend --> Tsconfig
  Frontend --> Eslint
  Api --> Eslint
  Ws --> Eslint
```

## 3. Authentication sequence

```mermaid
sequenceDiagram
  autonumber
  participant U as User
  participant F as Frontend
  participant A as http-backend
  participant D as PostgreSQL

  U->>F: Submit sign-in form
  F->>F: Zod validate (shared schema)
  F->>A: POST /signin
  A->>A: Rate limit (20 / 15 min / IP)
  A->>D: SELECT user BY email
  D-->>A: user + password hash
  A->>A: bcrypt.compare against hash<br/>(dummy hash if no user)
  opt Legacy plaintext row
    A->>D: UPDATE re-hash password
  end
  A-->>F: 200 { token } (signed, expires)
  F->>F: localStorage.token

  Note over F: Bearer auth on every later call
  F->>A: GET /rooms  (Authorization: Bearer …)
  A->>A: verify signature + exp
  A-->>F: 200 { room: [...] }
```

## 4. Board authorization

```mermaid
flowchart TB
  Req["GET /room/:slug<br/>or GET /chats/:roomId"] --> Token{"Bearer token<br/>valid + unexpired?"}
  Token -->|no| E401["401"]
  Token -->|yes| Member{"RoomMember row<br/>exists for userId?"}
  Member -->|no| E404["404<br/><small>does not confirm existence</small>"]
  Member -->|yes| Ok["200 data"]

  style E401 fill:#fee2e2,stroke:#dc2626,color:#991b1b
  style E404 fill:#fee2e2,stroke:#dc2626,color:#991b1b
  style Ok fill:#dcfce7,stroke:#16a34a,color:#166534
```

## 5. Data model

```mermaid
erDiagram
  User ||--o{ Room : "owns"
  User ||--o{ RoomMember : "joins"
  Room ||--o{ RoomMember : "has"
  Room ||--o{ Chat : "event log"
  User ||--o{ Chat : "authored"

  User {
    string id PK
    string email UK
    string password "bcrypt hash"
    string name
  }
  Room {
    int id PK
    string slug UK
    datetime createdAt
    string adminId FK
  }
  RoomMember {
    int roomId PK,FK
    string userId PK,FK
    datetime joinedAt
  }
  Chat {
    int id PK
    int roomId FK
    string message "JSON drawing event"
    string userId FK
  }
```

## 6. Realtime event flow

```mermaid
sequenceDiagram
  autonumber
  participant A as Client A
  participant W as ws-backend
  participant D as PostgreSQL
  participant B as Client B

  A->>W: connect ?token=…
  W->>W: verify JWT → reject 1008 if invalid
  A->>W: { type: "join_room", roomId }
  W->>D: SELECT RoomMember (must exist)

  Note over A: User draws a shape
  A->>W: { type: "chat", roomId, message: { shape } }
  W->>D: re-check membership on EVERY message
  W->>D: INSERT INTO Chat
  W-->>B: broadcast to room subscribers
  W-->>A: broadcast

  loop every 30s
    W->>W: ping / terminate half-open sockets
  end
```

## 7. Request lifecycle on a board load

```mermaid
flowchart LR
  S["/canvas/:slug"] --> T{"token in<br/>localStorage?"}
  T -->|no| Sign["Redirect /signin"]
  T -->|yes| L["GET /room/:slug"]
  L -->|"404 → not a member"| J["POST /room/:slug/join"]
  L -->|"200 → member"| R["GET /chats/:roomId"]
  J --> R
  R -->|"404"| Err["Not found / no access"]
  R -->|"200 messages"| Hydrate["Replay event log<br/>rebuild shape array"]
  Hydrate --> C["Canvas mounts"]
  C --> WS["WebSocket connects<br/>join_room"]
```
