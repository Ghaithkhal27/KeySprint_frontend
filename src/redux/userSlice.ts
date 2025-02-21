import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = import.meta.env.VITE_API_URL;

const token = localStorage.getItem("token");
let decoded: { id: string } | null = null;
if (token) {
    try {
        decoded = jwtDecode<{ id: string }>(token);
    } catch (error) {
        console.error("Invalid token", error);
    }
}

interface UserState {
  users: Array<{
    id: string;
    username: string;
    email: string;
    avatarUrl: string;
    

  }>;
  profile: {
    username: string;
  email: string;
  avatarUrl: string;
  bio: string | null;
  createdAt: string; 
  totalWins: number;
  totalLosses: number;
  totalMatches: number;
  scores:[ {
    accuracy: number;
    WPM: number;
    rank: string;
    userId: string;
  } ]

  
    
    
  } | null;
  onlineUsers:string[]

}


const initialState: UserState = {
  users: [],
  profile: null,
  onlineUsers:[]
};

export const getAllUsers = createAsyncThunk("user/getAllUsers", async () => {
  const response = await axios.get(`${API_URL}/user/users`);
  return response.data;
});

export const getProfile = createAsyncThunk("user/getProfile", async (_, { rejectWithValue }) => {
  if (!decoded) {
    return rejectWithValue("User not authenticated");
  }
  try {
    const response = await axios.get(`${API_URL}/user/profile/${decoded.id}`);
    return response.data;
  } catch (error) {
    return rejectWithValue("Failed to fetch profile");
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setOnlineUsers: (state, action: PayloadAction<string[]>) => {
      state.onlineUsers = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllUsers.fulfilled, (state, action) => {
      state.users = action.payload;
    });
    builder.addCase(getProfile.fulfilled, (state, action) => {
      state.profile = action.payload;
    });

  },
});
export const {setOnlineUsers  } = userSlice.actions;

export default userSlice.reducer;
