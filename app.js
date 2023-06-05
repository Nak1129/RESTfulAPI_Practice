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

app.get("/students/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let foundStudent = await Students.find({ _id }).exec();
    return res.send(foundStudent);
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

app.put("/students/:_id", async (req, res) => {
  try {
    let { _id } = req.params;
    let { name, age, major, merit, other } = req.body;
    let newData = await Student.findOneAndUpdate(
      { _id },
      { name, age, major, merit, other },
      { new: true, runValidators: true, overwrite: true }
      //因為HTTP put request要求客戶端提供所有數據，所以
      //我們需要根據客戶端提供的數據，來更新資料庫內的資料
    );
    res.send({ msg: "成功更新學生資料!", updateData: newData });
  } catch (e) {
    res.status(400).send(e);
  }
});
app.listen(3000, () => {
  console.log("3000正在執行");
});
