const express = require("express");
const cors = require("cors");
const multer = require("multer");
const FtpDeploy = require("ftp-deploy");

const ftpDeploy = new FtpDeploy();

const config = {
  user: "u103150605-extdev",
  // Password optional, prompted if none given
  password: "Aldebaran*Iffp*9",
  host: "access853840764.webspace-data.io",
  port: 22,
  localRoot: __dirname + "/assets/videos",
  remoteRoot: "/extdev/",
  // include: ["*", "**/*"],      // this would upload everything except dot files
  include: ["*", "**/*"],
  // e.g. exclude sourcemaps, and ALL files in node_modules (including dot files)
  exclude: [
    "dist/**/*.map",
    "node_modules/**",
    "node_modules/**/.*",
    ".git/**",
  ],
  // delete ALL existing files at destination before uploading, if true
  deleteRemote: false,
  // Passive mode is forced (EPSV command is not sent)
  forcePasv: true,
  // use sftp or ftp
  sftp: true,
};

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./assets/videos");
  },
  filename: function (req, file, callback) {
    callback(null, `recorded_video${Date.now()}.mp4`);
  },
});

const upload = multer({ storage: storage });

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3002;

app.post("/", upload.single("image"), function (req, res, next) {
  ftpDeploy
    .deploy(config)
    .then((response) => console.log("finished:", response))
    .catch((err) => console.log(err));
});

app.listen(PORT, () => {
  console.log("Server running on " + PORT);
});
