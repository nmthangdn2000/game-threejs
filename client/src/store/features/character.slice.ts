import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from 'store/store';

export type CharacterType = {
  id: string;
  socketId: string;
  position: [number, number, number];
  hairColor: string;
  topColor: string;
  bottomColor: string;
  name: string;
  peerId: string;
  isConnectPeer?: boolean;
};

type PlayerState = {
  myCharacter: CharacterType | null;
  peerId: string | null;
  characters: CharacterType[];
};

const initialState: PlayerState = {
  myCharacter: null,
  peerId: null,
  characters: [],
};

export const homeSlice = createSlice({
  name: 'character',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setCharacterJoin: (state: PlayerState, action: PayloadAction<CharacterType>) => {
      if (state.characters.find((character) => character.socketId === action.payload.socketId)) {
        return;
      }
      state.characters.push(action.payload);
      state.myCharacter = action.payload;
    },
    setNewCharacterJoined: (state: PlayerState, action: PayloadAction<CharacterType>) => {
      if (state.characters.find((character) => character.socketId === action.payload.socketId)) {
        return;
      }
      state.characters.push(action.payload);
    },
    setListCharacter: (state: PlayerState, action: PayloadAction<CharacterType[]>) => {
      state.characters = action.payload;
    },
    setCharacterLeave: (state: PlayerState, action: PayloadAction<string>) => {
      state.characters = state.characters.filter((character) => character.socketId !== action.payload);
    },
    setCharacterMove: (state: PlayerState, action: PayloadAction<{ socketId: string; position: [number, number, number] }>) => {
      state.characters = state.characters.map((character) => {
        if (character.socketId === action.payload.socketId) {
          return { ...character, position: action.payload.position };
        }
        return character;
      });
    },
    setPeerId: (state: PlayerState, action: PayloadAction<string>) => {
      state.peerId = action.payload;
    },
    setConnectPeer: (state: PlayerState, action: PayloadAction<string>) => {
      state.characters = state.characters.map((character) => {
        if (character.peerId === action.payload) {
          return { ...character, isConnectPeer: true };
        }
        return character;
      });
    },
  },
});

export const { setCharacterJoin, setCharacterLeave, setListCharacter, setNewCharacterJoined, setCharacterMove, setPeerId, setConnectPeer } =
  homeSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCharacters = (state: RootState) => state.character.characters;
export const selectMyCharacter = (state: RootState) => state.character.myCharacter;
export const selectPeerId = (state: RootState) => state.character.peerId;

export default homeSlice.reducer;
