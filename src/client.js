const net = require('net');
const { SOCKET } = require('./config');

const Client = {
  socketClient: null,
  cleanup() {
    console.log(`\n Disconnect \n`);

    this.socketClient.end();
    process.exit(0);
  },

  init() {
    this.socketClient = net.createConnection(SOCKET);

    this.socketClient.on('connection', () => {
      console.log(`Connected`);
    });

    this.socketClient.on('data', (data) => {
      data = data.toString();

      if (data === '__disconnect') {
        console.log(`Server disconnected`);
        this.cleanup();
      }

      console.info(`Server: ${data}`);
    });

    this.socketClient.on('error', (data) => {
      console.error('Server not active');
      process.exit(1);
    });

    // get user input
    let inputBuffer = '';
    process.stdin.on('data', (data) => {
      inputBuffer += data;

      const enterPosition = inputBuffer.indexOf('\n');
      if (enterPosition !== -1) {
        let line = inputBuffer.substring(0, enterPosition);
        inputBuffer = inputBuffer.substring(enterPosition + 1);

        if (line === 'exit') {
          return this.cleanup();
        }
        this.socketClient.write(line);
      }
    });

    process.on('SIGINT', this.cleanup);
  },
};

Client.init();
