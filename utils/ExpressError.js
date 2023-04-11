//커스텀 오류 클래스 :
//프로그램의 에러를 가장 잘 표현하는 Error 서브 클래스를 직접 정의 한 것
class ExpressError extends Error {
    constructor(message, statusCode) {
        super();
        this.message = message;
        this.statusCode = statusCode;
    }
}

module.exports = ExpressError;