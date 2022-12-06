const { User } = require('../../models');
const {nickname} = require("./check");

module.exports = {
    report: async (req, res) => {
        const reportedUser = req.body?.reported;
        console.log(reportedUser)
        if(reportedUser){
            await User.increment({reported_amount : 1}, {where: {nickname: reportedUser}} );
            res.status(200).json({
                message: `${reportedUser}님을 신고했습니다.`
            });
        }
    }
}