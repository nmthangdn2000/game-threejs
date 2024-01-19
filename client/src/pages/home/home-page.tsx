import { Experience } from '@pages/home/components/Experience';
import { Canvas } from '@react-three/fiber';

import './home-page.css';
import { SocketManager } from '@components/SocketManager';
import { useState } from 'react';
import { Form } from '@pages/home/components/Form';
import { PeerManager } from '@components/PeerManager';

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
        </>
      ) : (
        <Form setConnected={setConnected} />
      )}
    </>
  );
};
