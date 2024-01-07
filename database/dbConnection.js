import mongoose from "mongoose";

// mongoURL for the database
// const mongoURL = "mongodb://127.0.0.1:27017/SplitWise";
const mongoURL = "mongodb+srv://uttam:uttam@cluster0.jdkiwyi.mongodb.net/";

// function to connect to the database
export const connectDB = () => {
  mongoose
    .connect(mongoURL)
    .then((data) => {
      console.log("Connected to database...");
      console.log(data.connection.host);
      console.log(data.connection.name);
    })
    .catch((e) => {
      console.log(e);
      console.log("Err!!Not connected");
    });
};
