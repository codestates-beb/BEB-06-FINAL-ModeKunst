require('dotenv').config();
const CryptoJS = require('crypto-js');
const nodemailer = require('nodemailer');
const { User, Email, Sms } = require('../../models');
const axios = require("axios");

// 6자리 random 문자 생성
async function getRandom(){
    let randomstring = '';

    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'
    const stringLength = 6

    for (let i = 0; i < stringLength; i++) {
        const rnum = Math.floor(Math.random() * chars.length)
        randomstring += chars.substring(rnum, rnum + 1)
    }
    return randomstring
}

async function sendEmail(code, email){
    const transporter = await nodemailer.createTransport({
        service: 'naver',
        host: 'smtp.naver.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: process.env.NODEMAILER_USER,
            pass: process.env.NODEMAILER_PASSWORD
        }
    });
    const mailOptions = {
        from: process.env.NODEMAILER_USER,
        to: email,
        subject: 'ModeKunst 인증코드',
        text: `인증코드 : ${code}`
    }
    try {
        await transporter.sendMail(mailOptions);
    } catch (e) {
        console.log('nodemailer 에러');
        console.log(e);
    }
}

// sms 전송
async function sendSMS(code, phone_number){
    const date = Date.now().toString();

    const method = "POST";
    const space = " ";
    const newLine = "\n";
    const url = `https://sens.apigw.ntruss.com/sms/v2/services/${process.env.NAVER_SERVICE_ID}/messages`;
    const url2 = `/sms/v2/services/${process.env.NAVER_SERVICE_ID}/messages`;

    const hmac = await CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, process.env.NAVER_SECRET_KEY);

    hmac.update(method);
    hmac.update(space);
    hmac.update(url2);
    hmac.update(newLine);
    hmac.update(date);
    hmac.update(newLine);
    hmac.update(process.env.NAVAER_ACCESS_KEY);

    const hash = await hmac.finalize();

    const signature = hash.toString(CryptoJS.enc.Base64);

    try {
        await axios({
            method: method,
            url: url,
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "x-ncp-iam-access-key": process.env.NAVAER_ACCESS_KEY,
                "x-ncp-apigw-timestamp": date,
                "x-ncp-apigw-signature-v2": signature,
            },
            data: {
                type: "SMS",
                countryCode: "82",
                from: process.env.SENDER_NUMBER,
                content: `인증번호는 ${code} 입니다.`,
                messages: [{ to : phone_number}],
            },
        });
        //console.log(sms.data);
    } catch (e) {
        console.log('axios 에러');
        console.log(e);
    }
}

module.exports = {

    // 인증 번호 전송 ( email )
    email: async (req, res) => {
        const random = await getRandom();
        const { email, phoneNumber } = req.query;
        console.log(`입력 받은 email : ${email}, phoneNumber : ${phoneNumber}`);

        //회원 가입
        if(!phoneNumber){
            console.log(1);
            const emailCheck = await User.findOne({
                where: { email: email }
            });

            if(emailCheck.isNewRecord){
                await sendEmail(random, email);
                try {
                    await Email.create({
                        email: email,
                        code: random
                    });

                    res.status(200).json({
                        message: '인증 코드가 전송 되었습니다.'
                    })
                } catch (e) {
                    console.log('sequelize 에러');
                    console.log(e);
                }
            }else {
                res.status(404).json({
                    message: '이미 존재하는 이메일입니다.'
                });
            }
        }else{
            console.log(2);
            const user = User.findOne({
                where: { email: email, phone_number: phoneNumber }
            });

            if(user){
                await sendEmail(random, email);
                try {
                    await Email.create({
                        email: email,
                        code: random
                    });

                    res.status(200).json({
                        message: '인증 코드가 전송 되었습니다.'
                    })
                } catch (e) {
                    console.log('sequelize 에러');
                    console.log(e);
                }
            }else{
                res.status(404).json({
                    message: '존재하지 않는 유저입니다.'
                })
            }
        }

    },

    // 인증 번호 전송 ( sms )
    sms: async (req, res) => {
        const random = await getRandom();
        const { nickname, email, phoneNumber } = req.query;
        console.log(`입력 받은 nickname : ${nickname}, email : ${email}, phoneNumber : ${phoneNumber}`);

        // 회원 가입
        if(!(nickname||email)){
            const phoneCheck = await User.findOne({
                where: { phone_number: phoneNumber }
            });
            if(phoneCheck.isNewRecord){
                try{
                    await sendSMS(random, phoneNumber);
                    try{
                        await Sms.create({
                            phone_number: phoneNumber, code: random
                        });

                        res.status(200).json({
                            message: '인증 코드가 전송 되었습니다.'
                        })
                    } catch (e) {
                        console.log('sequelize 에러');
                        console.log(e);
                    }
                } catch (e) {
                    console.log(e);
                }
            }else{
                res.status(404).json({
                    message: '이미 존재하는 휴대폰 번호입니다.'
                });
            }
        }


        // 이메일 찾기
        if(!email){
            if(nickname){
                const user = await User.findOne({
                    where: { nickname: nickname, phone_number: phoneNumber }
                });
                if(user){
                    try{
                        await sendSMS(random, phoneNumber);
                        try{
                            await Sms.create({
                                phone_number: phoneNumber, code: random
                            });

                            res.status(200).json({
                                message: '인증 코드가 전송 되었습니다.'
                            })
                        } catch (e) {
                            console.log('sequelize 에러');
                            console.log(e);
                        }
                    } catch (e) {
                        console.log(e);
                    }
                }else{
                    res.status(404).json({
                        message: '존재하지 않는 유저입니다.'
                    })
                }
            }
        }

        // 비밀번호 찾기
        if(!nickname){
            if(email){
                const user = await User.findOne({
                    where: { email: email, phone_number: phoneNumber }
                });

                if(user){
                    try{
                        await sendSMS(random, phoneNumber);
                        try{
                            await Sms.create({
                                phone_number: phoneNumber, code: random
                            });

                            res.status(200).json({
                                message: '인증 코드가 전송 되었습니다.'
                            })
                        } catch (e) {
                            console.log('sequelize 에러');
                            console.log(e);
                        }
                    } catch (e) {
                        console.log(e);
                    }
                }else{
                    res.status(404).json({
                        message: '존재하지 않는 유저입니다.'
                    })
                }
            }
        }
    }
}