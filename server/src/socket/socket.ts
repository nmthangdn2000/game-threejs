import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { socketEmitters } from './emit';
import { CharacterType } from './type';

export let io: Server;
export const characters: Map<string, CharacterType> = new Map();

export const socketIo = (server: HttpServer, origins: string[] | '*') => {
  io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  console.log('socket.io server started');

  io.on('connection', (socket) => {
    socket.on('disconnect', () => {
      characters.delete(socket.id);
      socket.broadcast.emit('characterLeave', socket.id);
    });

    socketEmitters(socket, io);
  });

  return io;
};
