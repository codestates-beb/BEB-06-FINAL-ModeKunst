module.exports = {
  // 로그아웃
  get: async (req, res) => {
    console.log("로그아웃");
    delete req.session;

    return res.status(200).json({
      message: "로그아웃 되었습니다.",
    });
  },
};
