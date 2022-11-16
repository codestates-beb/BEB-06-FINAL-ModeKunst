const fs = require('fs');
const path = require('path');

const { Post, Product_name, Product_brand, Product_size } = require('../../models');

module.exports = {

    // 게시물 작성
    post: async (req, res) => {
        // 이미지가 3개 미만일 때 게시물 작성 안됨
        if(req.files.length <= 2){
            req.files.map((file) => {
                if(fs.existsSync(path.join(__dirname, '..', '..', 'post_img', `${file.filename}`))){
                //console.log(fs.existsSync(path.join(__dirname, '..', '..', 'post_img', `${file.filename}`)));;
                    try{
                        fs.unlinkSync(path.join(__dirname, '..', '..', 'post_img', `${file.filename}`));
                    } catch (e) {
                        console.log('multer Err');
                        console.log(e);
                    }
                }
            });
            res.status(404).json({
                message: '3개 이상의 사진을 등록 해주세요.'
            })
        }else{
            const { host } = req.headers;
            let imageList = [];
            req.files.map((file,i) => {
                imageList.push(file.path);
            });

            const imagePathList = imageList.map((image) => {
               return `http://${host}/${image}`;
            });

            const [image_1, image_2, image_3, image_4, image_5] = imagePathList;

            const { nickname, title, content, category } = req.body;
            // const { outer_brand, top_brand, pants_brand, shoes_brand, outer_name, top_name, pants_name, shoes_name, outer_size, top_size, pants_size, shoes_size } = req.body;

            try {
                const post = await Post.create({
                    image_1: image_1,
                    image_2: image_2,
                    image_3: image_3,
                    image_4: image_4,
                    image_5: image_5,
                    title: title,
                    content: content,
                    category: category,
                    UserNickname: nickname,
                });

                // 옷 정보
                // await Product_brand.create(
                //     {
                //         outer: outer_brand,
                //         top: top_brand,
                //         pants: pants_brand,
                //         shoes: shoes_brand,
                //     }
                // );
                // await Product_name.create(
                //     {
                //         outer: outer_name,
                //         top: top_name,
                //         pants: pants_name,
                //         shoes: shoes_name,
                //     }
                // );
                // await Product_size.create(
                //     {
                //         outer: outer_size,
                //         top: top_size,
                //         pants: pants_size,
                //         shoes: shoes_size,
                //     }
                // );

                res.status(200).json({
                    message: '게시물이 등록 되었습니다.'
                })
            } catch (e) {
                console.log('Sequelize err');
                console.log(e);
            }
        }
    },

    // 디테일 페이지
    get: async (req, res) => {

    },

    // 게시물 수정
    put: async (req, res) => {
        const { postid } = req.params;
        const { title, content, category } = req.body;
        // const files = req.files;
        
        // const images = await Post.findOne({
        //     attributes: ['image_1', 'image_2', 'image_3', 'image_4', 'image_5'],
        //     where: { id: postid}
        // });

        try {
            await Post.update(
                {title: title, content: content, category: category},
                {where: { id: postid }}
            );

            res.status(200).json({
                message: '게시물이 수정 되었습니다.'
            })
        } catch (e) {
            console.log('sequelize Err');
            console.log(e);
        }
    },

    // 게시물 삭제
    delete: async (req, res) => {
        const {postid } = req.params;
        const images = await Post.findOne({
            attributes: ['image_1', 'image_2', 'image_3', 'image_4', 'image_5'],
            where: { id: postid}
        });
        if(images){
            const imagePathList = Object.values(images.dataValues);

            const fileNames = imagePathList.map((path) => {
                if(path){
                    return path.slice(31);
                }
            });
            fileNames.map((name) => {
                if(name){
                    if(fs.existsSync(path.join(__dirname, '..', '..', 'post_img', `${name}`))){
                        try{
                            fs.unlinkSync(path.join(__dirname, '..', '..', 'post_img', `${name}`));
                        } catch (e) {
                            console.log('multer Err');
                            console.log(e);
                        }
                    }
                }
            });
            await Post.destroy({
                where : { id: postid }
            });
            await Product_brand.destroy({
                where : { id: postid }
            });
            await Product_name.destroy({
                where : { id: postid }
            });
            await Product_size.destroy({
                where : { id: postid }
            });

            res.status(200).json({
                message: '게시물이 삭제 되었습니다.'
            })
        }else{
            res.status(404).json({
                message: '없는 게시물 입니다.'
            })
        }

    }
}