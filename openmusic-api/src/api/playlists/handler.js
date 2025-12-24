const {
  validatePlaylistPayload,
  validatePlaylistSongPayload,
} = require('../../validator/playlists');

class PlaylistsHandler {
  constructor(playlistsService, songsService) {
    this._playlistsService = playlistsService;
    this._songsService = songsService;

    this.postPlaylist = this.postPlaylist.bind(this);
    this.getPlaylists = this.getPlaylists.bind(this);
    this.deletePlaylist = this.deletePlaylist.bind(this);
    this.postPlaylistSong = this.postPlaylistSong.bind(this);
    this.getPlaylistSongs = this.getPlaylistSongs.bind(this);
    this.deletePlaylistSong = this.deletePlaylistSong.bind(this);
  }

  async postPlaylist(req, res, next) {
    try {
      validatePlaylistPayload(req.body);
      const { name } = req.body;
      const { userId } = req;

      const playlistId = await this._playlistsService.addPlaylist(name, userId);

      res.status(201).json({
        status: 'success',
        data: {
          playlistId,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getPlaylists(req, res, next) {
    try {
      const { userId } = req;
      const playlists = await this._playlistsService.getPlaylists(userId);

      res.status(200).json({
        status: 'success',
        data: {
          playlists,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async deletePlaylist(req, res, next) {
    try {
      const { id } = req.params;
      const { userId } = req;

      await this._playlistsService.verifyPlaylistOwner(id, userId);
      await this._playlistsService.deletePlaylistById(id);

      res.status(200).json({
        status: 'success',
        message: 'Playlist berhasil dihapus',
      });
    } catch (error) {
      next(error);
    }
  }

  async postPlaylistSong(req, res, next) {
    try {
      validatePlaylistSongPayload(req.body);
      const { id } = req.params;
      const { songId } = req.body;
      const { userId } = req;

      await this._playlistsService.verifyPlaylistOwner(id, userId);
      await this._songsService.getSongById(songId);
      await this._playlistsService.addSongToPlaylist(id, songId);

      res.status(201).json({
        status: 'success',
        message: 'Lagu berhasil ditambahkan ke playlist',
      });
    } catch (error) {
      next(error);
    }
  }

  async getPlaylistSongs(req, res, next) {
    try {
      const { id } = req.params;
      const { userId } = req;

      await this._playlistsService.verifyPlaylistOwner(id, userId);
      const playlist = await this._playlistsService.getPlaylistWithSongs(id);

      res.status(200).json({
        status: 'success',
        data: {
          playlist,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async deletePlaylistSong(req, res, next) {
    try {
      validatePlaylistSongPayload(req.body);
      const { id } = req.params;
      const { songId } = req.body;
      const { userId } = req;

      await this._playlistsService.deleteSongFromPlaylist(id, songId, userId);

      res.status(200).json({
        status: 'success',
        message: 'Lagu berhasil dihapus dari playlist',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PlaylistsHandler;


