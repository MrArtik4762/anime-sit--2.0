import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import http from "http";
import { Server } from "socket.io";
import animeRoutes from "./routes/anime.js";

// Загрузка переменных окружения
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
  }
});
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));

// Подключение к MongoDB
mongoose.connect(process.env.MONGO_URI, { dbName: "animeDB" })
  .then(() => console.log("✅ Подключено к MongoDB Atlas"))
  .catch((e) => console.error("❌ Ошибка MongoDB:", e.message));

// Модели данных
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 20
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  avatar: {
    type: String,
    default: '/placeholder.jpg'
  },
  theme: {
    type: String,
    enum: ['light', 'dark', 'system'],
    default: 'system'
  },
  privacy: {
    profileVisible: {
      type: Boolean,
      default: true
    },
    favoritesVisible: {
      type: Boolean,
      default: true
    }
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true
});

const FavoriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  titleId: {
    type: Number,
    required: true
  },
  title: {
    type: Object,
    required: true
  }
}, {
  timestamps: true
});

const WatchLaterSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  titleId: {
    type: Number,
    required: true
  },
  title: {
    type: Object,
    required: true
  }
}, {
  timestamps: true
});

const CommentSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  animeId: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  likes: {
    type: Number,
    default: 0
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Индексы для производительности
CommentSchema.index({ animeId: 1, createdAt: -1 });
CommentSchema.index({ userId: 1 });
CommentSchema.index({ id: 1 });

const User = mongoose.model('User', UserSchema);
const Favorite = mongoose.model('Favorite', FavoriteSchema);
const WatchLater = mongoose.model('WatchLater', WatchLaterSchema);
const Comment = mongoose.model('Comment', CommentSchema);

// JWT Middleware
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Admin Middleware
const isAdmin = (req, res, next) => {
  User.findById(req.user.userId)
    .then(user => {
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
      }
      next();
    })
    .catch(err => {
      console.error('Admin check error:', err);
      res.status(500).json({ message: 'Server error' });
    });
};

