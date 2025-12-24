const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const AlbumsService = require('./services/albumService');
const SongsService = require('./services/songService');
const UsersService = require('./services/usersService');
const AuthenticationsService = require('./services/authenticationsService');
const PlaylistsService = require('./services/playlistsService');
const CacheService = require('./services/redis/CacheService');
const LikesService = require('./services/likesService');
const AlbumsHandler = require('./api/albums/handler');
const SongsHandler = require('./api/songs/handler');
const UsersHandler = require('./api/users/handler');
const AuthenticationsHandler = require('./api/authentications/handler');
const PlaylistsHandler = require('./api/playlists/handler');
const UploadsHandler = require('./api/uploads/handler');
const ExportsHandler = require('./api/exports/handler');
const LikesHandler = require('./api/likes/handler');
const createAlbumRoutes = require('./api/albums/routes');
const createSongRoutes = require('./api/songs/routes');
const createUserRoutes = require('./api/users/routes');
const createAuthenticationRoutes = require('./api/authentications/routes');
const createPlaylistRoutes = require('./api/playlists/routes');
const createUploadRoutes = require('./api/uploads/routes');
const createExportRoutes = require('./api/exports/routes');
const createLikesRoutes = require('./api/likes/routes');
const createAuthenticationMiddleware = require('./middlewares/authenticate');
const TokenManager = require('./utils/tokenManager');
const { ClientError } = require('./utils/errors');

dotenv.config();

const app = express();

app.use(express.json());

const uploadsDir = path.join(__dirname, '..', 'public', 'images');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const sanitized = file.originalname.replace(/\s+/g, '-');
    cb(null, `${uniqueSuffix}-${sanitized}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    cb(new Error('Tipe berkas tidak valid, hanya gambar yang diizinkan'));
  } else {
    cb(null, true);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 512000 },
  fileFilter,
});

app.use('/images', express.static(uploadsDir));

const albumsService = new AlbumsService();
const songsService = new SongsService();
const usersService = new UsersService();
const authenticationsService = new AuthenticationsService();
const playlistsService = new PlaylistsService();
const cacheService = new CacheService();
const likesService = new LikesService(cacheService);
const producerService = new (require('./services/producerService'))();

const tokenManager = new TokenManager({
  accessTokenKey: process.env.ACCESS_TOKEN_KEY,
  refreshTokenKey: process.env.REFRESH_TOKEN_KEY,
  accessTokenAge: process.env.ACCESS_TOKEN_AGE || '30m',
});
const authenticate = createAuthenticationMiddleware(tokenManager);

const albumsHandler = new AlbumsHandler(albumsService);
const songsHandler = new SongsHandler(songsService);
const usersHandler = new UsersHandler(usersService);
const authenticationsHandler = new AuthenticationsHandler(authenticationsService, usersService, tokenManager);
const playlistsHandler = new PlaylistsHandler(playlistsService, songsService);
const baseUrl = `http://${process.env.HOST || 'localhost'}:${process.env.PORT || 5000}`;
const uploadsHandler = new UploadsHandler(albumsService, baseUrl);
const exportsHandler = new ExportsHandler(playlistsService, producerService);
const likesHandler = new LikesHandler(likesService);

app.use(createAlbumRoutes(albumsHandler));
app.use(createSongRoutes(songsHandler));
app.use(createUploadRoutes(uploadsHandler, upload));
app.use(createUserRoutes(usersHandler));
app.use(createAuthenticationRoutes(authenticationsHandler));
app.use(createPlaylistRoutes(playlistsHandler, authenticate));
app.use(createExportRoutes(exportsHandler, authenticate));
app.use(createLikesRoutes(likesHandler, authenticate));

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

