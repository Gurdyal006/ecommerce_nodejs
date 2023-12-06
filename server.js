import express from "express";
import colors from "colors";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// ===== file routes ====
import userRoutes from "./routes/userRoutes.js";

// ====== routes mongodb ====
import connectDb from "./config/db.js";

// dontenv config
dotenv.config();

// mongodb connection
connectDb();

const app = express();

// middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// api routes
app.use("/api/v1/user", userRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, (req, res) => {
  console.log(
    `server connection on port ${PORT} on ${process.env.NODE_ENV} mode`
      .bgMagenta.white
  );
});
