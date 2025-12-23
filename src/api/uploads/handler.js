const { InvariantError } = require('../../utils/errors');

class UploadsHandler {
  constructor(albumsService, baseUrl) {
    this._albumsService = albumsService;
    this._baseUrl = baseUrl;

    this.postUploadCover = this.postUploadCover.bind(this);
  }

  async postUploadCover(req, res, next) {
    try {
      const { id } = req.params;

      if (!req.file) {
        throw new InvariantError('Berkas gambar tidak ditemukan');
      }

      if (!req.file.filename) {
        throw new InvariantError('Nama berkas tidak valid');
      }

      const protocol = req.protocol || 'http';
      const host = req.get('host');
      const baseUrl = host ? `${protocol}://${host}` : this._baseUrl;
      const fileUrl = `${baseUrl}/images/${req.file.filename}`;

      await this._albumsService.addCoverUrl(id, fileUrl);

      return res.status(201).json({
        status: 'success',
        message: 'Sampul berhasil diunggah',
      });
    } catch (error) {
      console.error('Upload cover error:', error);
      return next(error);
    }
  }
}

module.exports = UploadsHandler;


