import { SocketEvent } from '@constants/socket.emit';
import { appConfig } from '@environments/env';
import {
  CharacterType,
  setCharacterJoin,
  setCharacterLeave,
  setCharacterMove,
  setListCharacter,
  setNewCharacterJoined,
} from '@store/features/character.slice';
import { useAppDispatch } from '@store/hooks';
import { useEffect } from 'react';
import { io } from 'socket.io-client';

export const socket = io(appConfig.SOCKET_URL);

export const SocketManager = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    socket.on('connect', () => {
      console.log('connected');
    });

    socket.on('disconnect', () => {
      console.log('disconnected');
    });

    socket.on(SocketEvent.LIST_CHARACTER_JOINED, (data: CharacterType[]) => {
      console.log('listCharacterJoined');

      dispatch(setListCharacter(data));
    });

    socket.on(SocketEvent.CHARACTER_JOINED, (data: CharacterType) => {
      console.log('characterJoined');
      dispatch(setCharacterJoin(data));
    });

    socket.on(SocketEvent.NEW_CHARACTER_JOINED, (data: CharacterType) => {
      console.log('newCharacterJoined');
      dispatch(setNewCharacterJoined(data));
    });

    socket.on(SocketEvent.CHARACTER_LEAVE, (socketId: string) => {
      dispatch(setCharacterLeave(socketId));
    });

    socket.on(SocketEvent.CHARACTER_MOVED, (data: CharacterType) => {
      dispatch(
        setCharacterMove({
          socketId: data.socketId,
          position: data.position,
        })
      );
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('characterJoined');
      socket.off('listCharacter');
    };
  }, []);

  return null;
};
