import { Server, Socket } from 'socket.io';
import { characters } from './socket';
import { CharacterType, PlayerInfoType } from './type';
import { SocketEvent } from './emit.enum';

const randomPosition = () => [Math.random() * 3, 0, Math.random() * 3] as [number, number, number];

const randomColor = () => {
  const color = Math.floor(Math.random() * 16777215).toString(16);
  return `#${color}`;
};

export const socketEmitters = (socket: Socket, io: Server) => {
  // send all characters to the new connected socket
  socket.emit(SocketEvent.LIST_CHARACTER_JOINED, Array.from(characters.values()));

  socket.on(SocketEvent.CHARACTER_JOIN, ({ name, peerId }: PlayerInfoType) => {
    const newCharacter = {
      socketId: socket.id,
      name,
      peerId,
      position: randomPosition(),
      bottomColor: randomColor(),
      hairColor: randomColor(),
      id: Math.random().toString(36).substr(2, 9),
      topColor: randomColor(),
    };

    characters.set(socket.id, newCharacter);

    // send the new character to the sender
    socket.emit(SocketEvent.CHARACTER_JOINED, newCharacter);

    // send the new character to all connected sockets except the sender
    socket.broadcast.emit(SocketEvent.NEW_CHARACTER_JOINED, newCharacter);
  });

  socket.on(SocketEvent.CHARACTER_MOVE, (position: [number, number, number]) => {
    let character = characters.get(socket.id);
    if (!character) return;

    character = { ...character, position };
    characters.set(socket.id, character);

    socket.broadcast.emit(SocketEvent.CHARACTER_MOVED, character);
  });
};
