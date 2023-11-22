"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const multer_1 = __importDefault(require("multer"));
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const socket = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true
    }
});
const port = 8080;
let contents = [];
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = (0, multer_1.default)({ storage: storage });
app.use('/uploads', express_1.default.static('uploads'));
app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
});
app.post('/upload', upload.array('files'), (req, res) => {
    res.send('ok');
});
socket.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('getContents', () => {
        socket.emit('contents', contents);
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});
server.listen(port, () => {
    console.log(`listening on *:${port}`);
});
//# sourceMappingURL=index.js.map