const router = require("express").Router();
const { usersController } = require("../controllers");
const { profile_upload } = require("../middleware/multer/profile");
const { limiter } = require('../middleware/limiter'); // DOS 공격 대비
const { isLoggedIn } = require("../middleware/auth");
const { addFollowing, removeFollower } = require("../middleware/follow");

// 회원 가입
router.post("/signup", profile_upload.single("profile_image"), usersController.signup.post);

// // 닉네임 검증
router.get("/checkNickname/:nickname", usersController.check.nickname);

// //인증번호 전송 ( email )
router.get("/sendEmail/", usersController.send.email);

// //인증번호 검증 ( email )
router.post("/checkEmail", usersController.check.email);

// // 인증번호 전송 ( sms )
router.get("/sendSms/", usersController.send.sms);

// // 인증번호 검증 ( sms )
router.post("/checkSms", usersController.check.sms);

// 이메일 찾기
router.get("/emailfind/:nickname/:phonenumber", usersController.find.email);

// 비밀번호 찾기
router.get("/pwfind/:email/:phonenumber", usersController.find.password);

//로그인
router.post("/login", usersController.login.post);

//보유 토큰 양
router.get("/tokens/:nickname", usersController.tokens.get);

//팔로잉
router.post("/:nickname/follow", isLoggedIn, addFollowing);

//언팔로우
router.post("/:nickname/unfollow", isLoggedIn, removeFollower);

// 마이 페이지
router.get("/mypage/:usernickname", isLoggedIn, usersController.mypage.get);

// 유저 정보 수정
router.post("/update", profile_upload.single("image"), usersController.update.post);

// 비밀번호 확인
router.post("/pwcheck", isLoggedIn, usersController.pwcheck.post);

// 비밀번호 수정
router.post("/:email/pwupdate", usersController.pwupdate.post);

//로그아웃
router.get("/logout", isLoggedIn, usersController.logout.get);

//회원탈퇴
router.delete("/deluser", isLoggedIn, usersController.delete.delete);

module.exports = router;
