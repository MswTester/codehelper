import express from 'express';
import {createServer} from 'http'
import multer from 'multer'
import { Socket, Server } from 'socket.io';

const app = express();
const server = createServer(app);
const socket = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true
    }
});

const port = 8080

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename(req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({storage: storage})

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

app.post('/upload', upload.array('file'), (req, res) => {
    res.send('ok')
})

socket.on('connection', (socket: Socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(port, () => {
  console.log(`listening on *:${port}`);
});
