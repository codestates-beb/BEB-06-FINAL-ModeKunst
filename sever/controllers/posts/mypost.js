const fs = require('fs');

module.exports = {

    // 게시물 작성
    post: async (req, res) => {
        if(req.files.length <= 2){
            req.files.map((file) => {
                console.log(fs.existsSync("/Users/jangsam/Desktop/project/final/BEB-06-FINAL-ModeKunst/sever/post_img"))
                // if(fs.existsSync('../../post_img'+file.filename)){
                //     console.log(1);
                //     try{
                //         fs.unlinkSync('../../post_img'+file.filename)
                //     } catch (e) {
                //         console.log('multer Err');
                //         console.log(e);
                //     }
                // }
            })
        }else{

        }
    },

    // 디테일 페이지
    get: async (req, res) => {

    },

    // 게시물 수정
    put: async (req, res) => {

    },

    // 게시물 삭제
    delete: async (req, res) => {

    }
}