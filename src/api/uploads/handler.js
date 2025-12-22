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
        return res.status(400).json({
          status: 'fail',
          message: 'Berkas gambar tidak ditemukan',
        });
      }

      const fileUrl = `${this._baseUrl}/images/${req.file.filename}`;

      await this._albumsService.addCoverUrl(id, fileUrl);

      return res.status(201).json({
        status: 'success',
        message: 'Sampul berhasil diunggah',
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = UploadsHandler;


