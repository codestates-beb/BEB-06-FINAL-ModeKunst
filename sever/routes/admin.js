const router = require("express").Router();
const { adminController } = require("../controllers");
const { notice_upload } = require("../middleware/multer/notice");
const { isLoggedIn } = require("../middleware/auth");

//서버 관리자 회원가입
router.post("/signup", adminController.signup.post);
//서버 관리자 로그인
router.post("/login", adminController.login.post);
//서버 관리자 공지 post
router.post(
  "/notice",
  isLoggedIn,
  notice_upload.array("notice_image"),
  adminController.notice.post
);
//서버 관리자 공지 delete
router.delete("/notice/:noticeId", adminController.notice.delete);

module.exports = router;
