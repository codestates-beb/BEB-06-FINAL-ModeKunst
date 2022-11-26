const {Notice} = require('../../models');
const fs = require('fs');
const path = require('path');

module.exports = {
    //공지 작성
    post: async(req,res)=>{

        const AdminSession = req.session.user;//관리자의 세션 정보
        const nickname = AdminSession.nickname;


        try{
            //파일이 있을 때,
            if(req.files){
                const {host} = req.headers;
                let imageList = [];
                req.files.map((file,idx)=>{
                    imageList.push(file.path);
                });

                const imagePathList = imageList.map((image)=>{
                    return `http://${host}/${image}`;
                });

                const [image_1,image_2,image_3,image_4,image_5] = imagePathList;


                let {title,content} = req.body;

                let notice =await Notice.create({
                    image_1: image_1,
                    image_2: image_2,
                    image_3: image_3,
                    image_4: image_4,
                    image_5: image_5,
                    title: title,
                    content: content,
                    AdminNickname: nickname,
                })

                return res.status(200).json({
                    message:"공지를 등록했습니다.",
                    data:{
                        noticeId : notice.dataValues.id,
                        admin_nickname:notice.dataValues.AdminNickname,
                        title:notice.dataValues.title,
                        content:notice.dataValues.content,

                    }
                })

            }
            //파일이 없을 때,
            if(!req.files){

                let {title,content} = req.body;

                let notice = await Notice.create({
                    title: title,
                    content: content,
                    AdminNickname: nickname,
                })

                return res.status(200).json({
                    message:"공지를 등록했습니다.",
                    data:{
                        noticeId : notice.dataValues.id,
                        admin_nickname:notice.dataValues.AdminNickname,
                        title:notice.dataValues.title,
                        content:notice.dataValues.content,

                    }
                })

            }

        }catch(err){
            console.log(err);
        }

    },
    //공지 삭제

    delete: async(req,res)=>{
        const {noticeId} = req.params;
        const images = await Notice.findOne({
            attributes:['image_1','image_2','image_3','image_4','image_5'],
            where:{id: noticeId}
        });
        try{
            if(images){
                const imagePathList = Object.values(images.dataValues);

                const fileNames = imagePathList.map((path)=>{
                    if(path){
                        return path.slice(33)
                    }
                })
                console.log(fileNames);//파일네임 확인

                fileNames.map((name)=>{
                    if(name){
                        if(fs.existsSync(path.join(__dirname,'..','..','notice_img',`${name}`))){
                            try{
                                fs.unlinkSync(path.join(__dirname,'..','..','notice_img',`${name}`));
                            }catch(err){
                                console.log(err);
                            }
                        }
                    }
                })

            }
            await Notice.destroy({
                where: {id: noticeId}
            });

            return res.status(200).json({
                message:"공지가 삭제되었습니다."
            });

        }catch(err){
            console.log(err);
        }
        //이미지가 있다면,


        }
}

