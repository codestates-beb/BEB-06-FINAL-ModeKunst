function getNow(){
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth()+1;
    let date = now.getDate();
    let day = now.getDay();
    let hours = now.getHours();
    let min = now.getMinutes();
    let sec = now.getSeconds();

    return `${year}${month}${date}${day}_${hours}${min}${sec}`
}

const multer = require('multer');


let storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./banner_img')
    },
    filename:function(req,file,cb){
        cb(null, `${getNow()}_${file.originalname}`)
    },
    limits:{
        fileSize:20 * 1024 * 1024,
    }
});

module.exports={
    banner_upload : multer({storage:storage}),
}