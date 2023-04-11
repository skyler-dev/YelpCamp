//비동기 유틸리티(래퍼함수)
//model.exports는 함수를 받아들인다.
module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next); // Errors will be passed to Express.
    }
}