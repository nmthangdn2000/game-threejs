import { selectCharacters, selectMyCharacter, setConnectPeer, setPeerId } from '@store/features/character.slice';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { Peer } from 'peerjs';
import { useEffect, useRef } from 'react';

export const PeerManager = () => {
  const dispatch = useAppDispatch();
  const listCharacter = useAppSelector(selectCharacters);
  const myCharacter = useAppSelector(selectMyCharacter);

  const peerInstance = useRef<Peer>(null!);

  useEffect(() => {
    const peer = new Peer({
      host: '8055-118-71-70-148.ngrok-free.app',
      port: 443,
      secure: true,
      path: '/peerjs/myapp',
    });

    // const peer = new Peer({
    //   host: 'localhost',
    //   port: 3000,
    //   path: '/peerjs/myapp',
    // });

    peerInstance.current = peer;

    peer.on('open', (id) => {
      console.log('peer open', id);
      dispatch(setPeerId(id));
    });

    peer.on('connection', (conn) => {
      console.log('peer connection', conn);
    });

    peer.on('disconnected', () => {
      console.log('peer disconnected');
    });

    peer.on('error', (err) => {
      console.log('peer error', err);
    });

    peer.on('call', (call) => {
      console.log('peer call', call);

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

    return () => {
      peer.destroy();
    };
  }, []);

  const call = (remotePeerId: string) => {
    // @ts-ignore
    const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.mediaDevices;

    getUserMedia(
      { audio: true },
      (stream: MediaStream) => {
        const call = peerInstance.current.call(remotePeerId, stream);
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

  return null;
};