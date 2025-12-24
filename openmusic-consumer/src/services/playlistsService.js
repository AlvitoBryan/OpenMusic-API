const { nanoid } = require('nanoid');
const pool = require('./db');
const {
  AuthorizationError,
  NotFoundError,
  InvariantError,
} = require('../exceptions');

class PlaylistsService {
  async getPlaylistWithSongs(playlistId) {
    const playlistQuery = {
      text: `SELECT playlists.id, playlists.name, users.username
             FROM playlists
             LEFT JOIN users ON playlists.owner = users.id
             WHERE playlists.id = $1`,
      values: [playlistId],
    };

    const playlistResult = await pool.query(playlistQuery);

    if (!playlistResult.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const playlist = playlistResult.rows[0];

    const songsQuery = {
      text: `SELECT songs.id, songs.title, songs.performer
             FROM playlist_songs
             JOIN songs ON songs.id = playlist_songs.song_id
             WHERE playlist_songs.playlist_id = $1`,
      values: [playlistId],
    };

    const songsResult = await pool.query(songsQuery);

    return {
      id: playlist.id,
      name: playlist.name,
      username: playlist.username,
      songs: songsResult.rows,
    };
  }
}

module.exports = PlaylistsService;

