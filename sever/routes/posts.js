const router = require("express").Router();
const { post_upload } = require("../middleware/multer/post");
const { postsController } = require("../controllers");
const { isLoggedIn, isNotLoggedIn } = require("../middleware/auth");

// 배너 & 상단 게시물
router.get('/other', postsController.board.other);

// 전체 게시물
router.get("/main", postsController.board.main);

// 게시물 작성
router.post(
    "/board",
    isLoggedIn,
    post_upload.array("image"),
    postsController.post.post
);

// 게시글 수정창
router.get("/updatePost/:postId", postsController.post.updatePost);

// 게시물 수정
router.put("/:postId", post_upload.array("image"), postsController.post.put);

// 게시물 삭제
router.delete("/:postId", postsController.post.delete);

// 리뷰 수정창
router.post("/updatePost/:postId", postsController.post.updatePost);

// 디테일 페이지
router.get("/:postId", postsController.post.get);

// 상단 게시물 추가
router.post("/upstream", postsController.upstream.post);

// 좋아요
router.post("/like/:postId", isLoggedIn, postsController.like.like);

// 좋아요 취소
router.post("/unlike/:postId", isLoggedIn, postsController.like.unlike);

// 리뷰 작성
router.post("/review/:postId", isLoggedIn, postsController.review.post);

// 리뷰 수정
router.put("/review/:postId", postsController.review.put);

// 리뷰 삭제
router.delete("/review/:postId", postsController.review.delete);

// 검색
router.get("/search/:name", postsController.search.search);

//리뷰 목록
router.get("/review/:postId", postsController.review.get);

module.exports = router;
