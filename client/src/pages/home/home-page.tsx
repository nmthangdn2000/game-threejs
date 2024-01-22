import { Experience } from '@pages/home/components/Experience';
import { Canvas } from '@react-three/fiber';

import { PeerManager } from '@components/PeerManager';
import { SocketManager } from '@components/SocketManager';
import { Chat } from '@pages/home/components/Chat';
import { Form } from '@pages/home/components/Form';
import { useState } from 'react';
import './home-page.css';

export const HomePage = () => {
  const [connected, setConnected] = useState<boolean>(false);

  return (
    <>
      <SocketManager />
      <PeerManager />
      {connected ? (
        <>
          <Canvas
            camera={{
              position: [8, 8, 8],
              fov: 30,
            }}
          >
            <color attach={'background'} args={['#ececec']} />

            <Experience />
          </Canvas>
          <Chat />
        </>
      ) : (
        <Form setConnected={setConnected} />
      )}
    </>
  );
};
