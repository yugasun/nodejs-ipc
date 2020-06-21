const net = require('net');
const fs = require('fs');
const { SOCKET } = require('./config');

const Server = {
  socketServer: null,
  shutdown: false,
  connections: new Map(),
  createServer(socket) {
    console.log(`Creating Server...`);
    const server = net.createServer((socket) => {
      console.log('Connection Acknowledged');
      const tKey = Date.now();
      this.connections.set(tKey, socket);

      socket.on('end', () => {
        console.log(`Client disconnected`);
        this.connections.delete(tKey);
      });

      socket.on('data', (msg) => {
        msg = msg.toString();
        console.log(`Client: ${msg}`);

        if (msg === 'name') {
          socket.write('yugasun');
        }

        if (msg === 'age') {
          socket.write('20');
        }

        if (msg === 'job') {
          socket.write('Frontend Engineer');
        }
      });
    });

    server.listen(socket);
    server.on('connection', (socket) => {
      console.log(`Client connected`);
    });

    console.log(`Server created`);

    return server;
  },

  cleanup() {
    if (!shutdown) {
      shutdown = true;
      console.log(`\n Shuting down \n`);
      this.connections.forEach((conn) => {
        conn.write('__disconnect');
        conn.end();
      });

      this.socketServer.close();
      process.exit(0);
    }
  },

  init() {
    console.log(`Checking for letfover socket`);
    try {
      fs.statSync(SOCKET);
      console.log(`Removing letfover socket`);
      try {
        fs.unlinkSync(SOCKET);
      } catch (e) {
        console.error(e);
        process.exit(0);
      }
    } catch (e) {
      console.log(`No letfover socket found`);
    }

    this.socketServer = this.createServer(SOCKET);

    process.on('SIGINIT', this.cleanup);
  },
};

Server.init();
