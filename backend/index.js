const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const File = require("./fileModel");
require("dotenv").config();
const app = express();

const upload = multer({ dest: "uploads/" });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.set("view engine", "ejs");

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Database Connected"))
  .catch((e) => {
    e.message;
  });

app.post("/upload", upload.single("file"), async (req, res) => {
  console.log("Incoming request", req.headers.host, req.protocol);
  console.log("BASE_URL from environment:", process.env.BASE_URL);

  const filedata = {
    path: req.file.path,
    originalName: req.file.originalname,
  };

  if (req.body.text != null && req.body.text !== "") {
    filedata.password = await bcrypt.hash(req.body.text, 10);
  }

  try {
    const file = await File.create(filedata);
    res.status(200).json({ path: `${process.env.BASE_URL}/file/${file._id}` });
    console.log(file);
  } catch (err) {
    res.status(500).json({ errot: err.message });
    console.log(err.message);
  }
});

app.route("/file/:id").get(handleDownload).post(handleDownload);
app.get("/test", (req, res) => {
  res.send("<h1>test workingg!!</h1>");
});

async function handleDownload(req, res) {
  const file = await File.findById(req.params.id);

  if (file.password != null) {
    if (req.body.password == null) {
      res.render("password");
      return;
    }
    if (!(await bcrypt.compare(req.body.password, file.password))) {
      res.render("password", { error: true });
    }
  }

  res.download(file.path, file.originalName);
}
app.listen(process.env.PORT || 8080, () => {
  console.log("Server started on port 8080");
});
