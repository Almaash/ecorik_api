const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const path = require("path");
const multer = require("multer");

const { static } = require('express');

const app = express();
app.use(express.json());
app.use(cors());
app.use('/uploads/', static('uploads'));

app.listen(8002,() =>{
    console.log('Running on Port 8002')
});



// -------------------- connection to database -----------------------------


const db = mysql.createConnection({
    'host' : 'localhost',
    'user' : 'root',
    'password' : '',
    'database' : 'hotel_ecorik'
});

db.connect(function(err){
    if(err){
        console.log('error')
    }else{
        console.log('connection successful !')
    }
});



// ---------------API for register the data to the databse --------------------------


app.post('/register',(req,res) =>{

    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const state = req.body.state;
    const language = req.body.language;
    const email = req.body.email;
    const phone_no = req.body.phone_no;
    const password = req.body.password;

    const values = [first_name,last_name,state,language,email,phone_no,password];
    const sql = "INSERT INTO `registeration` (`first_name`, `last_name`,`state`,`language`,`email`,`phone_no`,`password`) VALUES (?)";

    db.query(sql,[values],(err,data) =>{
        if(err){
            res.json(err);
        }else{
            res.json('record inserted successfully')
        }
    })
});


// Show all data

app.get('/showregister',(req,res) => {
    const sql='select * from registeration where `status`=1';

    db.query(sql,function(err,data){
        if(err){
            res.json(err);
        }else{
            res.json(data)
        }
    });
});


// Get single data

app.get('/singledataregister/:id',(req,res) =>{

    const id = req.params.id;
    const sql = 'select * from registeration where id=?';

    db.query(sql,[id],(err,data) =>{
        if(err){
            res.json(err);
        }else{
            res.json(data[0]);
        }
    });
});


// Delet the data (status = 0)


app.get('/singledataregister1/:id',(req,res) =>{

    const id = req.params.id;
    const status = 0;

    const sql = "update registeration set status=? where id=?";
    // res.json(sql);
    
    db.query(sql,[status,id],(err,data) =>{
        if(err){
            res.json(err);
        }else{
            res.json('data hidden or deleted successfully!!');
        }
    });

});


// Update the register data


app.put('/updatedataregister/:id',(req,res) =>{

    const id = req.params.id;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const state = req.body.state;
    const language = req.body.language;
    const email = req.body.email;
    const phone_no = req.body.phone_no;
    const password = req.body.password;

    const values = [first_name,last_name,state,language,email,phone_no,password];

    const sql = 'update registeration set first_name=?,last_name=?,state=?,language=?,email=?,phone_no=?,password=? where id=?';

    db.query(sql,[...values,id],(err,data) =>{
        if(err){
            res.json(err);
        }else{
            res.json('data updated')
        }
    });


});




// ------------ APIs for Homepage -------------------------------



app.get('/',(req,res) => {
    res.json('first page')
});



// ------------ APIs for Accommodation page -------------------------------


// ------------ Multer -------------------------------

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        return cb(null, "uploads");
    },
    filename: function(req, file, cb){
        return cb(null,`${Date.now()}-${file.originalname}`);
    },
});



const checkFileType = function (file, cb) {
    //Allowed file extensions
    const fileTypes = /jpeg|jpg|png|gif|svg/;
  
    //check extension names
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  
    const mimeType = fileTypes.test(file.mimetype);

    if (mimeType && extName) {
      return cb(null, true);
    } else {
      cb("Error: You can Only Upload Images!!");
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 },
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    },
});


app.post('/accommodation',upload.single("image"),(req,res) => {

    const room_title = req.body.room_title;
    const image = req.file.path;
    const room_desc = req.body.room_desc;
    const room_price = req.body.room_price;
    const review = req.body.review;

    console.log(image)
    
    const values = [room_title,image,room_desc,room_price,review];
    const sql = "INSERT INTO `accommodation` (`room_title`, `image`,`room_desc`,`room_price`,`review`) VALUES (?)";

    db.query(sql,[values],(err,data) =>{
        if(err){
            res.json(err);
        }else{
            res.json('record inserted successfully')
        }
    });

});


// Show all data


app.get('/showaccommodation',(req,res) => {
    const sql='select * from accommodation where `status`=1';

    db.query(sql,function(err,data){
        if(err){
            res.json(err);
        }else{
            res.json(data)
        }
    });
});

// ---------------- delet single data ----------------------------

app.get('/singledataaccomodation/:id',(req,res) =>{

    const id = req.params.id;
    const status = 0;

    const sql = "update accommodation set status=? where id=?";
    // res.json(sql);
    
    db.query(sql,[status,id],(err,data) =>{
        if(err){
            res.json(err);
        }else{
            res.json('data hidden or deleted successfully!!');
        }
    });

});


// Get single data

