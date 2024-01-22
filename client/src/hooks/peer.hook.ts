import { useEffect, useState } from 'react';
import Peer, { DataConnection } from 'peerjs';
import { appConfig } from '@environments/env';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { selectCharacters, selectMyCharacter, setConnectPeer, setPeerId } from '@store/features/character.slice';

interface PeerHook {
  peer?: Peer;
  conn?: DataConnection;
  sendMessage: (message: string) => void;
}

const usePeer = (): PeerHook => {
  const dispatch = useAppDispatch();

  const listCharacter = useAppSelector(selectCharacters);
  const myCharacter = useAppSelector(selectMyCharacter);

  const [peer, setPeer] = useState<Peer>();
  const [conn, setConn] = useState<DataConnection>();

  useEffect(() => {
    const peerInstance = new Peer({
      host: appConfig.PEER_HOST,
      port: appConfig.PEER_PORT,
      secure: appConfig.PEER_PORT === 443,
      path: '/peerjs/myapp',
      config: {
        iceServers: [
          {
            urls: 'stun:stun1.l.google.com:19302',
          },
          {
            urls: 'stun:stun2.l.google.com:19302',
          },
        ],
      },
    });

    peerInstance.on('open', (id) => {
      console.log('My peer ID is: ' + id);
      dispatch(setPeerId(id));
    });

    peerInstance.on('connection', (connection) => {
      connection.on('open', () => {
        console.log('Connection opened');
        setConn(connection);

        connection.on('data', (data) => {
          console.log('Received:', data);
        });
      });
    });

    peerInstance.on('error', (error) => {
      console.error('Peer error:', error);
    });

    peerInstance.on('call', (call) => {
      // @ts-ignore
      const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.mediaDevices;
      getUserMedia(
        { audio: true },
        (stream: MediaStream) => {
          call.answer(stream); // Answer the call with an A/V stream.
          call.on('stream', (remoteStream) => {
            const video = document.createElement('video');
            video.srcObject = remoteStream;
            video.play();
            document.body.appendChild(video);
          });
        },
        (err: any) => {
          console.log('Failed to get local stream', err);
        }
      );
    });

    setPeer(peerInstance);

    return () => {
      peerInstance!.destroy();
    };
  }, []);

  const sendMessage = (message: string) => {
    if (conn) {
      conn.send(message);
    } else {
      console.error('Connection not established.');
    }
  };

  const call = (remotePeerId: string) => {
    // @ts-ignore
    const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.mediaDevices;

    getUserMedia(
      { audio: true },
      (stream: MediaStream) => {
        if (!peer) return;

        const call = peer.call(remotePeerId, stream);
        call.on('stream', (remoteStream) => {
          const video = document.createElement('video');
          video.srcObject = remoteStream;
          video.play();
          document.body.appendChild(video);

          dispatch(setConnectPeer(remotePeerId));
        });
      },
      (err: any) => {
        console.log('Failed to get local stream', err);
      }
    );
  };

  const connect = () => {
    if (listCharacter.length === 0 || !myCharacter) return;

    listCharacter.forEach((character) => {
      if (character.peerId === myCharacter!.peerId) return;

      if (character.isConnectPeer) return;

      call(character.peerId!);
    });
  };

  useEffect(() => {
    connect();
  }, [listCharacter, myCharacter]);

  return {
    peer,
    conn,
    sendMessage,
  };
};

export default usePeer;
