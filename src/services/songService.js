const { nanoid } = require('nanoid');
const pool = require('./db');
const { NotFoundError } = require('../utils/errors');

class SongService {
  async addSong({
    title, year, genre, performer, duration, albumId,
  }) {
    const id = `song_${nanoid(16)}`;
    const query = {
      text: `INSERT INTO songs(id, title, year, genre, performer, duration, album_id)
             VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      values: [id, title, year, genre, performer, duration ?? null, albumId ?? null],
    };

    const result = await pool.query(query);
    return result.rows[0].id;
  }

  async getSongs() {
    const result = await pool.query('SELECT id, title, performer FROM songs');
    return result.rows;
  }

  async getSongById(id) {
    const query = {
      text: `SELECT id, title, year, genre, performer, duration, album_id AS "albumId"
             FROM songs WHERE id = $1`,
      values: [id],
    };

    const result = await pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }
    return result.rows[0];
  }

  async updateSongById(id, {
    title, year, genre, performer, duration, albumId,
  }) {
    const query = {
      text: `UPDATE songs
             SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6
             WHERE id = $7 RETURNING id`,
      values: [title, year, genre, performer, duration ?? null, albumId ?? null, id],
    };

    const result = await pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = SongService;

