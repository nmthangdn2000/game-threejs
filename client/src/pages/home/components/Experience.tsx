import { AnimatedWoman } from '@components/AnimatedWoman';
import { socket } from '@components/SocketManager';
import { SocketEvent } from '@constants/socket.emit';
import { ContactShadows, Environment, OrbitControls } from '@react-three/drei';
import { ThreeEvent } from '@react-three/fiber';
import { CharacterType, selectCharacters, selectMyCharacter, setCharacterMove } from '@store/features/character.slice';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { Vector3 } from 'three';

export const Experience = () => {
  const dispatch = useAppDispatch();
  const characters: CharacterType[] = useAppSelector(selectCharacters);
  const myCharacter: CharacterType | null = useAppSelector(selectMyCharacter);

  const moveCharacter = (e: ThreeEvent<MouseEvent>) => {
    const { x, y, z } = e.point;
    socket.emit(SocketEvent.CHARACTER_MOVE, [x, y, z]);
    dispatch(
      setCharacterMove({
        socketId: myCharacter!.socketId,
        position: [x, y, z],
      })
    );
  };

  return (
    <>
      <Environment preset="sunset" />
      <OrbitControls />
      <ContactShadows blur={2} />
      <mesh rotation-x={-Math.PI / 2} position-y={-0.001} onClick={moveCharacter}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>

      {characters.map((character) => (
        <AnimatedWoman
          key={character.socketId}
          bottomColor={character.bottomColor}
          hairColor={character.hairColor}
          topColor={character.topColor}
          position={new Vector3(character.position[0], character.position[1], character.position[2])}
          name={character.name}
        />
      ))}
    </>
  );
};
