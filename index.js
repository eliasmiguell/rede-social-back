import express from 'express';
import bodyParser from'body-parser';
import cors from 'cors';
import userRouter from './routes/users.js';
import authRouter from './routes/auth.js';
import postRouter from './routes/post.js';
import uploadRouter from './routes/upload.js';
import comentRouter from './routes/coment.js';
import likeRouter from './routes/like.js';
import friendshipRouter from './routes/friendship.js';
import searchRouter from './routes/search.js';
import conversationRouter from './routes/conversations.js';
import messageRouter from './routes/message.js'
import notificationRouter from './routes/notification.js'
import cookieParser from 'cookie-parser';
import { runMigrations } from './migrations/migrationRunner.js';
import { runSeeders } from './seeders/seedRunner.js';

const port = process.env.PORT || 8000;
const app = express();
const corsOptions = {
  origin:['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders:[
    "Content-Type",
    'Authorization',
    "Acess-Control-Allow-Credentials"
  ]
};


app.use(express.json())
app.use(cors(corsOptions));
app.options('*', cors(corsOptions))
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
app.use('/api/users/', userRouter);
app.use('/api/auth/', authRouter);
app.use('/api/post/', postRouter);
app.use('/api/upload/', uploadRouter);
app.use('/api/coment/', comentRouter);
app.use('/api/like/', likeRouter);
app.use('/api/friendship/', friendshipRouter);
app.use('/api/search/', searchRouter);
app.use('/api/conversation/', conversationRouter);
app.use('/api/messagens/', messageRouter);
app.use('/api/notifications/', notificationRouter);



// Função para inicializar o servidor
const startServer = async () => {
  try {
    // Executa as migrations antes de iniciar o servidor
    console.log('🔄 Executando migrations do banco de dados...');
    await runMigrations();
    
    // Executa os seeders para criar dados de teste
    console.log('🌱 Executando seeders para dados de teste...');
    await runSeeders();
    
    // Inicia o servidor
    app.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('💥 Erro ao inicializar o servidor:', error);
    process.exit(1);
  }
};

startServer();
