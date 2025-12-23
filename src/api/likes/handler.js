class LikesHandler {
  constructor(likesService) {
    this._likesService = likesService;

    this.postLike = this.postLike.bind(this);
    this.deleteLike = this.deleteLike.bind(this);
    this.getLikes = this.getLikes.bind(this);
  }

  async postLike(req, res, next) {
    try {
      const { id } = req.params;
      const { userId } = req;

      await this._likesService.addLike(userId, id);

      res.status(201).json({
        status: 'success',
        message: 'Berhasil menyukai album',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteLike(req, res, next) {
    try {
      const { id } = req.params;
      const { userId } = req;

      await this._likesService.deleteLike(userId, id);

      res.status(200).json({
        status: 'success',
        message: 'Berhasil membatalkan like',
      });
    } catch (error) {
      next(error);
    }
  }

  async getLikes(req, res, next) {
    try {
      const { id } = req.params;
      const result = await this._likesService.getAlbumLikes(id);

      if (result.source === 'cache') {
        res.set('X-Data-Source', 'cache');
      }

      res.status(200).json({
        status: 'success',
        data: {
          likes: result.likes,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = LikesHandler;




