exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('user_album_likes', {
    id: {
      type: 'varchar(50)',
      primaryKey: true,
    },
    user_id: {
      type: 'varchar(50)',
      notNull: true,
    },
    album_id: {
      type: 'varchar(50)',
      notNull: true,
    },
  });

  pgm.addConstraint('user_album_likes', 'fk_user_album_likes.user_id_users.id', {
    foreignKeys: {
      columns: 'user_id',
      references: 'users(id)',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  });

  pgm.addConstraint('user_album_likes', 'fk_user_album_likes.album_id_albums.id', {
    foreignKeys: {
      columns: 'album_id',
      references: 'albums(id)',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  });

  pgm.addConstraint('user_album_likes', 'unique_user_album_likes', {
    unique: ['user_id', 'album_id'],
  });
};

exports.down = (pgm) => {
  pgm.dropConstraint('user_album_likes', 'unique_user_album_likes');
  pgm.dropConstraint('user_album_likes', 'fk_user_album_likes.album_id_albums.id');
  pgm.dropConstraint('user_album_likes', 'fk_user_album_likes.user_id_users.id');
  pgm.dropTable('user_album_likes');
};
