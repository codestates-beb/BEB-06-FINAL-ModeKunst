const {Notice} = require('../../models');
const fs = require('fs');
const path = require('path');
const Console = require("console");

module.exports = {
    //공지 작성
    post: async (req, res) => {

        const AdminSession = req.session.user;//관리자의 세션 정보
        const nickname = AdminSession.nickname;
        //토큰 가격
        let {token_price} = req.body;



        try {
            //파일이 있을 때, 래플 등록
            if (token_price > 0) {
                if (req.files.length > 0) {
                    console.log("잉잉", req.files);
                    const {host} = req.headers;
                    let imageList = [];
                    req.files.map((file, idx) => {
                        imageList.push(file.path);
                    });

                    const imagePathList = imageList.map((image) => {
                        return `http://${host}/${image}`;
                    });

                    const [image_1, image_2, image_3, image_4, image_5] = imagePathList;


                    let {title, content} = req.body;

                    let notice = await Notice.create({
                        image_1: image_1,
                        image_2: image_2,
                        image_3: image_3,
                        image_4: image_4,
                        image_5: image_5,
                        title: title,
                        content: content,
                        AdminNickname: nickname,
                        token_price: token_price,
                    })

                    return res.status(200).json({
                        message: "래플을 등록했습니다.",
                        data: {
                            noticeId: notice.dataValues.id,
                            admin_nickname: notice.dataValues.AdminNickname,
                            title: notice.dataValues.title,
                            content: notice.dataValues.content,
                            token_price: token_price,

                        }
                    })

                }
                //파일이 없을 때,
                if (req.files.length == 0) {

                    return res.status(404).json({message: "이미지 파일이 없습니다. 래플을 등록하려면 이미지를 등록해주세요."});

                }
            }
            if (token_price == 0) {
                console.log('엌엌')
                if (req.files.length > 0) {
                    const {host} = req.headers;
                    let imageList = [];
                    req.files.map((file, idx) => {
                        imageList.push(file.path);
                    });

                    const imagePathList = imageList.map((image) => {
                        return `http://${host}/${image}`;
                    });

                    const [image_1, image_2, image_3, image_4, image_5] = imagePathList;


                    let {title, content} = req.body;

                    let notice = await Notice.create({
                        image_1: image_1,
                        image_2: image_2,
                        image_3: image_3,
                        image_4: image_4,
                        image_5: image_5,
                        title: title,
                        content: content,
                        AdminNickname: nickname,
                        token_price: token_price
                    })

                    return res.status(200).json({
                        message: "공지를 등록했습니다.",
                        data: {
                            noticeId: notice.dataValues.id,
                            admin_nickname: notice.dataValues.AdminNickname,
                            title: notice.dataValues.title,
                            content: notice.dataValues.content,
                            token_price: token_price,

                        }
                    })

                }
                //파일이 없을 때,
                if (req.files.length == 0) {

                    let {title, content} = req.body;

                    let notice = await Notice.create({
                        title: title,
                        content: content,
                        AdminNickname: nickname,
                        token_price: token_price,
                    })


                    return res.status(200).json({
                        message: "공지를 등록했습니다.",
                        data: {
                            noticeId: notice.dataValues.id,
                            admin_nickname: notice.dataValues.AdminNickname,
                            title: notice.dataValues.title,
                            content: notice.dataValues.content,
                            token_price: notice.dataValues.token_price

                        }
                    })


                }
            }


        } catch (err) {
            console.log(err);
        }

    },
    //공지 읽기 공지 리스트에서 눌러서 읽었을 때,
    get: async (req, res) => {
        const {noticeId} = req.params;
        const notice = await Notice.findOne({where: {id: noticeId}});
        //토큰 price있으면 래플
        if (notice) {
            return res.status(200).json({
                data: {
                    image_1: notice.image_1,
                    image_2: notice.image_2,
                    image_3: notice.image_3,
                    image_4: notice.image_4,
                    image_5: notice.image_5,
                    noticeId: notice.id,
                    server_nickname: notice.AdminNickname,
                    title: notice.title,
                    content: notice.content,
                    token_price: notice.token_price,
                }
            })
        } else {
            return res.status(404).json({message: "해당하는 공지/래플(이)가 없습니다."});
        }

    },
    //공지 업데이트
    put: async (req, res) => {
        const {host} = req.headers;
        const {noticeId} = req.params;
        const files = req.files;

        let {title, content, token_price} = req.body;
        console.log(req.body);
        console.log(files);

        //토큰 price가 0이면 공지니까 token price는 업데이트 x
        //토큰 price가 0보다 크면 래플이니까 token price 업데이트 o 가능
        //이미지 수정 가능하도록
        const oldNotice = await Notice.findOne({where: {id: noticeId}});
        const oldImages = await Notice.findOne({
            attributes: ['image_1', 'image_2', 'image_3', 'image_4', 'image_5'],
            where:{id:noticeId}
        });

        let oldImagesPathList = Object.values(oldImages.dataValues);
        const fileNames = oldImagesPathList.map((path)=>{
            if(path){
                return path.slice(33);
            }
        });

        //새 이미지
        let newImageList = [];
        if(req.files){
            files.map((file)=>{
                if(file){
                    newImageList.push(file.path);
                }
            })
        }

        let newImagePathList = newImageList.map((image)=>{
            return `http://${host}/${image}`;
        });
        const [image_1, image_2, image_3, image_4, image_5] = newImagePathList;

        try{
            //래플
            if (oldNotice.token_price > 0) {
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

                await Notice.update(
                    {
                        title:title,
                        content:content,
                        token_price:token_price,
                        image_1:image_1,
                        image_2:image_2,
                        image_3:image_3,
                        image_4:image_4,
                        image_5:image_5
                    },
                    {where:{id:noticeId}}
                );

                return res.status(200).json({
                    message:"래플이 수정 되었습니다",
                    data:{
                        "noticeId":noticeId,
                    }
                })

            }
            //공지는 token_price ==0
            if(oldNotice.token_price== 0){
                console.log("엌",token_price);
                if(token_price>0){
                    return res.status(404).json({message:"공지의 token_price는 수정이 불가합니다."});
                }

                fileNames.map((name) => {
                    if(name){
                        if(fs.existsSync(path.join(__dirname, '..', '..', 'notice_img', `${name}`))){
                            try{
                                fs.unlinkSync(path.join(__dirname, '..', '..', 'notice_img', `${name}`));
                            } catch (e) {
                                console.log('multer Err');
                                console.log(e);
                            }
                        }
                    }
                });

                await Notice.update(
                    {
                        title:title,
                        content:content,
                        image_1:image_1,
                        image_2:image_2,
                        image_3:image_3,
                        image_4:image_4,
                        image_5:image_5
                    },
                    {where:{id:noticeId}}
                );

                return res.status(200).json({
                    message:"공지가 수정 되었습니다",
                    data:{
                        "noticeId":noticeId,
                    }
                })

            }


        }catch(err){
            console.log(err);
        }
    },

    //공지 삭제
    delete: async (req, res) => {
        const {noticeId} = req.params;
        const images = await Notice.findOne({
            attributes: ['image_1', 'image_2', 'image_3', 'image_4', 'image_5'],
            where: {id: noticeId}
        });
        try {
            if (images) {
                const imagePathList = Object.values(images.dataValues);

                const fileNames = imagePathList.map((path) => {
                    if (path) {
                        return path.slice(33)
                    }
                })
                console.log(fileNames);//파일네임 확인

                fileNames.map((name) => {
                    if (name) {
                        if (fs.existsSync(path.join(__dirname, '..', '..', 'notice_img', `${name}`))) {
                            try {
                                fs.unlinkSync(path.join(__dirname, '..', '..', 'notice_img', `${name}`));
                            } catch (err) {
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
                message: "공지가 삭제되었습니다."
            });

        } catch (err) {
            console.log(err);
        }
        //이미지가 있다면,


    },

    //메인페이지에서 공지 게시물 리스트 불러오기
    getAllList:async(req,res)=>{
        const noticeList = await Notice.findAll({
            attributes:["id","title","AdminNickname","token_price"],
        });

        const notices = noticeList.map((el,idx)=>{
            return {
                id: el.dataValues.id,
                title: el.dataValues.token_price>0 ?  "[래플]"+el.dataValues.title : "[공지]"+el.dataValues.title,
                server_nickname: el.dataValues.AdminNickname,
                token_price: el.dataValues.token_price
            }
        })

        return res.status(200).json({notices});

    }

    //래플 댓글 달기

}

