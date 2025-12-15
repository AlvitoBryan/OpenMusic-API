const { validateAlbumPayload } = require('../../validator/albums');

class AlbumsHandler {
  constructor(service) {
    this._service = service;

    this.postAlbum = this.postAlbum.bind(this);
    this.getAlbumById = this.getAlbumById.bind(this);
    this.putAlbumById = this.putAlbumById.bind(this);
    this.deleteAlbumById = this.deleteAlbumById.bind(this);
  }

  async postAlbum(req, res, next) {
    try {
      validateAlbumPayload(req.body);
      const albumId = await this._service.addAlbum(req.body);

      res.status(201).json({
        status: 'success',
        data: {
          albumId,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getAlbumById(req, res, next) {
    try {
      const { id } = req.params;
      const album = await this._service.getAlbumById(id);

      res.status(200).json({
        status: 'success',
        data: { album },
      });
    } catch (error) {
      next(error);
    }
  }

  async putAlbumById(req, res, next) {
    try {
      validateAlbumPayload(req.body);
      const { id } = req.params;
      await this._service.updateAlbumById(id, req.body);

      res.status(200).json({
        status: 'success',
        message: 'Album berhasil diperbarui',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteAlbumById(req, res, next) {
    try {
      const { id } = req.params;
      await this._service.deleteAlbumById(id);

      res.status(200).json({
        status: 'success',
        message: 'Album berhasil dihapus',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AlbumsHandler;