app.get('/singledataaccommodation/:id',(req,res) =>{

    const id = req.params.id;
    const sql = 'select * from accommodation where id=?';

    db.query(sql,[id],(err,data) =>{
        if(err){
            res.json(err);
        }else{
            res.json(data[0]);
        }
    });
});


// Update the register data----------------------------------------------------

app.put('/updateaccommodation/:id',upload.single("image"),(req,res) =>{

    const id = req.params.id;
    const room_title = req.body.room_title;
    const image = req.file.path;
    const room_desc = req.body.room_desc;
    const room_price = req.body.room_price;
    const review = req.body.review;

    const values = [room_title,image,room_desc,room_price,review];

    const sql = 'update accommodation set room_title=?,image=?,room_desc=?,room_price=?,review=? where id=?';

    db.query(sql,[...values,id],(err,data) =>{
        if(err){
            res.json(err);
        }else{
            res.json('data updated')
        }
    });


});



//---------------------------------------------------------------------

// ------------ APIs for Contact page -------------------------------



app.post('/contact',(req,res) =>{

    const name = req.body.name;
    const email = req.body.email;
    const subject = req.body.subject;
    const summary = req.body.summary;

    const values = [name,email,subject,summary];
    const sql = "INSERT INTO `contact` (`name`, `email`,`subject`,`summary`) VALUES (?)";

    db.query(sql,[values],(err,data) =>{
        if(err){
            res.json(err);
        }else{
            res.json('record inserted successfully')
        }
    });
});



// Show all data

app.get('/showcontact',(req,res) => {
    const sql='select * from contact where `status`=1';

    db.query(sql,function(err,data){
        if(err){
            res.json(err);
        }else{
            res.json(data)
        }
    });
});

// Delet the data (status = 0)


app.get('/singledatacontact/:id',(req,res) =>{

    const id = req.params.id;
    const status = 0;

    const sql = "update contact set status=? where id=?";
    // res.json(sql);
    
    db.query(sql,[status,id],(err,data) =>{
        if(err){
            res.json(err);
        }else{
            res.json('data hidden or deleted successfully!!');
        }
    });

});



//--------------------------------------------------------------------
// ------------ APIs for Login page -------------------------------



app.post('/login',(req,res) =>{

    const email = req.body.email;
    const password = req.body.password;
    const status = 1;

    const sql='select * from `registeration` where `email` = ? and `password` = ? and `status` = ?';

    const values = [email,password,status];

    db.query(sql,[...values],(err,data) => {
        if(err){
            res.json(err);
        }else{
            if(data==''){
                res.json({
                    message:'Login Failed',
                    userData:'',
                    status:'failed'
                });
            }else{
                if(password==data[0].password){

                    res.json({
                        message:"Logged in",
                        userData: data[0],
                        status:'success'
                    });

                }else{
                    res.json('Login Failed'); 
                }
            }
        }
    });

});


// -----------------------Admin section --------------------------------

// Show all data

app.get('/showadmin',(req,res) => {
    const sql='select * from admin where `status`=1';

    db.query(sql,function(err,data){
        if(err){
            res.json(err);
        }else{
            res.json(data)
        }
    });
});

// ---------------------------------------------------------------------------
// --------------- Booking room -------------------------------------

app.post('/bookingtable',(req,res) =>{

    const user_id = req.body.user_id;
    const room = req.body.room;
    const no_of_person = req.body.no_of_person;
    const checkin = req.body.checkin;
    const checkout = req.body.checkout;
    const payment_mode = req.body.payment_mode;
    const amount = req.body.amount;
    

    const values = [user_id,room,no_of_person,checkin,checkout,payment_mode,amount];
    const sql = "INSERT INTO `bookingtable` (`user_id`,`room`,`no_of_person`,`checkin`,`checkout`,`payment_mode`,`amount`) VALUES (?)";

    db.query(sql,[values],(err,data) =>{
        if(err){
            res.json(err);
        }else{
            res.json('record inserted successfully')
        }
    })
});

// Show all data

app.get('/showbookingtable',(req,res) => {
    const sql='select * from bookingtable where `status`=1';

    db.query(sql,function(err,data){
        if(err){
            res.json(err);
        }else{
            res.json(data)
        }
    });
});


// Get single data

app.get('/singlebookingtable/:id',(req,res) =>{

    const id = req.params.id;
    const sql = 'select * from bookingtable where id=?';

    db.query(sql,[id],(err,data) =>{
        if(err){
            res.json(err);
        }else{
            res.json(data[0]);
        }
    });
});


// Get each single data from each User_id

app.get('/eachbookingtable/:user_id',(req,res) =>{

    const user_id = req.params.user_id;
    const sql = 'SELECT * FROM `bookingtable` WHERE `user_id` = ?';

    db.query(sql,[user_id],(err,data) =>{
        
        if(err){
            res.json(err);
        }else{
            res.json(data);
        }
    });
});