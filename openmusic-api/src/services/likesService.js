const { nanoid } = require('nanoid');
const pool = require('./db');
const {
  InvariantError,
  NotFoundError,
} = require('../utils/errors');

class LikesService {
  constructor(cacheService) {
    this._cacheService = cacheService;
  }

  async _verifyAlbumExists(albumId) {
    const query = {
      text: 'SELECT id FROM albums WHERE id = $1',
      values: [albumId],
    };
    const result = await pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Album tidak ditemukan');
    }
  }

  async addLike(userId, albumId) {
    await this._verifyAlbumExists(albumId);

    const id = `like_${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO user_album_likes(id, user_id, album_id) VALUES($1, $2, $3) RETURNING id',
      values: [id, userId, albumId],
    };

    try {
      await pool.query(query);
    } catch (error) {
      // unique constraint violation
      if (error.code === '23505') {
        throw new InvariantError('Anda tidak dapat menyukai album ini kembali');
      }
      throw error;
    }

    await this._cacheService.delete(`likes:${albumId}`);
  }

  async deleteLike(userId, albumId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id',
      values: [userId, albumId],
    };

    const result = await pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Like tidak ditemukan');
    }

    await this._cacheService.delete(`likes:${albumId}`);
  }

  async getAlbumLikes(albumId) {
    try {
      const result = await this._cacheService.get(`likes:${albumId}`);
      if (result) {
        return { likes: Number(result), source: 'cache' };
      }
    } catch (error) {
      // log optionally, but continue to DB
      // eslint-disable-next-line no-console
      console.error(error);
    }

    await this._verifyAlbumExists(albumId);

    const query = {
      text: 'SELECT COUNT(*)::int AS likes FROM user_album_likes WHERE album_id = $1',
      values: [albumId],
    };
    const result = await pool.query(query);
    const likes = result.rows[0].likes;

    await this._cacheService.set(`likes:${albumId}`, likes);

    return { likes, source: 'db' };
  }
}

module.exports = LikesService;




