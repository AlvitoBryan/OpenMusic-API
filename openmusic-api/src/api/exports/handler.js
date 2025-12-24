const { validateExportPlaylistPayload } = require('../../validator/exports');

class ExportsHandler {
  constructor(playlistsService, producerService) {
    this._playlistsService = playlistsService;
    this._producerService = producerService;

    this.postExportPlaylist = this.postExportPlaylist.bind(this);
  }

  async postExportPlaylist(req, res, next) {
    try {
      validateExportPlaylistPayload(req.body);

      const { id } = req.params;
      const { targetEmail } = req.body;
      const { userId } = req;

      await this._playlistsService.verifyPlaylistOwner(id, userId);

      const message = JSON.stringify({ playlistId: id, targetEmail });
      await this._producerService.sendMessage('export:playlists', message);

      res.status(201).json({
        status: 'success',
        message: 'Permintaan Anda sedang kami proses',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ExportsHandler;


