const {Banner} = require('../../models');
const fs = require('fs');
const path = require('path')
const {banner} = require("./index");


module.exports = {
    //광고 배너 추가하기
    post: async (req, res) => {
        const banner_image = req.file.filename;
        const {banner_url} = req.body;

        console.log(req.file);
        console.log(banner_image);

        try {
            //배너 이미지 있을 때,
            if (banner_image && banner_url) {
                const {host} = req.headers;
                const imagePath = `http://${host}/${banner_image}`;

                let banner = await Banner.create({
                    image: imagePath,
                    url: banner_url
                });

                return res.status(200).json({
                    message: "배너가 추가 되었습니다.",
                    data: {banner},
                })

            }
            //배너 이미지가 없거나 배너 url이 없을 때 ,
            if (!banner_image) {
                return res.status(404).json({message: "배너 이미지가 없습니다!"});
            }
            if (!banner_url) {
                return res.status(404).json({message: "배너 url이 없습니다!"});
            }
        } catch (err) {
            console.log(err);
        }
    },
    //광고 배너 불러오기
    get: async(req,res)=>{
       //모든 광고 리스트들 불러오기
        try{
            const bannerList = await Banner.findAll({});

            let bannerArray=[]
            bannerList.map((el)=>{
                bannerArray.push(el.dataValues);
            })
            return res.status(200).json({
                banner_list: bannerArray
            })
        } catch(err){
            console.log(err);
        }

    },


    //광고 배너 수정하기
    put: async (req, res) => {
        const {host} = req.headers;
        const {bannerId} = req.params;

        console.log(bannerId);

        let banner_image = req.file.filename;
        let {banner_url} = req.body;


        //기존의 데이터베이스 찾기
        const oldBanner = await Banner.findOne({
            attributes: ['image'],
            where: {id: bannerId}
        });

        console.log(oldBanner, '오래된 배너 ');

        //기존의 배너가 있는 곳일 때,
        try {
            if (oldBanner) {
                let imageName = oldBanner.dataValues.image.slice(22);

                console.log(imageName, '이미지 이름');

                if (fs.existsSync(path.join(__dirname, '..', '..', 'banner_img', `${imageName}`))) {
                    try {
                        fs.unlinkSync(path.join(__dirname, '..', '..', 'banner_img', `${imageName}`));
                    } catch (err) {
                        console.log('multer Err');
                        console.log(err);
                    }
                }

                let imagePath = `http://${host}/${banner_image}`;

                await Banner.update({image: imagePath, url: banner_url}, {where: {id: bannerId}});

                return res.status(200).json({
                    message: "배너가 변경 되었습니다.", data: {
                        banner_image: imagePath,
                        banner_url: banner_url,
                    }
                })
            }


        } catch (err) {
            console.log(err);
        }


    },

    delete: async (req, res) => {
        const {bannerId} = req.params;


        try {
            const banner_image = await Banner.findOne({
                attributes: ['image'],
                where: {id: bannerId}
            });
            if (banner_image) {
                const filename = banner_image.dataValues.image.slice(22);

                console.log(filename, '이미지 이름');
                if (fs.existsSync(path.join(__dirname, '..', '..', 'banner_img', `${filename}`))) {
                    try {
                        fs.unlinkSync(path.join(__dirname, '..', '..', 'banner_img', `${filename}`));
                    } catch (err) {
                        console.log('multer Err');
                        console.log(err);
                    }
                }

                //파일 삭제 후 db 삭제

                await Banner.destroy({
                    where: {id: bannerId}
                });

                return res.status(200).json({message: "배너가 삭제 되었습니다."})

            }

        } catch (err) {
            return res.status(404).json({message: "데이터가 없습니다."});

        }

    },


}