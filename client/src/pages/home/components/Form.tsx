import { socket } from '@components/SocketManager';
import { SocketEvent } from '@constants/socket.emit';
import { selectPeerId } from '@store/features/character.slice';
import { useAppSelector } from '@store/hooks';
import { useState } from 'react';

type FormProps = {
  setConnected: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Form = ({ setConnected }: FormProps) => {
  const peerId = useAppSelector(selectPeerId);
  const [name, setName] = useState<string>('');

  const onSubmit = (e: any) => {
    e.preventDefault();
    setConnected(true);
    setTimeout(() => {
      socket.emit(SocketEvent.CHARACTER_JOIN, {
        name,
        peerId,
      });
    }, 10);
  };

  return (
    <form className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 p-10 bg-slate-100 rounded-md" onSubmit={onSubmit}>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
          Username
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="username"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Username"
        />
      </div>

      <div className="flex items-center justify-center">
        <button
          className={
            name.length > 0
              ? 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
              : 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline opacity-50 cursor-not-allowed'
          }
          type="button"
          disabled={name.length === 0}
          onClick={onSubmit}
        >
          Join
        </button>
      </div>
    </form>
  );
};
