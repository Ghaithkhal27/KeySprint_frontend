import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

interface TypingTest {
  id: string;
  text: string;
  timeLimit: number;
}
interface TestScore {
  accuracy: number;
  WPM: number;
  rank: string;
  userId: string;
}

interface TypingState {
  typingTest: TypingTest[];
  selectedText: string;
  selectedTime: number;
  userInput: string;
  showResults: boolean;
  correctChars: number;
  initialTime: number;
  wpm: number;
}

const initialState: TypingState = {
  typingTest: [],
  selectedText: '',
  selectedTime: 0,
  userInput: '',
  showResults: false,
  correctChars: 0,
  initialTime: 0,
  wpm: 0,

};



export const getAllTypingTest = createAsyncThunk<TypingTest[], void, { rejectValue: string }>(
  'type/test',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/typing/test`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch data', error);
      return rejectWithValue('Failed to fetch data');
    }
  }
);
export const putScore = createAsyncThunk<void, TestScore, { rejectValue: string }>(
  'typing/putScore',
  async (score, { rejectWithValue }) => {
    try {
      await axios.put(`${API_URL}/typing/score`, score);
      console.log("Score sent successfully");
    } catch (error) {
      console.error('Failed to send Score', error);
      return rejectWithValue('Failed to send Score');
    }
  }
);

const typingTestSlice = createSlice({
  name: 'typing',
  initialState,
  reducers: {
    setSelectedText: (state, action: PayloadAction<string>) => {
      state.selectedText = action.payload;
    },
    setselectedTime: (state, action: PayloadAction<number>) => {
      state.selectedTime = action.payload;
    },
    setUserInput: (state, action: PayloadAction<string>) => {
      state.userInput = action.payload;
    },
    setshowResults: (state, action: PayloadAction<boolean>) => {
      state.showResults = action.payload;
    },
    setCorrectChars: (state, action: PayloadAction<number>) => {
      state.correctChars = action.payload;
    },
    setInitialTime: (state, action: PayloadAction<number>) => {
      state.initialTime = action.payload;
    },
    setWpm:(state,action:PayloadAction<number>)=>{
      state.wpm = action.payload;
    }

  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllTypingTest.fulfilled, (state, action: PayloadAction<TypingTest[]>) => {
        state.typingTest = action.payload;
      })
      .addCase(putScore.fulfilled, () => {
        console.log('Score updated successfully');
      });
  },
});
export const { setSelectedText,setselectedTime,setUserInput,setshowResults,setCorrectChars,setInitialTime,setWpm } = typingTestSlice.actions;
export default typingTestSlice.reducer;