// Настройка multer для загрузки аватаров
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/avatars');
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user.id}-${Date.now()}${file.originalname}`);
  }
});

const upload = multer({ storage });

// Регистрация
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Проверка существующего пользователя
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 12);

    // Создание пользователя
    const user = new User({
      username,
      email,
      password: hashedPassword
    });

    await user.save();

    // Создание JWT токена
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    // Установка httpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 дней
    });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        theme: user.theme
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Вход
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Поиск пользователя
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Проверка пароля
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Создание JWT токена
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    // Установка httpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 дней
    });

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        theme: user.theme
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Выход
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  res.json({ message: 'Logout successful' });
});

// Получение профиля
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Обновление профиля
app.put('/api/profile', authenticateToken, async (req, res) => {
  try {
    const { username, theme, privacy } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Обновление полей
    if (username) user.username = username;
    if (theme) user.theme = theme;
    if (privacy) user.privacy = { ...user.privacy, ...privacy };

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        theme: user.theme,
        privacy: user.privacy
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Загрузка аватара
app.post('/api/profile/avatar', authenticateToken, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.avatar = `/uploads/avatars/${req.file.filename}`;
    await user.save();

    res.json({
      message: 'Avatar uploaded successfully',
      avatar: user.avatar
    });
  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Получение избранного
app.get('/api/profile/favorites', authenticateToken, async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });

    res.json(favorites);
  } catch (error) {
    console.error('Favorites fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Добавление в избранное
app.post('/api/profile/favorites', authenticateToken, async (req, res) => {
  try {
    const { titleId, title } = req.body;

    // Проверка существования
    const existingFavorite = await Favorite.findOne({ 
      userId: req.user.userId, 
      titleId 
    });

    if (existingFavorite) {
      return res.status(400).json({ message: 'Title already in favorites' });
    }

    const favorite = new Favorite({
      userId: req.user.userId,
      titleId,
      title
    });

    await favorite.save();
    res.status(201).json({ message: 'Added to favorites' });
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Удаление из избранного
app.delete('/api/profile/favorites/:titleId', authenticateToken, async (req, res) => {
  try {
    const result = await Favorite.findOneAndDelete({
      userId: req.user.userId,
      titleId: req.params.titleId
    });

    if (!result) {
      return res.status(404).json({ message: 'Favorite not found' });
    }

    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Получение "Смотреть позже"
app.get('/api/profile/watchlater', authenticateToken, async (req, res) => {
  try {
    const watchLater = await WatchLater.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });

    res.json(watchLater);
  } catch (error) {
    console.error('Watch later fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Добавление в "Смотреть позже"
app.post('/api/profile/watchlater', authenticateToken, async (req, res) => {
  try {
    const { titleId, title } = req.body;

    // Проверка существования
    const existingWatchLater = await WatchLater.findOne({ 
      userId: req.user.userId, 
      titleId 
    });

    if (existingWatchLater) {
      return res.status(400).json({ message: 'Title already in watch later' });
    }

    const watchLater = new WatchLater({
      userId: req.user.userId,
      titleId,
      title
    });

    await watchLater.save();
    res.status(201).json({ message: 'Added to watch later' });
  } catch (error) {
    console.error('Add watch later error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Удаление из "Смотреть позже"
app.delete('/api/profile/watchlater/:titleId', authenticateToken, async (req, res) => {
  try {
    const result = await WatchLater.findOneAndDelete({
      userId: req.user.userId,
      titleId: req.params.titleId
    });

    if (!result) {
      return res.status(404).json({ message: 'Watch later item not found' });
    }

    res.json({ message: 'Removed from watch later' });
  } catch (error) {
    console.error('Remove watch later error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Socket.io подключение
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join anime', (animeId) => {
    socket.join(animeId);
    console.log(`User ${socket.id} joined anime ${animeId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Получение комментариев к аниме
app.get('/api/anime/:id/comments', async (req, res) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const comments = await Comment.find({ animeId: id })
      .populate('userId', 'username avatar')
      .populate('likedBy', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Comment.countDocuments({ animeId: id });

    res.json({
      comments,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        totalItems: total
      }
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Добавление комментария
app.post('/api/anime/:id/comments', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const comment = new Comment({
      id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: req.user.userId,
      animeId: id,
      text: text.trim()
    });

    await comment.save();
    await comment.populate('userId', 'username avatar');
    await comment.populate('likedBy', 'username');

    // Отправка уведомления всем, кто подключен к этому аниме
    io.to(id).emit('new comment', comment);

    res.status(201).json(comment);
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Редактирование комментария
app.put('/api/comments/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Проверка, что пользователь может редактировать только свои комментарии
    if (comment.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    comment.text = text.trim();
    await comment.save();
    await comment.populate('userId', 'username avatar');
    await comment.populate('likedBy', 'username');

    // Отправка обновленного комментария
    io.to(comment.animeId).emit('comment updated', comment);

    res.json(comment);
  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Удаление комментария
app.delete('/api/comments/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Проверка, что пользователь может удалять только свои комментарии
    if (comment.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const animeId = comment.animeId;
    await Comment.findByIdAndDelete(id);

    // Отправка уведомления об удалении
    io.to(animeId).emit('comment deleted', id);

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Лайк комментария
app.post('/api/comments/:id/like', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const userId = req.user.userId;
    const userIndex = comment.likedBy.indexOf(userId);

    if (userIndex > -1) {
      // Удаление лайка
      comment.likedBy.splice(userIndex, 1);
      comment.likes = Math.max(0, comment.likes - 1);
    } else {
      // Добавление лайка
      comment.likedBy.push(userId);
      comment.likes += 1;
    }

    await comment.save();
    await comment.populate('userId', 'username avatar');
    await comment.populate('likedBy', 'username');

    // Отправка обновленного комментария
    io.to(comment.animeId).emit('comment liked', comment);

    res.json(comment);
  } catch (error) {
    console.error('Like comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Админ API endpoints
app.get('/api/admin/users', authenticateToken, isAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    const query = search
      ? { $or: [{ username: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }] }
      : {};

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        totalItems: total
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/admin/users/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Запрет удаления самого себя
    if (userId === req.user.userId) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Удаление связанных данных
    await Favorite.deleteMany({ userId });
    await WatchLater.deleteMany({ userId });
    await Comment.deleteMany({ userId });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/admin/users/:id/role', authenticateToken, isAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User role updated successfully',
      user
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/admin/anime', authenticateToken, isAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    // Используем внешний API для получения аниме
    const response = await fetch(`${process.env.ANILIBRIA_API_URL || 'https://anilibria.top/api/v1'}/title/search?search=${encodeURIComponent(search)}&limit=${limit}&offset=${skip}`);
    const data = await response.json();
    
    res.json({
      data: data.list || [],
      pagination: {
        current: page,
        total: Math.ceil((data.list?.length || 0) / limit),
        totalItems: data.list?.length || 0
      }
    });
  } catch (error) {
    console.error('Get anime error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/admin/comments', authenticateToken, isAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const status = req.query.status || 'all'; // all, pending, approved

    const query = {};
    
    if (search) {
      query.$or = [
        { text: { $regex: search, $options: 'i' } },
        { 'userId.username': { $regex: search, $options: 'i' } }
      ];
    }

    const comments = await Comment.find(query)
      .populate('userId', 'username email')
      .populate('animeId', 'names')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Comment.countDocuments(query);

    res.json({
      comments,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        totalItems: total
      }
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/admin/comments/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const commentId = req.params.id;
    
    const comment = await Comment.findByIdAndDelete(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/admin/stats', authenticateToken, isAdmin, async (req, res) => {
  try {
    const [
      totalUsers,
      totalComments,
      totalFavorites,
      totalWatchLater,
      recentUsers,
      recentComments
    ] = await Promise.all([
      User.countDocuments(),
      Comment.countDocuments(),
      Favorite.countDocuments(),
      WatchLater.countDocuments(),
      User.find().sort({ createdAt: -1 }).limit(5).select('username email createdAt'),
      Comment.find().populate('userId', 'username').sort({ createdAt: -1 }).limit(5).select('text createdAt userId')
    ]);

    // Статистика за последние 7 дней
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const [
      newUsersLastWeek,
      newCommentsLastWeek
    ] = await Promise.all([
      User.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      Comment.countDocuments({ createdAt: { $gte: sevenDaysAgo } })
    ]);

    res.json({
      overview: {
        totalUsers,
        totalComments,
        totalFavorites,
        totalWatchLater
      },
      recent: {
        newUsersLastWeek,
        newCommentsLastWeek,
        recentUsers,
        recentComments
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Старый endpoint для обратной совместимости
app.post('/api/profile/comments', authenticateToken, async (req, res) => {
  try {
    const { titleId, content, rating } = req.body;

    const comment = new Comment({
      id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: req.user.userId,
      animeId: titleId.toString(),
      text: content
    });

    await comment.save();
    res.status(201).json({ message: 'Comment added successfully' });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Роуты аниме
app.use("/api/anime", animeRoutes);

// Запуск сервера
server.listen(PORT, () => {
  console.log(`🚀 Backend на порту ${PORT}`);
});