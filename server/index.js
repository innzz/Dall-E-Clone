import * as dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

import express from "express";
import cors from "cors";
import connectDb from "./mongodb/connect.js";

import routes from "./routes/index.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));
app.set("view-engine", "ejs");

app.use("/api/v1/", routes);

app.get("/", async (req, res) => {
  res.send("Hello from Dall E");
});

const startServer = async () => {
  try {
    connectDb(process.env.MONGODB_URL);
    app.listen(8080, () =>
      console.log("Server has been started on PORT http://localhost:8080")
    );
  } catch (error) {
    console.log(error);
  }
};

startServer();
