const amqp = require('amqplib');

class ProducerService {
  constructor(serverUrl) {
    this._serverUrl = serverUrl || process.env.RABBITMQ_SERVER || 'amqp://localhost';
  }

  async sendMessage(queue, message) {
    const connection = await amqp.connect(this._serverUrl);
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, {
      durable: true,
    });

    channel.sendToQueue(queue, Buffer.from(message));

    setTimeout(() => {
      channel.close();
      connection.close();
    }, 500);
  }
}

module.exports = ProducerService;


