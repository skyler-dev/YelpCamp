# YelpCamp

- 유데미의 Colt Steele의 웹 개발 코스를 통해 첫 웹 사이트를 만들었습니다.
- 배포 완료된 링크 : [yelp-camp-start.cyclic.app/](https://yelp-camp-start.cyclic.app/)
- **배포 이후 검색바를 추가하는 등 아직 보완 작업을 진행하고 있습니다.**

### 구현한 기능

- 캠핑장 이름 또는 위치로 검색할 수 있습니다. 실시간으로 검색 결과에 해당하는 캠핑장이 나타납니다.
- 캠핑장을 새로 생성하고, 편집하고, 삭제할 수 있습니다.
    - 캠핑장을 생성한 유저만이 편집하고, 삭제할 수 있습니다.
    - 깜빡하고 이미지를 올리지 못했을 경우에는 nav 바의 ‘모든 캠핑장들’에서는 기본 이미지가 보입니다.
    - 캠핑장의 주소를 기반으로 맵에 표시됩니다.
- 각 캠핑장 별로 리뷰를 남기고, 편집하고, 삭제할 수 있습니다.
    - 리뷰를 남긴 유저만이 편집하고, 삭제할 수 있습니다.
- 유저는 등록하고 로그인, 로그아웃 할 수 있습니다.
    - 로그인 시 로그인 버튼이 보이지 않습니다.
    - 로그인 하지 않은 상태로 nav 바의 ‘새로운 캠핑장 추가하기’로 이동할 시, 로그인 페이지로 넘어갑니다. 이때 로그인하면 ‘새로운 캠핑장 추가하기’로 이동됩니다.
- 폼에 클라이언트측과 서버측 유효성 검사(validation)가 작동합니다.
- 지도의 원을 누르면 확대되면서 클러스터가 나눠집니다. 핀을 선택 시 팝업이 나타납니다.

### 사용 방법

1. **mongoDB**를 설치합니다.
2. 최상위 폴더안에서 다음 코드를 실행해 모든 **디펜던시**를 설치합니다.
    
    ```bash
    npm i
    ```
    
3. **.env파일**을 최상위 폴더에 만들어 `이름=값`의 형태로 다음을 포함하여야 합니다.
    - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_KEY`, `CLOUDINARY_SECRET`은 Cloudinary 회원가입 후 Credentials에서 확인 가능합니다.
    - `MAPBOX_TOKEN`은 엑세스토큰으로, MAPBOX회원가입 후 [Access tokens page](https://account.mapbox.com/access-tokens/)에서 확인 가능합니다.
    - `SECRET`은 임의로 설정 가능합니다.
    - `DB_URL`은 Connection String으로, MongoDB Atlas에 회원가입 후 Database의 connect에서 확인 가능합니다.
    
    ```
    CLOUDINARY_CLOUD_NAME=값
    CLOUDINARY_KEY=값
    CLOUDINARY_SECRET=값
    MAPBOX_TOKEN=값
    SECRET=값
    DB_URL=값
    ```
    
4. **시드 데이터**가 필요한 경우
    - 한 터미널에서 Mongod를 실행합니다. 로컬의 MongoDB에 저장합니다.
    - 다른 터미널에서 아래 코드를 실행합니다.
    
    ```bash
    node ./seeds/index.js
    ```
    
5. **앱 실행** 방법
    
    ```bash
    node app.js
    ```
    
6. localhost:3000으로 이동합니다.

### 사용한 도구

- connect-flash
    - 페이지의 사용자에게 메시지를 공유하는 도구
    - 사용 이유 : Express 3이후 flash에 대한 지원을 없앴기 때문에, Express 2에서 추출한 미들웨어인 connect-flash 패키지를 이용했습니다.
- cloudinay
    - 클라우드 기반 이미지 및 비디오 관리 솔루션을 제공하는 도구 또는 서비스
    - 사용 이유 : Mongo에는 용량이 큰 사진을 올리기 부담되기 때문입니다.
- multer
    - 파일 업로드를 위해 사용되는 `multipart/form-data`를 파싱하고 다루기 위한 node.js 의 미들웨어
    - 사용 이유 : PC에 있는 이미지 파일을 업로드하는 기능을 위함입니다.
- multer-storage-cloudinary
    - Cloudinary용 Multer storage engine
    - 사용 이유 : PC에 있는 이미지 파일을 업로드하는 기능을 위함입니다.
- dotenv
    - `.env` 파일에서 `process.env`로 환경 변수를 로드하는 zero-dependency 모듈
    - 사용 이유 : Cloudinary의 Credentials들을 보호하기 위함입니다.
- passport
    - Node 앱에 인증을 추가해주는 라이브러리
    - 사용 이유 : 현재는 로컬을 사용하지만, 이후에 Twitter, Google등의 로그인을 지원할 수 있기 때문입니다.
- mapbox
    - 개발자를 위한 매핑 및 위치 클라우드 플랫폼
    - 사용 이유 : 지도 커스텀이 가능하고, 무료이기 때문입니다.
- ejs
    - 템플레이팅 엔진
    - 사용 이유 : 특정 로직과 HTML 응답 생성을 결합하기 위함입니다.
- ejs-mate
    - EJS 템플릿 엔진을 위한 `layout(view)`, `partial(name,optionsOrCollection)`, `block('name')`함수 제공
    - 사용 이유 : ejs파일 분할하는 것 대신 사용했습니다. 스타일시트 추가시 boilerplate.ejs 한 군데에만 삽입하면 됩니다.
- express-session
    - Express 앱에서 세션 구현을 위해 사용하는 라이브러리
    - 사용 이유 : 플래시 메시지를 만들고 인증을 추가하기 위함입니다.
- joi
    - Javascript 유효성 검사 도구
    - 사용 이유 : 서버 측 유효성 검사를 하기 위함입니다.
- method-override
    - HTTP 동사를 재정의 하기 위한 express.js 라이브러리
    - 사용 이유 : 브라우저의 HTML form은 get이나 post 요청만 전송할 수 있기 때문에, Put, Delete 등의 다른 HTTP 동사를 사용하기 위함입니다.
- 이외에, 기초적인 보안(MongoDB Operator Injection, XSS 등)을 위해 express-mongo-sanitize, sanitize-html, helmet을 사용했습니다.
