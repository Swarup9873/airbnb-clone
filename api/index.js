const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const download = require("image-downloader");
const multer = require("multer");
const fs = require("fs");
const nodemailer = require("nodemailer");
const uuid = require('uuid');
const path= require("path")
const User = require("./models/user");
const Place = require("./models/place");
const Booking = require("./models/bookedRoom");
const Verification =require("./models/verificationEmail")
require("dotenv").config();

const port = process.env.PORT || 3000;
const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecretKey = "adfdafdsghtmmmjk;tywq";

const emailConfig ={
  service: 'Gmail',
  auth:{
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.MAILER_PASS,
  }
};
const transporter = nodemailer.createTransport(emailConfig);

function generateVerificationCode(){
  return uuid.v4();
}

function addWildcards(str) {
  if (!str || str.trim() === '') {
    return '.*';
  }

  return '.*' + str.split('').join('.*') + '.*';
}

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

// var origin= 'https://airbnb-clone-d1iv.onrender.com'
var origin= 'http://localhost:5173'

app.use(
  cors({
    credentials: true,
    origin: origin,
  })
);

// const __dirname1 = path.resolve();
// console.log(__dirname1);
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname1, "../client/dist")));

//   app.get("*", (req, res) =>
//     res.sendFile(path.resolve(__dirname1, "../client", "dist", "index.html"))
//   );
// } else {
//   app.get("/", (req, res) => {
//     res.send("API is running..");
//   });
// }

app.get("/test", (req, res) => {
  res.json("test ok");
});

//bookingUser
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const sentData={};
  try {
    const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });
    sentData.user=userDoc;
  } 
  catch (e) {
    res.status(422).json(e);
    return;
  }

  const verificationCode = generateVerificationCode();
  Verification.create({
    email, verificationCode
  })
  .then((doc)=>{
    console.log("this is the file created: "+doc.email+doc.verificationCode);
    transporter.sendMail(
      {
        from: process.env.EMAIL_ADDRESS,
        to: email,
        subject: 'Email Verification',
        text: `Please click on the following link to verify your email: https://localhost:3000/api/verify/${verificationCode}`,
      },
      (error, info)=>{
        if(error){
          console.error('Error sending email:', error);
          sentData.message= 'Failed to send verification email.';
          res.status(500).json(sentData);
        } 
        else{
          console.log('Email sent:', info.response);
          sentData.message= 'Verification email sent successfully.';
          res.json({sentData});
        }
      }
    )  
  })
  .catch((error) => {
    console.error('Error creating verification entry:', error);
    sentData.message='Failed to create verification entry.' ;
    res.status(500).json(sentData);
  });

  
});

app.get('/api/verify/:code', (req, res) => {
  const { code } = req.params;
  console.log("verifying...")
  Verification.findOne({verificationCode:code})
  .then((data)=>{
    if(data){
      Verification.deleteOne({_id:data._id})
      .then((doc)=>{
        console.log(doc);
      })
      .catch((err)=>{
        console.log(err);
      });
      User.findOneAndUpdate({email: data.email},{verified:true})
      .then(() => {
        console.log('User updated successfully');
      })
      .catch((err) => {
        console.error('Failed to update user:', err);
      });
      res.json({ message: 'Email verified successfully.' })
    }
    else{
      res.status(400).json({message: "Wrong verification code"})
    }
  })
  .catch((err)=>{throw err});
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try{
    const userDoc = await User.findOne({ email });
    if (userDoc) {
      const passOk = bcrypt.compareSync(password, userDoc.password);
      if (passOk) {
        jwt.sign(
          {
            email: userDoc.email,
            id: userDoc._id,
          },
          jwtSecretKey,
          {},
          (err, token) => {
            if (err) throw err;
            res.cookie("token", token,{
              sameSite: 'none', // SameSite attribute
              secure: true,     // Secure flag, requires HTTPS
            }).json(userDoc);
          }
        );
      } else res.status(422).json("pass not ok");
    } else {
      res.status(404).json("Not found");
    }
  }
  catch(error){
    res.status(500).json("Db error");
  }
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecretKey, {}, async (err, userData) => {
      if (err) throw err;
      const { name, email, _id } = await User.findById(userData.id);
      res.json({ name, email, _id });
    });
  } else {
    res.json(null);
  }
});

