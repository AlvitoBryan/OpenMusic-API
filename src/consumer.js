const dotenv = require('dotenv');
const amqp = require('amqplib');
const PlaylistsService = require('./services/playlistsService');
const MailSender = require('./services/mailSender');

dotenv.config();

const playlistsService = new PlaylistsService();
const mailSender = new MailSender();

const RABBITMQ_SERVER = process.env.RABBITMQ_SERVER || 'amqp://localhost';

const init = async () => {
  const connection = await amqp.connect(RABBITMQ_SERVER);
  const channel = await connection.createChannel();

  const queue = 'export:playlists';
  await channel.assertQueue(queue, {
    durable: true,
  });

  channel.consume(queue, async (message) => {
    try {
      if (!message) return;

      const content = message.content.toString();
      const { playlistId, targetEmail } = JSON.parse(content);

      const playlist = await playlistsService.getPlaylistWithSongs(playlistId);

      await mailSender.sendEmail(targetEmail, JSON.stringify(playlist));

      channel.ack(message);
    } catch (error) {
      // Untuk saat ini log error saja, pesan tidak di-ack agar bisa dicoba ulang secara manual.
      // eslint-disable-next-line no-console
      console.error(error);
    }
  });
};

init().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
});


