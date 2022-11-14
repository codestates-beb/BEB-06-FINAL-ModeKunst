const router = require('express').Router();
const { postsController } = require('../controllers');

// 전체 게시물
router.get('/board', postsController.board.get);

// 게시물 작성
router.post('/board', postsController.board.post);

// 게시물 수정
router.put('/:postid', postsController.mypost.put);

// 게시물 삭제
router.delete('/:postid', postsController.mypost.delete);

// 디테일 페이지
router.get('/:postid', postsController.mypost.get);

// 상단 게시물 추가
router.post('/upstream', postsController.upstream.post);

// 좋아요
router.post('/like/:usernickname/:postid', postsController.like.post);

module.exports = router;