app.post("/upload-by-link", (req, res) => {
  const { link } = req.body;
  const newName = "photo" + Date.now() + ".jpg";
  options = {
    url: link,
    dest: __dirname + "/uploads/" + newName, // will be saved to /path/to/dest/photo.jpg
  };

  download
    .image(options)
    .then(({ filename }) => {
      console.log("Saved to", filename); // saved to /path/to/dest/photo.jpg

      res.json(newName);
    })
    .catch((err) => console.error(err));
});

const photosMiddleWare = multer({ dest: "uploads/" });

app.post("/upload", photosMiddleWare.array("photos", 100), (req, res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, mimetype } = req.files[i];
    let [x, ext] = mimetype.split("/");
    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);
    uploadedFiles.push(newPath.replace("uploads\\", ""));
  }
  res.json(uploadedFiles);
});

app.post("/places", (req, res) => {
  const {
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuest,
    price,
  } = req.body;

  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecretKey, {}, (err, userData) => {
      if (err) throw err;
      Place.create({
        owner: userData.id,
        title,
        address,
        photos: addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuest,
        price,
      }).then((placeDoc) => {
        res.json(placeDoc);
      });
    });
  }
});

app.get("/user-places", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecretKey, {}, (err, userData) => {
      if (err) throw err;
      const { id } = userData;
      Place.find({ owner: id }).then((placesData) => {
        res.json(placesData);
      });
    });
  }
});

app.post("/placeSearch", (req,res) => {
  const searchString= req.body.searchString;
  const searchRegex= addWildcards(searchString);
  Place.find({ address: { $regex: searchRegex, $options: 'i' } })
    .then((placesData) => {
      res.json(placesData);
    })
    .catch((err) => {
      res.status(500).json("database error");
    });
});

app.get("/places/:id", (req, res) => {
  const { id } = req.params;
  Place.findById(id)
    .then((placeData) => {
      res.json(placeData);
    })
    .catch((err) => {
      res.status(404).json(err);
    });
});

app.put("/places", (req, res) => {
  const {
    id,
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuest,
    price,
  } = req.body;

  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecretKey, {}, (err, userData) => {
      if (err) return res.status(401).json({ error: "Invalid token" });
      Place.findById(id)
        .then((placeDoc) => {
          if (userData.id == placeDoc.owner) {
            placeDoc.set({
              title,
              address,
              photos: addedPhotos,
              description,
              perks,
              extraInfo,
              checkIn,
              checkOut,
              maxGuest,
              price,
            });
            placeDoc.save().then(() => {
              res.json("ok");
            });
          } else res.json("no such place exists");
        })
        .catch((err) => {
          // Handle any errors that occurred during the Place.findById operation
          res.status(500).json({ error: "Database error" });
        });
    });
  } else {
    // Token is not provided
    res.status(401).json({ error: "Unauthorized" });
  }
});

app.post("/booking", (req, res) => {
  const { place, checkIn, checkOut, numberOfGuests, price } = req.body;
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecretKey, {}, (err, userData) => {
      if (err) throw err;
      Booking.create({
        user: userData.id,
        place,
        checkIn,
        checkOut,
        numberOfGuests,
        price,
      })
        .then((bookedDoc) => {
          res.json(bookedDoc);
        })
        .catch((err) => {
          res.status(500);
        });
    });
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
});

app.get("/bookings", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecretKey, {}, (err, userData) => {
      if (err) throw err;
      const { id } = userData;
      Booking.find({ user: id })
        .populate("place")
        .then((doc) => {
          res.json(doc);
        })
        .catch(() => {
          res.status(500).json("db error");
        });
    });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
