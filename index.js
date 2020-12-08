const express = require("express");
const app = express();
const port = 5000;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { User } = require("./models/User");
const { auth } = require("./middleware/auth");
const config = require("./config/key");

//application/x-www-form-urlencodeed
//위의 데이터를 분석해서 가져옴
app.use(bodyParser.urlencoded({ extended: true }));
//application/json
//위의 타입으로 된 데이터를 분석해서 가져옴
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require("mongoose");
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/api/users/register", (req, res) => {
  //회원 가입 시 필요한 정보들을 client에서 가져오면
  //그것들을 데이터베이스에 넣어준다.
  let user = new User(req.body);
  //body-parser를 사용해 클라이언트로부터의 정보를 받아옴

  user.save((err, user) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true
    });
  });
});

app.post("/api/users/login", (req, res) => {
  //요청된 이메일을 데이터베이스에 있는지 찾음
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      });
    }
    //요청된 이메일이 데이터베이스에 있다면 비밀번호가 일치하는지 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({
          loginSuccess: false,
          message: "이메일 또는 비밀번호가 일치하지 않습니다."
        });

      //비밀번호가 일치한다면 토큰을 생성
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        //token을 저장 -> 쿠키, 로컬스토리지 등등 여러 곳에 저장가능
        //쿠키에 저장
        res
          .cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
      });
    });
  });
});

//role 1 어드민 role 2 특정부서 어드민
//role 0 -> 일반유저 role 0이 아니면 관리자
app.get("/api/users/auth", auth, (req, res) => {
  //middleware 통과 -> Authentication이 true 라는 뜻
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
