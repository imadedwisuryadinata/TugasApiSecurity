import User from './../models/user.js';
import express from 'express';
import Kasir from '../models/kasir.js';
import Conf from './../config.js';

import jwt from 'jsonwebtoken';

const kasirRouter = express.Router();


//add trx 
//route get/api/kasir/add
kasirRouter.post('/add', async(req, res)=> {
    try{
        const{
            username,
            jenis_transaksi,
            saldo,
        } = req.body;

        const newTrx = new Kasir({
            "username":username,
            "jenis_transaksi":jenis_transaksi,
            "saldo":saldo,
        });
        const createdTrx = await newTrx.save();
        res.status(201).json(createdTrx);
    }
    catch(error){
        res.status(500).json({
            error: error
        })
    }
})


//get data cashier by id
//route get/api/user/dataKasir
kasirRouter.get('/dataKasir/:id', async (req, res) => {
    
    const user = await User.findById(req.params.id);
    if(user){
        if(user.jabatan !== "2"){
            const kasir = await Kasir.find({});
            res.json(kasir)
        } else {
            res.status(201).json({"status":"Anda tidak berwenang"});
        };    

    }else {
        res.status(404).json({
            message: 'user not found'
        });
    }   


});


kasirRouter.post('/ambilUang', function(req, res) {
    //header apabila akan melakukan akses
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    //verifikasi jwt
    jwt.verify(token, Conf.secret, function(err, decoded) {
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      const jabatan = decoded.userx.jabatan;
      console.log(decoded);
      if(jabatan === '2' || jabatan === '1'){

            Kasir.create({
                "jenis_transaksi":""

            },function(err,user)
            {
            if(err) return res.status(500).send("There was a problem transaksi.")
            });

            res.status(200).send(`${decoded.userx.nama_belakang} Anda tidak memiliki wewnang mengambil uang`);
         }else{

            Kasir.create({
                "jenis_transaksi":""

            },function(err,user)
            {
            if(err) return res.status(500).send("There was a problem transaksi.")
            });
            res.status(200).send(`${decoded.userx.nama_belakang} Anda dapat mengambil uang`);
        }
    });
  })
;

  
kasirRouter.get('/lihatSaldo', async(req, res) => {
    //header apabila akan melakukan akses
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    //verifikasi jwt
    jwt.verify(token, Conf.secret, async(err, decoded) {
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      const jabatan = decoded.userx.jabatan;
      if (jabatan !== '2'){
        const kasir = await Kasir.find({});
        res.json(kasir)
      } else {
        res.status(201).json({"status":"Anda tidak berwenang"})
      }

    })


})


export default kasirRouter;