const { User, Post } = require("../../models");
const fs = require("fs");
const path = require("path");

module.exports = {
  // 유저 정보 수정
  post: async (req, res) => {
    //사진을 변경하고 제출 하면 , 기존의 사진 지우고 새로 등록하기
    //req.file 가 있으면, 기존의 내용 사진 지우고 새로 등록
    const { host } = req.headers;
    const user = await User.findOne({
      where: { nickname: req.session.user.nickname },
    });

    //수정할 내용들
    const new_profile_img = req.file?.path; //새파일
    const new_path = `http://${host}/${new_profile_img}`;// 새파일 경로
    const { nickname, phone_number, height, weight, gender, sns_url } =req.body;
    //기존의 내용과 새로운 내용들 비교 하나라도 틀리면 바로 수정
      if(new_profile_img){
          if (!(
              user.profile_img == new_path &&
              user.nickname == nickname &&
              user.phone_number == phone_number &&
              user.height == height &&
              user.weight == weight &&
              user.gender == gender &&
              user.sns_url == sns_url
          )) {
              //만약 파일이 기존의 이미지와 다르다면, 기존의 파일을 삭제하고 새이미지
              //어차피 사진은 기존의 사진이 들어가도 multer에서 시간 순으로 바꿨기 때문에
              //기존 사진 지워도 됨

              if (user.profile_img != new_path) {
                  const original_profile_img = user.profile_img.slice(34);
                  if (fs.existsSync(path.join(__dirname,"..","..","profile_img",`${original_profile_img}`))) {
                      fs.unlinkSync(path.join(__dirname,"..","..","profile_img",`${original_profile_img}`));
                  }

                  await User.update(
                      {
                          nickname: nickname,
                          phone_number: phone_number,
                          profile_img: new_path,
                          height: height,
                          weight: weight,
                          gender: gender,
                          sns_url: sns_url,
                      },
                      { where: { nickname: req.session.user.nickname } }
                  );
                  if(nickname !== user.dataValues.nickname){
                      await Post.update({ UserNickname: nickname}, {where: {UserNickname: user.dataValues.nickname}})
                  }
                  const newUserInfo = await User.findOne({ where: { nickname: nickname } });
                  return res.status(200).json({
                      message: "변경 되었습니다.",
                      data: {
                          newUserInfo
                      }
                  })

              }
              //사진 정보가 안바뀌었을 때
              else {
                  await User.update(
                      {
                          nickname: nickname,
                          phone_number: phone_number,
                          height: height,
                          weight: weight,
                          gender: gender,
                          sns_url: sns_url,
                      },
                      { where: { nickname: req.session.user.nickname } }
                  );
                  if(nickname !== user.dataValues.nickname){
                      await Post.update({ UserNickname: nickname}, {where: {UserNickname: user.dataValues.nickname}})
                  }
                  const newUserInfo = await User.findOne({ where: { nickname: nickname } });
                  return res.status(200).json({
                      message: "변경 되었습니다.",
                      data: {
                          newUserInfo
                      }
                  });
              }
          }
      }else{
          return res.status(401).json({
              message: '프로필 이미지를 등록 해주세요.'
          });
      }
  },
};
