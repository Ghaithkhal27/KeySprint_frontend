import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

interface AuthState {
  token: string | null;
  username:string
  email:string
  password:string 

}

const initialState: AuthState = {
  username:'',
  email: '',
  password: '',
  token: localStorage.getItem('token'),

};

export const loginUser = createAsyncThunk(
  'auth/login',
  async (data: { email: string; password: string }) => {
    const response = await axios.post(`${API_URL}/auth/login`, data);
    return response.data.token;
  }
);
export const registerUser = createAsyncThunk(
    'auth/register',
    async (data: { username:string,email: string; password: string }) => {
        const response = await axios.post(`${API_URL}/auth/register`, data);
        return response.data.token;
      }



)


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
  },
  setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
  },
  setusername:(state,action:PayloadAction<string>)=>{
    state.username=action.payload
  }
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.token = action.payload;
      localStorage.setItem('token', action.payload);
    })
    builder.addCase(registerUser.fulfilled, (state, action) => {
        state.token = action.payload;
        localStorage.setItem('token', action.payload);
      })


  },

});
export const { setEmail, setPassword ,setusername } = authSlice.actions;
export default authSlice.reducer;