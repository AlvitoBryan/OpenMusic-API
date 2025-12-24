# OpenMusic Consumer

RabbitMQ Worker untuk memproses ekspor playlist dan mengirim email.

## Fitur

- Consumer RabbitMQ untuk queue `export:playlists`
- Mengambil data playlist dari database
- Mengirim email dengan attachment JSON

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

# RabbitMQ
RABBITMQ_SERVER=amqp://localhost

# SMTP
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_smtp_user
SMTP_PASSWORD=your_smtp_password
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

## Cara Kerja

1. Consumer mendengarkan queue `export:playlists` di RabbitMQ
2. Saat menerima pesan, consumer:
   - Parse JSON payload: `{ playlistId, targetEmail }`
   - Query database untuk mengambil playlist dan lagu-lagunya
   - Format data menjadi JSON
   - Kirim email dengan attachment JSON ke `targetEmail`
3. Message di-ack setelah email berhasil dikirim

## Catatan

- Consumer menggunakan database yang sama dengan API
- Pastikan RabbitMQ server berjalan sebelum menjalankan consumer
- Error akan di-log dan message tidak di-ack agar bisa dicoba ulang

