const today = new Date();

function format(date){
    const sec = Math.floor((today - date) / 1000);
    if(sec < 60) return '방금 전'
    const min = sec / 60
    if(min < 60) return `${Math.floor(min)}분 전`
    const hour = min / 60
    if(hour < 24) return `${Math.floor(hour)}시간 전`
    const day = hour / 24
    if(day / 7) return `${Math.floor(day)}일 전`
    const week = day / 7
    if(week < 5) return `${Math.floor(week)}주 전`
    const month = day / 30
    if(month < 12) return `${Math.floor(month)}개월 전`
    const year = day / 365
    return `${Math.floor(year)}`
}

module.exports = {

    one: (one) => {
        const date = new Date(one);
        return format(date);
    },

    many: (arr) => {
        return arr.map((date) => {
            return format(date)
        });
    }
}