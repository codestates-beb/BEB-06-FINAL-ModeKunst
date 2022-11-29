const router = require("express").Router();
const { adminController } = require("../controllers");
const { notice_upload } = require("../middleware/multer/notice");
const { banner_upload } = require("../middleware/multer/banner");
const { isLoggedIn, isNotLoggedIn } = require("../middleware/auth");

//서버 관리자 회원가입
router.post("/signup", isNotLoggedIn, adminController.signup.post);
//서버 관리자 로그인
router.post("/login", isNotLoggedIn, adminController.login.post);
//서버 관리자 로그아웃
router.get("/logout", isLoggedIn, adminController.logout.get);

//서버 관리자 공지 post
router.post(
  "/notice",
  isLoggedIn,
  notice_upload.array("notice_image"),
  adminController.notice.post
);
//서버 관리자 공지 delete
router.delete("/notice/:noticeId", isLoggedIn, adminController.notice.delete);
//서버 관리자 배너 추가
router.post(
  "/banner",
  isLoggedIn,
  banner_upload.single("banner_image"),
  adminController.banner.post
);
//서버 관리자 배너 수정
router.put(
  "/banner/:bannerId",
  isLoggedIn,
  banner_upload.single("banner_image"),
  adminController.banner.put
);
//서버 관리자 배너 불러오기
router.get("/banner", isLoggedIn, adminController.banner.get);
//서버 관리자 배너 삭제하기
router.delete("/banner/:bannerId", isLoggedIn, adminController.banner.delete);

//

module.exports = router;
