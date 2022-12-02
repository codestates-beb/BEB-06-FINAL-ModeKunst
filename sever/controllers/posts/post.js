const fs = require('fs');
const path = require('path');


const { User, Follow, Token, Like, Review, Post, Product_name, Product_brand, Product_size,Server, Token_price} = require('../../models');
const { web3, abi20, serverPKey, getBalance } = require('../../contract/Web3');


const { literal , Op, where} = require('sequelize');
const { one } = require('../function/createdAt');


module.exports = {

  // 게시물 작성
  post: async (req, res) => {
    // 이미지가 3개 미만일 때 게시물 작성 안됨

    if(req.files.length <= 2){
      req.files.map((file) => {
        if(fs.existsSync(path.join(__dirname, '..', '..', 'post_img', `${file.filename}`))){
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

      const userSession = req.session.user; //사용자의 세션 정보

      const nickname = userSession.nickname
      let { title, content, category, top_post, haveInfo } = req.body;
      const { outer_brand, top_brand, pants_brand, shoes_brand, outer_name, top_name, pants_name, shoes_name, outer_size, top_size, pants_size, shoes_size } = req.body;

      top_post = top_post === 'true';
      haveInfo = haveInfo === 'true';

      const { write_count } = await User.findOne( { where: { nickname: nickname },  attributes: ['write_count' ], raw: true } );

      const { address } = await Server.findOne({ attributes: ['address'], raw: true });

      const price = await Token_price.findOne({ where: { id: 1 }, attributes: [ 'write_post_info', 'write_post', 'top_post', 'like_user_price', 'like_sever_price' ], raw: true });
      const top_post_price = price.top_post;
      const { write_post_info, write_post, like_sever_price, like_user_price } = price;
      console.log(top_post)
      if (top_post) {
        // token 지불
        // 게시물 상단 노출은 토큰 20 개 지불
        // 사용자에게 approve 받아서 서버가 transferfrom 사용하여 본인에게 전송
        try{
          const { point_amount } = await User.findOne({ where: { nickname: nickname}, attributes: ['point_amount'], raw: true });
          if(point_amount >= top_post_price){
            try {
              let post;
              if(write_count !== 0 ){
                if(haveInfo){
                  // 보상 토큰 정상 지급 fashion_info 작성시 10개 지급 req.session.user로 사용자에게 10개 지급
                  post = await Post.create({
                    image_1: image_1,
                    image_2: image_2,
                    image_3: image_3,
                    image_4: image_4,
                    image_5: image_5,
                    title: title,
                    content: content,
                    category: category,
                    server_price: like_sever_price,
                    user_price: like_user_price,
                    top_post: top_post,
                    have_info: haveInfo,
                    UserNickname: nickname,
                  });

                  const id = post.dataValues.id

                  // 옷 정보
                  await Product_brand.create(
                      {
                        outer: outer_brand,
                        top: top_brand,
                        pants: pants_brand,
                        shoes: shoes_brand,
                        PostId: id
                      }
                  );
                  await Product_name.create(
                      {
                        outer: outer_name,
                        top: top_name,
                        pants: pants_name,
                        shoes: shoes_name,
                        PostId: id
                      }
                  );
                  await Product_size.create(
                      {
                        outer: outer_size,
                        top: top_size,
                        pants: pants_size,
                        shoes: shoes_size,
                        PostId: id
                      }
                  );

                  await User.decrement({ point_amount: top_post_price } , { where: { nickname: nickname }});

                  await Server.increment({ point_amount: write_post_info, used_point: top_post_price }, { where: { address: address } });

                  await User.increment({ point_amount: write_post_info }, { where: { nickname: nickname } });

                  await User.decrement({ write_count: 1 } , { where: { nickname: nickname }});

                  res.status(200).json({
                    message: '게시물이 등록 되었습니다. ( 10 Mode Point를 받았습니다! )',
                    data: {
                      postId: post.dataValues.id,
                    }
                  });

                }else{
                  // 보상 토큰 적게 지급
                  //fashion_info 미작성시 5개 지급

                  post = await Post.create({
                    image_1: image_1,
                    image_2: image_2,
                    image_3: image_3,
                    image_4: image_4,
                    image_5: image_5,
                    title: title,
                    content: content,
                    category: category,
                    top_post: top_post,
                    server_price: like_sever_price,
                    UserNickname: nickname,
                  });

                  await User.decrement({ point_amount: top_post_price } , { where: { nickname: nickname }});

                  await Server.increment({ point_amount: write_post, used_point: top_post_price }, { where: { address: address } });

                  await User.increment({ point_amount: write_post}, { where: { nickname: nickname } });

                  await User.decrement({ write_count: 1 } , { where: { nickname: nickname }});

                  res.status(200).json({
                    message: '게시물이 등록 되었습니다. ( 5 Mode Point를 받았습니다! )',
                    data: {
                      postId: post.dataValues.id,
                    }
                  });
                }
                // 보상 포인트 X
              }else{

                if(haveInfo){

                  post = await Post.create({
                    image_1: image_1,
                    image_2: image_2,
                    image_3: image_3,
                    image_4: image_4,
                    image_5: image_5,
                    title: title,
                    content: content,
                    category: category,
                    server_price: like_sever_price,
                    user_price: like_user_price,
                    top_post: top_post,
                    have_info: haveInfo,
                    UserNickname: nickname,
                  });

                  const id = post.dataValues.id

                  // 옷 정보
                  await Product_brand.create(
                      {
                        outer: outer_brand,
                        top: top_brand,
                        pants: pants_brand,
                        shoes: shoes_brand,
                        PostId: id
                      }
                  );
                  await Product_name.create(
                      {
                        outer: outer_name,
                        top: top_name,
                        pants: pants_name,
                        shoes: shoes_name,
                        PostId: id
                      }
                  );
                  await Product_size.create(
                      {
                        outer: outer_size,
                        top: top_size,
                        pants: pants_size,
                        shoes: shoes_size,
                        PostId: id
                      }
                  );

                }else{

                  post = await Post.create({
                    image_1: image_1,
                    image_2: image_2,
                    image_3: image_3,
                    image_4: image_4,
                    image_5: image_5,
                    title: title,
                    content: content,
                    category: category,
                    server_price: like_sever_price,
                    UserNickname: nickname,
                  });

                }

                await User.decrement({ point_amount: top_post_price } , { where: { nickname: nickname }});

                await Server.increment({ used_point: top_post_price }, { where: { address: address } });

                res.status(200).json({
                  message: '게시물이 등록 되었습니다.',
                  data: {
                    postId: post.dataValues.id,
                  }
                })
              }

            } catch (e) {
              console.log('Sequelize err');
              console.log(e);
            }
          }else{
            return res.status(400).json({message:"포인트가 부족합니다."})
          }
        } catch (e) {
          console.log('Sequelize Err')
        }
      }else{
        try {
          let post;
          if(write_count !== 0 ){
            if(haveInfo){
              // 보상 토큰 정상 지급 fashion_info 작성시 10개 지급 req.session.user로 사용자에게 10개 지급

              post = await Post.create({
                image_1: image_1,
                image_2: image_2,
                image_3: image_3,
                image_4: image_4,
                image_5: image_5,
                title: title,
                content: content,
                category: category,
                server_price: like_sever_price,
                user_price: like_user_price,
                top_post: top_post,
                have_info: haveInfo,
                UserNickname: nickname,
              });

              const id = post.dataValues.id

              // 옷 정보
              await Product_brand.create(
                  {
                    outer: outer_brand,
                    top: top_brand,
                    pants: pants_brand,
                    shoes: shoes_brand,
                    PostId: id
                  }
              );
              await Product_name.create(
                  {
                    outer: outer_name,
                    top: top_name,
                    pants: pants_name,
                    shoes: shoes_name,
                    PostId: id
                  }
              );
              await Product_size.create(
                  {
                    outer: outer_size,
                    top: top_size,
                    pants: pants_size,
                    shoes: shoes_size,
                    PostId: id
                  }
              );

              await Server.increment({ point_amount: write_post_info }, { where: { address: address } });

              await User.increment({ point_amount: write_post_info }, { where: { nickname: nickname } });

              await User.decrement({ write_count: 1 } , { where: { nickname: nickname }});

              res.status(200).json({
                message: '게시물이 등록 되었습니다. 게시물이 등록 되었습니다. ( 10 Mode Point를 받았습니다! )',
                data: {
                  postId: post.dataValues.id,
                }
              });

            }else{
              post = await Post.create({
                image_1: image_1,
                image_2: image_2,
                image_3: image_3,
                image_4: image_4,
                image_5: image_5,
                title: title,
                content: content,
                category: category,
                server_price: like_sever_price,
                UserNickname: nickname,
              });

              await Server.increment({ point_amount: write_post }, { where: { address: address } });

              await User.increment({ point_amount: write_post }, { where: { nickname: nickname } });

              await User.decrement({ write_count: 1 } , { where: { nickname: nickname }});

              res.status(200).json({
                message: '게시물이 등록 되었습니다. 게시물이 등록 되었습니다. ( 5 Mode Point를 받았습니다! )',
                data: {
                  postId: post.dataValues.id,
                }
              });
            }

          }else{

            if(haveInfo){
              // 보상 토큰 정상 지급 fashion_info 작성시 10개 지급 req.session.user로 사용자에게 10개 지급

              post = await Post.create({
                image_1: image_1,
                image_2: image_2,
                image_3: image_3,
                image_4: image_4,
                image_5: image_5,
                title: title,
                content: content,
                category: category,
                server_price: like_sever_price,
                user_price: like_user_price,
                top_post: top_post,
                have_info: haveInfo,
                UserNickname: nickname,
              });

              const id = post.dataValues.id

              // 옷 정보
              await Product_brand.create(
                  {
                    outer: outer_brand,
                    top: top_brand,
                    pants: pants_brand,
                    shoes: shoes_brand,
                    PostId: id
                  }
              );
              await Product_name.create(
                  {
                    outer: outer_name,
                    top: top_name,
                    pants: pants_name,
                    shoes: shoes_name,
                    PostId: id
                  }
              );
              await Product_size.create(
                  {
                    outer: outer_size,
                    top: top_size,
                    pants: pants_size,
                    shoes: shoes_size,
                    PostId: id
                  }
              );

            }else{

              post = await Post.create({
                image_1: image_1,
                image_2: image_2,
                image_3: image_3,
                image_4: image_4,
                image_5: image_5,
                title: title,
                content: content,
                category: category,
                server_price: like_sever_price,
                UserNickname: nickname,
              });
            }

            res.status(200).json({
              message: '게시물이 등록 되었습니다.',
              data: {
                postId: post.dataValues.id,
              }
            })
          }
        } catch (e) {
          console.log('Sequelize err');
          console.log(e);
        }
      }
    }
  },


  /**
   * 디테일 페이지
   * @param req postId: String
   * @param res
   * @returns {Promise<void>} 1. 팔로우 했을 때, 좋아요 했을 때 ( 유저, 게시글, 리뷰, 옷 ) 정보, 좋아요 수, 2. 둘 다 안했을 때 ( 유저, 게시글, 리뷰 ) 정보, 좋아요 수
   */
  get: async (req, res) => {
    const loginNickname = req.session.user?.nickname
    const { postId } = req.params;
    // postId의 작성자의 nft들
    console.log(`입력 받은 loginNickname: ${loginNickname}, postId: ${postId}`)
    try {
      await Post.increment({ views: 1 }, {where: { id: postId }});
      const { have_info } = await Post.findOne({where: {id: postId}, attributes: ['have_info'], raw: true});
      let post;

      if(have_info){
        post = await Post.findOne({
          where: { id: postId },
          include: [{model: Product_brand, attributes: ['outer', 'top', 'pants', 'shoes']}, { model: Product_name, attributes: ['outer', 'top', 'pants', 'shoes']}, { model: Product_size, attributes: ['outer', 'top', 'pants', 'shoes']}, ],
          attributes: ['image_1', 'image_2', 'image_3', 'image_4', 'image_5', 'title', 'content', 'category', 'views', 'top_post', 'likes_num', 'reviews_num', 'createdAt', 'UserNickname'],
        });
      }else{
        post = await Post.findOne({
          where: { id: postId },
          attributes: ['image_1', 'image_2', 'image_3', 'image_4', 'image_5', 'title', 'content', 'category', 'views', 'top_post', 'likes_num', 'reviews_num', 'createdAt', 'UserNickname'],
        })
      }

      const { image_1, image_2, image_3, image_4, image_5, title, content, category, views, UserNickname, likes_num, reviews_num, top_post } = post.dataValues;
      const createdAt = one(post.dataValues?.createdAt);

      const userData = await User.findOne({
        where: { nickname: UserNickname },
        attributes: ['nickname', 'height', 'weight', 'sns_url', 'profile_img'],
      });

      const user = userData.dataValues;

      const similarLook = await Post.findAll({
        where: { category: category, id: { [Op.ne]: postId }},
        order: literal('views DESC'),
        limit: 15,
        attributes: ['id', 'image_1', 'title', 'views', 'UserNickname'],
        raw: true
      });

      const reviews = await Review.findAll({
        attributes: ['id', 'content', 'createdAt', 'UserNickname'],
        where: { PostId: postId },
        order: literal('createdAt DESC'),
        limit: 4,
        raw: true,
      });
      let haveReview;
      let isLike;
      let isFollow;
      if(loginNickname) {
        haveReview = await Review.findOne({
          where: { PostId: postId, UserNickname: loginNickname },
          raw: true
        });

        haveReview = !!haveReview;

        isLike = await Like.findOne({
          where: { UserNickname: loginNickname, PostId: postId }
        });

        isLike = !!isLike;

        isFollow = await Follow.findOne({
          where: { follower: loginNickname, following: UserNickname },
          paranoid: false,
          raw: true
        });

        isFollow = !!isFollow;

        if(loginNickname === UserNickname){
          // 자기가 쓴 게시물 detail 페이지는 isOwner
          res.status(200).json({
            message: `${title}의 디테일 페이지`,
            data: {
              post: { image_1, image_2, image_3, image_4, image_5, title, content, category, views, createdAt },
              user,
              product_brand: post.Product_brand?.dataValues,
              product_name: post.Product_name?.dataValues,
              product_size: post.Product_size?.dataValues,
              likes_num,
              reviews_num,
              reviews,
              similarLook,
              isLike,
              isFollow: true,
              isOwner: true,
              top_post,
              haveReview
            }
          });
        }else{
          if(isFollow){
            res.status(200).json({
              message: `${title}의 디테일 페이지`,
              data: {
                post: { image_1, image_2, image_3, image_4, image_5, title, content, category, views, createdAt },
                user: user,
                product_brand: post.Product_brand?.dataValues,
                product_name: post.Product_name?.dataValues,
                product_size: post.Product_size?.dataValues,
                likes_num,
                reviews_num,
                reviews,
                similarLook,
                isFollow,
                isLike,
                isOwner: false,
                top_post,
                haveReview
              }
            });
          }else{
            res.status(200).json({
              message: `${title}의 디테일 페이지`,
              data: {
                post: { image_1, image_2, image_3, image_4, image_5, title, content, category, views, createdAt },
                user: user,
                product_brand: post.Product_brand?.dataValues,
                product_name: post.Product_name?.dataValues,
                product_size: post.Product_size?.dataValues,
                likes_num,
                reviews_num,
                reviews: reviews,
                similarLook: similarLook,
                isFollow: false,
                isLike: isLike,
                isOwner: false,
                top_post,
                haveReview
              }
            });
          }
        }

      }else {
        haveReview = false;
        isLike = false;
        isFollow = false;

        res.status(200).json({
          message: `${title}의 디테일 페이지`,
          data: {
            post: { image_1, image_2, image_3, image_4, image_5, title, content, category, views, createdAt },
            user: user,
            product_brand: post.Product_brand?.dataValues,
            product_name: post.Product_name?.dataValues,
            product_size: post.Product_size?.dataValues,
            likes_num,
            reviews_num,
            reviews: reviews,
            similarLook: similarLook,
            isFollow,
            isLike,
            isOwner : false,
            top_post,
          }
        });
      }
    } catch (e) {
      console.log(e);
    }
  },

  // 게시물 수정 창
  updatePost: async (req, res) => {
    const { postId } = req.params;
    const { have_info } = await Post.findOne({where: {id: postId}, attributes: ['have_info'], raw: true});

    let post;

    if(have_info){
      post = await Post.findOne({
        where: { id: postId },
        include: [{model: Product_brand, attributes: ['outer', 'top', 'pants', 'shoes']}, { model: Product_name, attributes: ['outer', 'top', 'pants', 'shoes']}, { model: Product_size, attributes: ['outer', 'top', 'pants', 'shoes']}, ],
        attributes: ['image_1', 'image_2', 'image_3', 'image_4', 'image_5', 'title', 'content', 'category', 'createdAt'],
      });
    }else{
      post = await Post.findOne({
        where: { id: postId },
        attributes: ['image_1', 'image_2', 'image_3', 'image_4', 'image_5', 'title', 'content', 'category', 'createdAt'],
      });
    }

    res.status(200).json({
      message: `${postId}의 정보`,
      data: {
        post,
        have_info
      }
    });

  },

  // 게시물 수정
  /**
   * 게시물 수정
   * @todo 받는 인자 값 확실해지면 시작
   * @param req params( postId ), body ( title, content, category ), files ( files )
   * @param res
   * @returns {Promise<void>}
   */
  put: async (req, res) => {
    const { host } = req.headers;
    const { postId } = req.params;
    const nickname = req.session.user?.nickname;

    let { title, content, category, haveInfo  } = req.body;
    const { outer_brand, top_brand, pants_brand, shoes_brand, outer_name, top_name, pants_name, shoes_name, outer_size, top_size, pants_size, shoes_size } = req.body;
    haveInfo = haveInfo === 'true';
    if(nickname){
      const files = req.files;
      if(files <= 2) {
        files.map((file) => {
          if (fs.existsSync(path.join(__dirname, '..', '..', 'post_img', `${file.filename}`))) {
            try {
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
        const images = await Post.findOne({
          attributes: ['image_1', 'image_2', 'image_3', 'image_4', 'image_5'],
          where: { id: postId}
        });

        if(images){
          let imagePathList = Object.values(images.dataValues);

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

          let imageList = [];
          files.map((file) => {
            imageList.push(file.path);
          });

          imagePathList = imageList.map((image) => {
            return `http://${host}/${image}`;
          });


          const [image_1, image_2, image_3, image_4, image_5] = imagePathList;

          //수저 전 게시글에 product_info가 있는지 확인하는 변수
          const {have_info} = await Post.findOne({ attributes: ['have_info'], where: {id: postId}});

          try {
            if(!have_info){
              if(haveInfo){
                await Post.update(
                    { title: title, content: content, category: category, haveInfo: haveInfo, image_1: image_1, image_2: image_2, image_3: image_3, image_4: image_4, image_5: image_5, have_info: true },
                    { where: { id: postId } }
                );
                await Product_brand.create({
                  outer: outer_brand,
                  top: top_brand,
                  pants: pants_brand,
                  shoes: shoes_brand,
                  PostId: postId
                });
                await Product_name.create({
                  outer: outer_name,
                  top: top_name,
                  pants: pants_name,
                  shoes: shoes_name,
                  PostId: postId
                });
                await Product_size.create({
                  outer: outer_size,
                  top: top_size,
                  pants: pants_size,
                  shoes: shoes_size,
                  PostId: postId
                });

                await User.increment({point_amount: 2}, {where: {nickname: req.session.user.nickname}})
              }else{
                await Post.update(
                    { title: title, content: content, category: category, haveInfo: haveInfo, image_1: image_1, image_2: image_2, image_3: image_3, image_4: image_4, image_5: image_5 },
                    { where: { id: postId } }
                );
              }
            }else{
              if(haveInfo){
                await Post.update(
                    { title: title, content: content, category: category, haveInfo: haveInfo, image_1: image_1, image_2: image_2, image_3: image_3, image_4: image_4, image_5: image_5 },
                    { where: { id: postId } }
                );
                await Product_brand.update({
                  outer: outer_brand,
                  top: top_brand,
                  pants: pants_brand,
                  shoes: shoes_brand,
                }, { where: { id: postId } });
                await Product_name.update({
                  outer: outer_name,
                  top: top_name,
                  pants: pants_name,
                  shoes: shoes_name,
                }, { where: { id: postId } });
                await Product_size.update({
                  outer: outer_size,
                  top: top_size,
                  pants: pants_size,
                  shoes: shoes_size,
                }, { where: { id: postId } });
              }else{
                await Post.update(
                    { title: title, content: content, category: category, haveInfo: haveInfo, image_1: image_1, image_2: image_2, image_3: image_3, image_4: image_4, image_5: image_5 },
                    { where: { id: postId } }
                );
              }
            }


            res.status(200).json({
              message: '게시물이 수정 되었습니다.',
              data: {
                postId
              }
            })
          } catch (e) {
            console.log('sequelize Err');
            console.log(e);
          }
        }

      }
    }else{
      res.status(401).json({
        message: '로그인 이후 사용해주세요.'
      })
    }
  },

  // 게시물 삭제
  delete: async (req, res) => {
    const { postId } = req.params;
    const images = await Post.findOne({
      attributes: ['image_1', 'image_2', 'image_3', 'image_4', 'image_5'],
      where: { id: postId}
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
        where : { id: postId }
      });
      await Product_brand.destroy({
        where : { id: postId }
      });
      await Product_name.destroy({
        where : { id: postId }
      });
      await Product_size.destroy({
        where : { id: postId }
      });

      res.status(200).json({
        message: '게시물이 삭제 되었습니다.'
      })
    }

  }
}