import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { dbConnect } from "./database";
import userRouter from "./routers/users.router";
dbConnect();

const app = express();
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:4200"],
  })
);

app.use("/api/users", userRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("website served on http://localhost:" + port);
});
