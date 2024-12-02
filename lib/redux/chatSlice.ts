import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ChatState {
  roomId: string | null
  userId: string | null
  userCount: number
  messages: { sender: 'me' | 'peer'; content: string }[]
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error'
  errorMessage: string | null
}

const initialState: ChatState = {
  roomId: null,
  userId: null,
  userCount: 0,
  messages: [],
  connectionStatus: 'disconnected',
  errorMessage: null,
}

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setRoom: (state, action: PayloadAction<{ roomId: string; userId: string }>) => {
      state.roomId = action.payload.roomId
      state.userId = action.payload.userId
    },
    setUserCount: (state, action: PayloadAction<number>) => {
      state.userCount = action.payload
    },
    addMessage: (state, action: PayloadAction<{ sender: 'me' | 'peer'; content: string }>) => {
      state.messages.push(action.payload)
    },
    setConnectionStatus: (state, action: PayloadAction<'disconnected' | 'connecting' | 'connected' | 'error'>) => {
      state.connectionStatus = action.payload
    },
    setErrorMessage: (state, action: PayloadAction<string | null>) => {
      state.errorMessage = action.payload
    },
    resetChat: (state) => {
      Object.assign(state, initialState)
    },
  },
})

export const { setRoom, setUserCount, addMessage, setConnectionStatus, setErrorMessage, resetChat } = chatSlice.actions

export default chatSlice.reducer

