
const router = require('express').Router();
const {adminController} = require('../controllers');
const {notice_upload} = require('../middleware/multer/notice');
const {banner_upload} = require('../middleware/multer/banner');
const {nft_upload} = require('../middleware/multer/nft');
const {isLoggedIn, isNotLoggedIn} = require("../middleware/auth");


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
//서버 관리자 공지 get
router.get("/notice/:noticeId", isLoggedIn, adminController.notice.get);
//서버 관리자 공지 업데이트
router.put(
  "/notice/:noticeId",
  isLoggedIn,
  notice_upload.array("notice_image"),
  adminController.notice.put
);
//서버 관리자 공지 delete
router.delete("/notice/:noticeId", isLoggedIn, adminController.notice.delete);

//서버 관리자 공지 리스트 불러오기
router.get("/notice", adminController.notice.getAllList);

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

//관리자 데이터 불러오기
router.get("/data", isLoggedIn,adminController.data.get);
//nft 민팅하기
router.post("/nftmint",isLoggedIn,nft_upload.single("nft_image"),adminController.nft.nftmint);
//관리자 nftlist 불러오기
router.get("/nftlist",isLoggedIn,adminController.nft.nftlist);


//사용자 페널티
router.post('/penalty/:nickname',adminController.penalty.penalty);

//사용자 페널티 취소
router.post('/penaltycancel/:nickname',adminController.penalty.cancelpenalty);

//사용자 리포트 리스트
router.get('/report',adminController.penalty.reportlist);

//사용자 페널티 알람
router.get('/penaltyalarm',adminController.penalty.penaltyalarm);


module.exports= router;

