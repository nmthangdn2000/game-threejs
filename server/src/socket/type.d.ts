export type CharacterType = {
  id: string;
  socketId: string;
  position: [number, number, number];
  hairColor: string;
  topColor: string;
  bottomColor: string;
  name: string;
  peerId: string;
};

export type PlayerInfoType = {
  name: string;
  peerId: string;
};

export type ChatMessageType = {
  socketId: string;
  name: string;
  message: string;
  timestamp: string;
};
