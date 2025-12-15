const express = require('express');
const dotenv = require('dotenv');
const AlbumsService = require('./services/albumService');
const SongsService = require('./services/songService');
const UsersService = require('./services/usersService');
const AuthenticationsService = require('./services/authenticationsService');
const PlaylistsService = require('./services/playlistsService');
const AlbumsHandler = require('./api/albums/handler');
const SongsHandler = require('./api/songs/handler');
const UsersHandler = require('./api/users/handler');
const AuthenticationsHandler = require('./api/authentications/handler');
const PlaylistsHandler = require('./api/playlists/handler');
const createAlbumRoutes = require('./api/albums/routes');
const createSongRoutes = require('./api/songs/routes');
const createUserRoutes = require('./api/users/routes');
const createAuthenticationRoutes = require('./api/authentications/routes');
const createPlaylistRoutes = require('./api/playlists/routes');
const createAuthenticationMiddleware = require('./middlewares/authenticate');
const TokenManager = require('./utils/tokenManager');
const { ClientError } = require('./utils/errors');

dotenv.config();

const app = express();

app.use(express.json());

const albumsService = new AlbumsService();
const songsService = new SongsService();
const usersService = new UsersService();
const authenticationsService = new AuthenticationsService();
const playlistsService = new PlaylistsService();

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

app.use(createAlbumRoutes(albumsHandler));
app.use(createSongRoutes(songsHandler));
app.use(createUserRoutes(usersHandler));
app.use(createAuthenticationRoutes(authenticationsHandler));
app.use(createPlaylistRoutes(playlistsHandler, authenticate));

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

