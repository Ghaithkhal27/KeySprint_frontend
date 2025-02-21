import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

interface GameState {
    groups: Array<{ 
        id: string;
        name: string;
        imageUrl: string;
        description: string;
    }>;

    levels: Array<{ 
        id: string;
        text: string;
        difficulty: string;
        language: string;
        timeLimit: number;
        timesPlayed: number;
    }>;

    currentLevelIndex: number;
    userInput: string;
    timeLeft: number;
    correctChars: number;
}

const initialState: GameState = {
    groups: [],
    levels: [],
    currentLevelIndex: 0,
    userInput: '',
    timeLeft: 0,
    correctChars: 0,
};

export const getAllGroup = createAsyncThunk('game/group', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${API_URL}/game/group`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch groups', error);
        return rejectWithValue( 'Failed to fetch groups');
    }
});

export const getAllLevels = createAsyncThunk('game/level', async (id: string, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${API_URL}/game/level/${id}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch levels', error);
        return rejectWithValue( 'Failed to fetch levels');
    }
});

const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        setcurrentLevelIndex: (state, action: PayloadAction<number>) => {
            state.currentLevelIndex = action.payload;
        },
        setUserInput: (state, action: PayloadAction<string>) => {
            state.userInput = action.payload;
        },
        setTimeLeft: (state, action: PayloadAction<number>) => {
            state.timeLeft = action.payload;
        },
        setCorrectChars: (state, action: PayloadAction<number>) => {
            state.correctChars = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getAllGroup.fulfilled, (state, action: PayloadAction<GameState['groups']>) => {
            state.groups = action.payload;
        });
        builder.addCase(getAllLevels.fulfilled, (state, action) => {
            state.levels = action.payload;
            state.currentLevelIndex = 0;
            state.userInput = "";
            state.timeLeft = action.payload[0]?.timeLimit || 0;
            state.correctChars = 0;
          })
    },
});

export const { setcurrentLevelIndex, setTimeLeft, setUserInput, setCorrectChars } = gameSlice.actions;

export default gameSlice.reducer;
