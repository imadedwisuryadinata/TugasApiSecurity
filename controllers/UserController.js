import User from './../models/user.js';
import Kasir from './../models/kasir.js';
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Conf from './../config.js';


const userRouter = express.Router();

//add user
//route post/api/user/add
userRouter.post('/add', async(req, res)=> {
    try{
        const{
            nama_belakang,
            username,
            password,
            jabatan
        } = req.body;

        //melakukan hash
        var saltRounds = 10;
        const hashedPw = await bcrypt.hash(password, saltRounds);

        const newUser = new User({
            "nama_belakang":nama_belakang,
            "username":username,
            "password":hashedPw,
            "jabatan":jabatan
        });
        const createdUser = await newUser.save();
        res.status(201).json(createdUser);
    }
    catch(error){
        res.status(500).json({
            error: error
        })
    }
})


//get all user
//route get/api/user/dataUser
userRouter.get('/dataUser', async (req, res) => {
    const user = await User.find({}); //kosong => if([]) = true

    if(user){
        res.json(user)
    } else {
        res.status(404).json({
            message: 'user not found'
        });
    }
});


//@desc put update user
//@route put /api/user/login/:id
userRouter.put('/dataUser/:id', async (req, res) => {
    const { nama_belakang, username, password, jabatan } = req.body;

    const user = await User.findById(req.params.id);

    if(user){
        
        user.nama_belakang = nama_belakang;
        user.username = username;
        var saltRounds = 10;
        const hashedPw = await bcrypt.hash(password, saltRounds);
        user.password = hashedPw;
        user.jabatan = jabatan

        const updatedUser = await user.save();

        res.json(updatedUser);
    } else {
        res.status(404).json({
            message: 'user not found'
        })
    }

})


//melakukan pengecekan
//@desc get check token
//@route get /api/user/check
userRouter.get('/check', function(req, res) {
    //header apabila akan melakukan akses
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    //verifikasi jwt
    jwt.verify(token, Conf.secret, function(err, decoded) {
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      
      res.status(200).send(decoded);
    });
  });

;



//@desc post login
//@route post /api/user/login
userRouter.post('/login', async (req, res) => {
    try{

        const{
            username,
            password,
        } = req.body;
        
        const currentUser = await new Promise((resolve, reject) =>{
            User.find({"username": username}, function(err, user){
                if(err)
                    reject(err)
                resolve(user)
            })
        })
        
        //cek apakah ada user?
       if(currentUser[0]){
            //check password
            bcrypt.compare(password, currentUser[0].password).then(function(result) {
                if(result){
                    //proses token
                    const userx= currentUser[0];
                    console.log(userx);
                    var token = jwt.sign({userx},Conf.secret,
                        { 
                            expiresIn:24000
                        });
                        res.status(200).send({auth:true,token:token});

                    // if (currentUser[0].jabatan === "2"){
                    // //res.status(201).json(data);
                    // res.status(201).json({"status":"Anda masuk sebagai Kasir"});
                    // } else if (currentUser[0].jabatan === "1") {
                    //     res.status(201).json({"status":"Anda masuk sebagai Manager"});
                    // } else {
                    //     res.status(201).json({"status":"SELAMAT DATANG BOSS"});
                    // }
                    
                }
                else
                    res.status(201).json({"status":"wrong password."});
            });
        }
        else{
            res.status(201).json({"status":"username not found"});
        }

    }
    catch(error){
        res.status(500).json({ error: error})
    }
})


//delete user by id
//route delete/api/user/dataUser/:id
userRouter.delete('/dataUser/:id', async (req, res) => {
    const user = await User.findById(req.params.id);

    if(user){
        await user.remove();
        res.json({
            message: 'User removed'
        })
    } else {
        res.status(404).json({
            message: 'User not found'
        })
    }
})


export default userRouter;