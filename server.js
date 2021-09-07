require("dotenv").config();
const express = require("express");
const cors = require("cors");
const server = express();
server.use(cors());
server.use(express.json());
const port = process.env.PORT;
const mongoose = require("mongoose");
const { default: axios } = require("axios");
mongoose.connect(`${process.env.mongo_link}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const ChoclateSchema = new mongoose.Schema({
  email: String,
  title: String,
  imageUrl: String,
});
const ChoclateModel = mongoose.model("Choclat", ChoclateSchema);

server.get("/", test);
function test(req, res) {
  res.send("all is goode");
}

// get data from api
server.get("/getallData", getAllData);
async function getAllData(req, res) {
  let data = await axios.get(
    "https://ltuc-asac-api.herokuapp.com/allChocolateData"
  );
  res.send(data.data);
}
//
// add data to favorit
server.post("/addDataToFav", addDataToFav);
function addDataToFav(req, res) {
  let { email, imageUrl, title } = req.body;
  let newChoco = new ChoclateModel({
    email: email,
    imageUrl: imageUrl,
    title: title,
  });
  newChoco.save();
}
//
// render fav choco
server.get("/getFavChoco", getFavChoco);
function getFavChoco(req, res) {
  let emailQuery = req.query.email;
  ChoclateModel.find({ email: emailQuery }, function (err, FavData) {
    if (err) {
      console.log("error when get favorit data");
    } else {
      console.log(FavData);
      res.send(FavData);
    }
  });
}

server.delete("/deleteDataFromFav", deleteDataFromFav);
function deleteDataFromFav(req, res) {
  console.log("inside Delet data");
  let id = req.query.id;
  let emailQuery = req.query.email;
  ChoclateModel.remove({ _id: id }, function (err, deleted) {
    if (err) {
      console.log("error ehen delete item from data");
    } else {
      console.log("item is deleted", deleted);
      ChoclateModel.find({ email: emailQuery }, function (err, FavData) {
        if (err) {
          console.log("error when get favorit data");
        } else {
          // console.log(FavData);
          res.send(FavData);
        }
      });
    }
  });
}
server.put("/updateDataOfChoco", updateDataOfChoco);
function updateDataOfChoco(req, res) {
  let email = req.body.email;
  let _id = req.body._id;
  let title = req.body.title;
  ChoclateModel.find({ _id: _id }, function (err, updateData) {
    if (err) {
      console.log("err when update data of choco");
    } else {
      updateData.title = title;
      updateData.save().then(() => {
        ChoclateModel.find({ email: emaill }, function (err, afterUpdata) {
          if (err) {
            console.log("error in getting data aftar update it");
          } else {
            res.send(afterUpdata);
          }
        });
      });
    }
  });
}

server.listen(port);
console.log("server is runing in port" + port);
