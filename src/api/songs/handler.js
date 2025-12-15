const { validateSongPayload } = require('../../validator/songs');

class SongsHandler {
  constructor(service) {
    this._service = service;

    this.postSong = this.postSong.bind(this);
    this.getSongs = this.getSongs.bind(this);
    this.getSongById = this.getSongById.bind(this);
    this.putSongById = this.putSongById.bind(this);
    this.deleteSongById = this.deleteSongById.bind(this);
  }

  async postSong(req, res, next) {
    try {
      validateSongPayload(req.body);
      const songId = await this._service.addSong(req.body);

      res.status(201).json({
        status: 'success',
        data: {
          songId,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getSongs(req, res, next) {
    try {
      const songs = await this._service.getSongs();

      res.status(200).json({
        status: 'success',
        data: { songs },
      });
    } catch (error) {
      next(error);
    }
  }

  async getSongById(req, res, next) {
    try {
      const { id } = req.params;
      const song = await this._service.getSongById(id);

      res.status(200).json({
        status: 'success',
        data: { song },
      });
    } catch (error) {
      next(error);
    }
  }

  async putSongById(req, res, next) {
    try {
      validateSongPayload(req.body);
      const { id } = req.params;
      await this._service.updateSongById(id, req.body);

      res.status(200).json({
        status: 'success',
        message: 'Lagu berhasil diperbarui',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteSongById(req, res, next) {
    try {
      const { id } = req.params;
      await this._service.deleteSongById(id);

      res.status(200).json({
        status: 'success',
        message: 'Lagu berhasil dihapus',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = SongsHandler;

