module.exports = {
  isLoggedIn: (req, res, next) => {
    if (req.session.user) {
      next();
    } else {
      res.json({ success: false, message: "로그인 필요" });
    }
  },
  isNotLoggedIn: (req, res, next) => {
    if (!req.session.user) {
      next();
    } else {
      res.json({ success: false, message: "이미 로그인 된 계정입니다." });
    }
  },
};
