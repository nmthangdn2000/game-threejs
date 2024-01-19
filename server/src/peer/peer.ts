import { PeerServerEvents } from 'peer';
import { Express } from 'express';

export const peerEmitters = (peer: Express & PeerServerEvents) => {
  peer.on('open', (id: any) => {
    console.log('peer open', id);
  });

  peer.on('connection', (conn: any) => {
    console.log('peer connection');
  });

  peer.on('disconnected', () => {
    console.log('peer disconnected');
  });

  peer.on('error', (err: any) => {
    console.log('peer error', err);
  });
};
