import express from "express";
import { connectDB } from "./database/dbConnection.js";
// importing routes
import userRouter from "./routes/user.js";
// importing cors for cross origin policices
import cors from "cors";

// variables
const PORT = 5000;
// creating an app of express
const app = express();

// connecting to the database
connectDB();

// middelwares
// app.use(cors());
app.use(
  cors({
    origin: "http://192.168.113.142:8081", // replace with your React Native app's domain
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.use(express.json());

// routes
app.use("/api/users", userRouter);

// creating a server
app.listen(PORT, () => {
  console.log("Server started on port", PORT);
});
