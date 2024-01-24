import { socket } from '@components/SocketManager';
import { SocketEvent } from '@constants/socket.emit';
import { selectMyCharacter } from '@store/features/character.slice';
import { useAppSelector } from '@store/hooks';
import { useEffect, useState } from 'react';
import classNames from 'classnames';

export type ChatMessageType = {
  socketId: string;
  name: string;
  message: string;
  timestamp: string;
};

export const Chat = () => {
  const myCharacter = useAppSelector(selectMyCharacter);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);

  const [message, setMessage] = useState<string>('');
  const [showInputChat, setShowInputChat] = useState<boolean>(false);

  const sendMessage = (message: string) => {
    socket.emit(SocketEvent.CHAT_MESSAGE, {
      socketId: myCharacter?.socketId,
      name: myCharacter?.name,
      message,
      timestamp: new Date().toLocaleTimeString(),
    });
  };

  useEffect(() => {
    const onEnter = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        console.log('send message', message.length);

        if (message.length > 0) {
          sendMessage(message);
          setMessage('');
          setMessages((prev) => [
            ...prev,
            {
              socketId: myCharacter!.socketId,
              name: myCharacter!.name,
              message,
              timestamp: new Date().toLocaleTimeString(),
            },
          ]);
        }

        setShowInputChat(!showInputChat);
      }
    };

    document.addEventListener('keydown', onEnter);

    return () => {
      document.removeEventListener('keydown', onEnter);
    };
  }, [message, showInputChat]);

  useEffect(() => {
    socket.on(SocketEvent.CHAT_MESSAGE_RECEIVED, (data: ChatMessageType) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off(SocketEvent.CHAT_MESSAGE_RECEIVED);
    };
  }, []);

  return (
    <>
      <div className="fixed bg-slate-950/5 w-[300px] h-[400px] left-0 top-0 shadow-sm">
        <div className="flex flex-col gap-2 justify-end h-full overflow-y-auto p-2">
          {messages.map((m, index) => {
            const textColor = m.socketId === myCharacter?.socketId ? 'text-blue-500' : 'text-gray-700';
            return (
              <div className="gap-2" key={index}>
                <span className={classNames('text-xs mr-1', textColor)}>{m.timestamp}</span>
                <span className={classNames('text-sm font-bold mr-2', textColor)}>{m.name}:</span>
                <span className={classNames('text-sm', textColor)}>{m.message}</span>
              </div>
            );
          })}
        </div>
        <div
          className={
            showInputChat
              ? 'flex items-center gap-2 bg-slate-950/5 rounded p-2'
              : 'flex items-center gap-2 bg-slate-950/5 rounded opacity-0 pointer-events-none'
          }
        >
          {showInputChat && (
            <input
              className="shadow appearance-none border rounded w-full py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              value={message}
              autoFocus
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message"
              name="message"
              id="message"
            />
          )}
        </div>
      </div>
    </>
  );
};
