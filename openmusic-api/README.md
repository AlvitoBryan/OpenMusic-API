# OpenMusic API

HTTP Server untuk OpenMusic API dengan fitur Producer untuk RabbitMQ.

## Fitur

- RESTful API untuk Albums, Songs, Users, Authentications, Playlists
- Upload cover album (Multer)
- Likes dengan Redis caching
- Export playlist via RabbitMQ (Producer)

## Instalasi

```bash
npm install
```

## Konfigurasi

Copy `.env.example` ke `.env` dan isi dengan konfigurasi yang sesuai:

```env
# Database
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=your_password
PGDATABASE=openmusic_db

# Server
HOST=localhost
PORT=5000

# JWT
ACCESS_TOKEN_KEY=your_access_token_key
REFRESH_TOKEN_KEY=your_refresh_token_key
ACCESS_TOKEN_AGE=30m

# Redis
REDIS_SERVER=redis://localhost:6379

# RabbitMQ
RABBITMQ_SERVER=amqp://localhost
```

## Migrasi Database

```bash
npm run migrate -- up
```

## Menjalankan

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

## Endpoints

- `POST /users` - Register user
- `POST /authentications` - Login
- `PUT /authentications` - Refresh token
- `DELETE /authentications` - Logout
- `GET /albums/:id` - Get album detail
- `POST /albums/:id/covers` - Upload cover
- `GET /albums/:id/likes` - Get likes count (public)
- `POST /albums/:id/likes` - Like album (auth required)
- `DELETE /albums/:id/likes` - Unlike album (auth required)
- `POST /export/playlists/:id` - Export playlist (auth required)

## Catatan

- API ini berfungsi sebagai **Producer** yang mengirim pesan ke RabbitMQ
- Consumer terpisah di project `openmusic-consumer` yang memproses pesan dan mengirim email

