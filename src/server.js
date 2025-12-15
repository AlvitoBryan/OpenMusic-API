const express = require('express');
const dotenv = require('dotenv');
const AlbumsService = require('./services/albumService');
const SongsService = require('./services/songService');
const AlbumsHandler = require('./api/albums/handler');
const SongsHandler = require('./api/songs/handler');
const createAlbumRoutes = require('./api/albums/routes');
const createSongRoutes = require('./api/songs/routes');
const { ClientError } = require('./utils/errors');

dotenv.config();

const app = express();

app.use(express.json());

const albumsService = new AlbumsService();
const songsService = new SongsService();

const albumsHandler = new AlbumsHandler(albumsService);
const songsHandler = new SongsHandler(songsService);

app.use(createAlbumRoutes(albumsHandler));
app.use(createSongRoutes(songsHandler));

app.use((req, res) => {
  res.status(404).json({
    status: 'fail',
    message: 'Resource tidak ditemukan',
  });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err instanceof ClientError) {
    return res.status(err.statusCode).json({
      status: 'fail',
      message: err.message,
    });
  }

  // Log hanya untuk kebutuhan debugging.
  console.error(err);

  return res.status(500).json({
    status: 'error',
    message: 'Maaf, terjadi kegagalan pada server kami.',
  });
});

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 5000;

app.listen(PORT, HOST, () => {
  console.log(`Server berjalan pada http://${HOST}:${PORT}`);
});

