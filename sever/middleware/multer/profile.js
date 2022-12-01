function getNow() {
  let now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  let date = now.getDate();
  let day = now.getDay();
  let hours = now.getHours();
  let min = now.getMinutes();
  let sec = now.getSeconds();

  return `${year}${month}${date}${day}_${hours}${min}${sec}`;
}

let multer = require("multer");
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./profile_img"); //파일 저장 공간
  },
  filename: function (req, file, cb) {
    console.log(file);
    cb(null, `${getNow()}_${file.originalname}`); //파일명
  },
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});

module.exports = {
  profile_upload: multer({ storage: storage }),
  getNow,
};
