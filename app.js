const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Students = require("./models/student");
const Student = require("./models/student");

mongoose
  .connect("mongodb://127.0.0.1/testdb")
  .then(() => {
    console.log("成功連結");
  })
  .catch((e) => {
    console.log(e);
  });

//移位子，讓midddlewave都放在一起
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/students", async (req, res) => {
  try {
    let studentData = await Students.find({}).exec();
    return res.send(studentData);
  } catch (e) {
    return res.status(500).send("尋找資料時錯誤");
  }
});

//因為要用post 新增   app.use(express.json); app.use(express.urlencoded({ extended: true }));
app.post("/students", async (req, res) => {
  try {
    let { name, age, major, merit, other } = req.body;

    let newStudent = new Student({
      name,
      age,
      major,
      scholarship: {
        merit,
        other,
      },
    });
    let saveStudent = await newStudent.save();
    //把send做成一個物件
    return res.send({
      msg: "資料儲存成功",
      savedObject: saveStudent,
    });
  } catch (e) {
    return res.status(400).send("儲存資料時錯誤");
  }
});

app.listen(3000, () => {
  console.log("3000正在執行");
});
