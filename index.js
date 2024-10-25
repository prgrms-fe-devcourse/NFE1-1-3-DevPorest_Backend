require("dotenv").config();

const { swaggerUi, specs } = require("./swagger");

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 8000;

// MongoDB 연결 설정
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "devporest", // 데이터베이스 이름을 'devporest'로 설정(default: 'test')
    });
    console.log(`MongoDB 연결 성공: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB 연결 실패:", error);
    process.exit(1);
  }
};
// MongoDB 연결
connectDB();

const corsOptions = {
  origin: [
    process.env.CORS_ORIGIN,
    "http://localhost:5173", // React 개발 서버
    "http://localhost:8000", // Express 서버
    /localhost:\d+$/, // localhost의 모든 포트 허용
  ],
  credentials: true, // 응답 헤더에 Access-Control-Allow-Credentials 추가
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// 미들웨어 설정
app.use(cors(corsOptions));
app.use(express.json()); // JSON 파싱
app.use(cookieParser()); // 쿠키 파싱
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs)); // Swagger UI를 /api-docs 경로에 라우팅

// 기본 라우트 설정
app.get("/", (req, res) => {
  res.send("Express 서버가 실행 중입니다.");
});

// API 라우트 설정
const apiRoutes = require("./routes");
app.use("/api", apiRoutes);

// 서버 시작
app.listen(port, () => {
  console.log(`서버가 ${port}번 포트에서 실행 중입니다...`);
  console.log(`CORS origin: ${process.env.CORS_ORIGIN}`);
});

// 존재하지 않는 라우트에 대한 처리
app.use("*", (req, res) => {
  res.status(404).json({ message: "요청하신 페이지를 찾을 수 없습니다." });
});
