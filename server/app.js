const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const path = require("path");

var corsOptions = {
  origin: "*", // restrict calls to those this address
};
// NEW - replace custom middleware with the cors() middleware
app.use(cors());

app.use(express.json());
//sequealize
const db = require("./models");
db.sequelize.sync();
//below line used to drop existing databse and create new everytime server starts
// db.sequelize.sync({force:true}).then(()=>{
//     console.log("Drop and re-sync db.");
// });
//routes
require("./routes/user.routes")(app);
require("./routes/post.routes")(app);

//catch all
app.get("*", (req, res) => {
  return res.status(404).send({
    dummyUsers: {
      username1: "ritesh",
      email1: "ritesh@gmail.com",
      password1: "12345",
      username2: "ram",
      email2: "ram@gmail.com",
      password2: "12345",
    },
    url: "https://reunion111.herokuapp.com/ ",
  });
});
app.listen(process.env.PORT || 8080, () => {
  console.log("Server is runnng at port", process.env.PORT);
});
