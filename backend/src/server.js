import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import { Server } from 'socket.io'
import 'dotenv/config'

const app = express()
const server = createServer(app)

const PORT = process.env.PORT || 5001
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/chatify'
const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-change-this-secret'
const isProduction = process.env.NODE_ENV === 'production'
const userSocketMap = new Map()

app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
}))
app.use(express.json({ limit: '10mb' }))

const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    credentials: true,
  },
})

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
)

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
)

const User = mongoose.model('User', userSchema)
const Message = mongoose.model('Message', messageSchema)

const cookieOptions = {
  httpOnly: true,
  sameSite: isProduction ? 'none' : 'lax',
  secure: isProduction,
  maxAge: 7 * 24 * 60 * 60 * 1000,
}

const publicUser = (user) => ({
  _id: user._id.toString(),
  fullName: user.fullName,
  email: user.email,
  profilePic: user.profilePic,
  createdAt: user.createdAt,
})

const publicMessage = (message) => ({
  _id: message._id.toString(),
  senderId: message.senderId.toString(),
  receiverId: message.receiverId.toString(),
  text: message.text,
  image: message.image,
  createdAt: message.createdAt,
})

const getCookie = (req, name) => {
  const cookies = req.headers.cookie?.split(';') ?? []
  const cookie = cookies.find((item) => item.trim().startsWith(`${name}=`))
  return cookie ? decodeURIComponent(cookie.split('=').slice(1).join('=')) : null
}

const setAuthCookie = (res, userId) => {
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' })
  res.cookie('jwt', token, cookieOptions)
}

const clearAuthCookie = (res) => {
  res.clearCookie('jwt', {
    httpOnly: true,
    sameSite: cookieOptions.sameSite,
    secure: cookieOptions.secure,
  })
}

const requireAuth = async (req, res, next) => {
  try {
    const token = getCookie(req, 'jwt')

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    const user = await User.findById(decoded.userId)

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    req.user = user
    next()
  } catch {
    res.status(401).json({ message: 'Unauthorized' })
  }
}

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  })
})

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { fullName, email, password } = req.body

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' })
    }

    const normalizedEmail = email.toLowerCase().trim()
    const exists = await User.exists({ email: normalizedEmail })

    if (exists) {
      return res.status(409).json({ message: 'Email already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    })

    setAuthCookie(res, user._id.toString())
    res.status(201).json(publicUser(user))
  } catch (error) {
    console.error('Signup error:', error)
    res.status(500).json({ message: 'Failed to create account' })
  }
})

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email: email?.toLowerCase().trim() })

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const isPasswordCorrect = await bcrypt.compare(password || '', user.password)

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    setAuthCookie(res, user._id.toString())
    res.json(publicUser(user))
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Failed to log in' })
  }
})

app.post('/api/auth/logout', (_req, res) => {
  clearAuthCookie(res)
  res.json({ message: 'Logged out successfully' })
})

app.get('/api/auth/check', requireAuth, (req, res) => {
  res.json(publicUser(req.user))
})

app.put('/api/auth/update-profile', requireAuth, async (req, res) => {
  try {
    req.user.profilePic = req.body.profilePic || ''
    await req.user.save()
    res.json(publicUser(req.user))
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({ message: 'Failed to update profile' })
  }
})

app.get('/api/messages/users', requireAuth, async (req, res) => {
  const users = await User
    .find({ _id: { $ne: req.user._id } })
    .select('-password')
    .sort({ fullName: 1 })

  res.json(users.map(publicUser))
})

app.get('/api/messages/:userId', requireAuth, async (req, res) => {
  const { userId } = req.params

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid user id' })
  }

  const messages = await Message
    .find({
      $or: [
        { senderId: req.user._id, receiverId: userId },
        { senderId: userId, receiverId: req.user._id },
      ],
    })
    .sort({ createdAt: 1 })

  res.json(messages.map(publicMessage))
})

app.post('/api/messages/send/:userId', requireAuth, async (req, res) => {
  try {
    const { userId } = req.params

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user id' })
    }

    const receiver = await User.exists({ _id: userId })

    if (!receiver) {
      return res.status(404).json({ message: 'User not found' })
    }

    const message = await Message.create({
      senderId: req.user._id,
      receiverId: userId,
      text: req.body.text || '',
      image: req.body.image || '',
    })
    const responseMessage = publicMessage(message)

    const receiverSocketId = userSocketMap.get(userId)
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('newMessage', responseMessage)
    }

    res.status(201).json(responseMessage)
  } catch (error) {
    console.error('Send message error:', error)
    res.status(500).json({ message: 'Failed to send message' })
  }
})

io.on('connection', (socket) => {
  const { userId } = socket.handshake.query

  if (userId) {
    userSocketMap.set(userId, socket.id)
    io.emit('getOnlineUsers', [...userSocketMap.keys()])
  }

  socket.on('disconnect', () => {
    if (userId) {
      userSocketMap.delete(userId)
      io.emit('getOnlineUsers', [...userSocketMap.keys()])
    }
  })
})

const startServer = async () => {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('MongoDB connected')

    server.listen(PORT, () => {
      console.log(`Backend running on http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('MongoDB connection failed:', error.message)
    process.exit(1)
  }
}

startServer()
