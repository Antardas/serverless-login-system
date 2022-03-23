const mongoose = require("mongoose");
const connectDB = () => {
    console.log(process.env.URI)
  mongoose
    .connect(process.env.URI)
    .then((data) => {
      console.log("Database Connection established", data.connection.host);
    })
    .catch((err) => {
      console.error(err.message);
    });
};
module.exports = connectDB;
