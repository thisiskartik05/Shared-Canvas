
require('dotenv').config();

const express = require('express');
const authRoute = require('./routes/auth');
const cookieParser = require('cookie-parser');
const session = require('express-session');
require('./database');

const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);
const { v4: uuidV4 } = require('uuid');

const roomSet = new Map();
const boardroomSet = new Map();
app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(cookieParser());
app.use(express.static('public'));
app.set('view-engine' , 'ejs');

app.use(session({
    secret : process.env.SESSION_SECRET,
    resave : false,
    saveUninitialized : false
}));

const PORT = process.env.PORT || 3000;

app.use(authRoute);

app.use((req , res , next) => {
    const userDB = req.session.user;
    if (userDB)
    {
        if (userDB.verified){
            next();
        }
        else{
            return res.redirect('/verify');
        }
    }
    else{
        return res.redirect('/login');
    }
});

app.get('/' , (req, res) => {
    res.render("index.ejs" , {name: req.session.user.name});
});



app.get('/whiteboard' , (req , res) => {
    const boardId = uuidV4();
    boardroomSet.set(boardId , [0 , req.session.user.email, null]);
    res.redirect(`/whiteboard/${boardId}`);
});



app.post("/joinboard" , (req , res) => {
    return res.redirect(`/whiteboard/${req.body.code}`);
});


app.get('/whiteboard/:room', (req, res) => {
    const roomId = req.params.room;
    if (boardroomSet.has(roomId)){
        if (boardroomSet.get(roomId)[1] == req.session.user.email) return res.render("whiteboard-admin.ejs" , {roomId , name : req.session.user.name});
        res.render("whiteboard.ejs" , {roomId , name : req.session.user.name});
    }
    else res.status(404).render('notfound.ejs' , {msg : "Board invalid / expired!"});
});

app.get('*' , (req , res)=> {
    return res.status(404).render('notfound.ejs' , {msg : null});
});

io.on('connect', socket => {
    // Video call


    // Whiteboard
    socket.on('join-board' , (roomId , name) => {
        socket.join(roomId);
        const id = boardroomSet.get(roomId)[2];
        if (id) clearTimeout(id);
        boardroomSet.set(roomId , [boardroomSet.get(roomId)[0] + 1 , boardroomSet.get(roomId)[1] , null]);
        socket.broadcast.to(roomId).emit("notify", name);
        socket.on("draw" , (data) => {
            boardroomSet.set(roomId , [boardroomSet.get(roomId)[0] , boardroomSet.get(roomId)[1]]);
            socket.broadcast.to(roomId).emit('ondraw' , {startX : data.startX , startY : data.startY, x : data.x ,y : data.y, width: data.width , color: data.color});
        });
        socket.on("clearscreen" , ()=> {
            socket.broadcast.to(roomId).emit('clear');
        });
        socket.on('disconnect', () => {
            boardroomSet.set(roomId , [boardroomSet.get(roomId)[0] - 1 , boardroomSet.get(roomId)[1] , null]);
            if (boardroomSet.get(roomId)[0] <= 0){
                const id = setTimeout(()=> {boardroomSet.delete(roomId);} , 3600000);
                boardroomSet.set(roomId , [0 , boardroomSet.get(roomId)[1] ,  id]);
            }
        });

    });
});

server.listen(PORT , () => {
    console.log(`Listening on PORT ${PORT}`);
});

