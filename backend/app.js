require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

const authRouter = require("./routes/auth");
const toolsRouter = require("./routes/tools");
const categoriesRouter = require("./routes/categories");
const workflowsRouter = require("./routes/workflows");
const postsRouter = require("./routes/posts");
const likesRouter = require("./routes/likes");
const commentsRouter = require("./routes/comments");
const claudeRouter = require("./routes/claude");
const usersRouter = require('./routes/users');

// CORS 오류 처리를 위한 미들웨어 적용 -> 배포시 해당 코드 지워야함
// 기본적으로 전부 열어두는것은 원칙상 안됨.
app.use(cors());
app.use(express.static("public"));
app.use(express.urlencoded({extended : true}));
app.use(express.json());

app.use("/api/auth", authRouter);
app.use('/api/users', usersRouter);
app.use("/api/tools", toolsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/workflows", workflowsRouter);
app.use("/api/claude", claudeRouter);
app.use("/api/posts", postsRouter);
app.use("/api/likes", likesRouter);
app.use("/api/comments", commentsRouter);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "요청한 경로를 찾을 수 없습니다." });
});

// 전역 에러 handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "서버 내부 오류가 발생했습니다.",
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`===Server is running on port ${PORT}===`);
});
