import express from "express";
import dotenv from "dotenv";
import fs from "fs";
import cors from "cors";


// creating instance of express
const app = express();

// configating env
dotenv.config();

const PORT = process.env.PORT || 8000;

//parse the request body
app.use(express.json());
app.use(cors());

/* POST method */
app.post("/user/add", (req, res) => {
  //get the existing user data
  const existUsers = getUserData();

  //get the new user data from post request
  const userData = req.body;

  //check if the userData fields are missing
  if (
    userData.name == null ||
    userData.email == null ||
    userData.age == null ||
    userData.phone == null ||
    userData.depertment == null
  ) {
    return res.status(401).send({ error: true, msg: "User data missing" });
  }

  //check if the user exist already
  const findExist = existUsers.find((user) => user.email === userData.email);
  if (findExist) {
    return res
      .status(409)
      .send({ error: true, msg: "user with this email already exist" });
  }

  //append the user data
  existUsers.push(userData);

  //save the new user data
  saveUserData(existUsers);
  res.send({ success: true, msg: "User data added successfully" });
});

/*GET method */
app.get("/user/list", (req, res) => {
  const users = getUserData();
  res.send(users);
});

/* Update - Patch method */
app.patch("/user/update/:email", (req, res) => {
  //get the user from url
  const email = req.params.email;

  //get the update data
  const userData = req.body;

  //get the existing user data
  const existUsers = getUserData();

  //check if the user exist or not
  const findExist = existUsers.find((user) => user.email === email);
  if (!findExist) {
    return res.status(409).send({ error: true, msg: "user does not exist" });
  }

  //filter the userdata
  const updateUser = existUsers.filter((user) => user.email !== email);

  //push the updated data
  updateUser.push(userData);

  //save it
  saveUserData(updateUser);

  res.send({ success: true, msg: "User data updated successfully" });
});

/*Delete method */
app.delete("/user/delete/:email", (req, res) => {
  const email = req.params.email;

  //get the existing userdata
  const existUsers = getUserData();

  //filter the userdata to remove it
  const filterUser = existUsers.filter((user) => user.email !== email);

  if (existUsers.length === filterUser.length) {
    return res.status(409).send({ error: true, msg: "user does not exist" });
  }

  //save the filtered data
  saveUserData(filterUser);

  res.send({ success: true, msg: "User removed successfully" });
});

//read the user data from text file
const saveUserData = (data) => {
  const stringifyData = JSON.stringify(data);
  fs.writeFileSync("store.txt", stringifyData);
};

//get the user data from text file
const getUserData = () => {
  const jsonData = fs.readFileSync("store.txt");
  return JSON.parse(jsonData);
};

//configure the server port
app.listen(PORT, () => {
  console.log(`Server runs on port ${PORT}`);
});
