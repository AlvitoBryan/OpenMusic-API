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

  console.log('Consumer siap menerima pesan dari queue:', queue);

  channel.consume(queue, async (message) => {
    try {
      if (!message) return;

      const content = message.content.toString();
      const { playlistId, targetEmail } = JSON.parse(content);

      console.log(`Memproses ekspor playlist ${playlistId} untuk ${targetEmail}`);

      const playlist = await playlistsService.getPlaylistWithSongs(playlistId);

      await mailSender.sendEmail(targetEmail, JSON.stringify(playlist));

      console.log(`Email berhasil dikirim ke ${targetEmail}`);

      channel.ack(message);
    } catch (error) {
      console.error('Error memproses pesan:', error);
    }
  });
};

init().catch((error) => {
  console.error('Error inisialisasi consumer:', error);
  process.exit(1);
});

