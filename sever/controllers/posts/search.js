const { Post } = require("../../models");
const { literal, Op } = require("sequelize");
const { Literal } = require("sequelize/lib/utils");
const { many } = require("../function/createdAt");

module.exports = {
  search: async (req, res) => {
    const { name } = req.params;

    try {
      let diff;

      const title = await Post.findAll({
        where: { title: { [Op.like]: `%${name}%` } },
        order: literal("likes_num DESC"),
        attributes: [
          "id",
          "image_1",
          "title",
          "content",
          "category",
          "views",
          "createdAt",
          "UserNickname",
          "likes_num",
          "reviews_num",
        ],
        raw: true,
      });
      if (title.length) {
        const dateFormatTitles = title.map(post => {
          return new Date(post.createdAt);
        });

        diff = many(dateFormatTitles);

        title.map((post, i) => {
          post.createdAt = diff[i];
        });
      }

      const content = await Post.findAll({
        where: { content: { [Op.like]: `%${name}%` } },
        order: literal("likes_num DESC"),
        attributes: [
          "id",
          "image_1",
          "title",
          "content",
          "category",
          "views",
          "createdAt",
          "UserNickname",
          "likes_num",
          "reviews_num",
        ],
        raw: true,
      });

      if (content.length) {
        const dateFormatContent = content.map(post => {
          return new Date(post.createdAt);
        });

        diff = many(dateFormatContent);

        content.map((post, i) => {
          post.createdAt = diff[i];
        });
      }

      console.log(title, content);

      res.status(200).json({
        message: `${name}의 결과 값`,
        title,
        content,
      });
    } catch (e) {
      console.log("sequelize Err");
    }
  },
};
