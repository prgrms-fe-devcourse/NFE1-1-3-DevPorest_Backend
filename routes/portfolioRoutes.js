const express = require("express");
const router = express.Router();
const portfolioController = require("../controllers/portfolioController.js");
const auth = require("../middleware/auth");

// 전체 조회는 인증이 필요없으므로 미들웨어 적용하지 않음
router.get("/", portfolioController.getAllPortfolios); // GET /api/portfolios
router.get("/:id", portfolioController.getPortfolioById); // GET /api/portfolios/:id

// 생성, 수정, 삭제는 인증된 사용자만 가능하도록 auth 미들웨어 적용
router.post("/", auth, portfolioController.createPortfolio); // POST /api/portfolios
router.put("/:id", auth, portfolioController.updatePortfolio); // PUT /api/portfolios/:id
router.delete("/:id", auth, portfolioController.deletePortfolio); // DELETE /api/portfolios/:id

// GET /api/portfolios/search/:type/:keyword
router.get("/search/:type/:keyword", portfolioController.searchPortfolios);

router.post("/:id/like", auth, portfolioController.toggleLike);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Portfolios
 *   description: 포트폴리오 관리 API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Portfolio:
 *       type: object
 *       required:
 *         - title
 *         - contents
 *         - userID
 *       properties:
 *         title:
 *           type: string
 *           description: 포트폴리오 제목
 *         contents:
 *           type: string
 *           description: 포트폴리오 내용
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: 이미지 URL 배열
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: 태그 배열
 *         techStack:
 *           type: array
 *           items:
 *             type: string
 *           description: 사용된 기술 스택 배열
 *         jobGroup:
 *           type: number
 *           description: 직무 카테고리
 *         thumbnailImage:
 *           type: string
 *           description: 썸네일 이미지 URL(단일)
 *         userID:
 *           type: string
 *           description: 포트폴리오 소유자 ID
 */

/**
 * @swagger
 * /api/portfolios:
 *   get:
 *     summary: 전체 포트폴리오 조회
 *     tags: [Portfolios]
 *     responses:
 *       200:
 *         description: 포트폴리오 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: number
 *                   description: 전체 포트폴리오 수
 *                 data:
 *                   type: array
 *                   items:
 *                     allOf:
 *                     - $ref: '#/components/schemas/Portfolio'
 *                     - type: object
 *                       properties:
 *                         likeCount:
 *                           type: number
 *                           example: 0
 *       500:
 *         description: 서버 에러
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: 포트폴리오 목록을 가져오는데 실패했습니다.
 */

/**
 * @swagger
 * /api/portfolios/{id}:
 *   get:
 *     summary: 포트폴리오 상세 조회
 *     tags: [Portfolios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 포트폴리오 ID (24자리 16진수 ObjectId)
 *     responses:
 *       200:
 *         description: 포트폴리오 상세 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   allOf:
 *                     - $ref: '#/components/schemas/Portfolio'
 *                     - type: object
 *                       properties:
 *                         like:
 *                           type: boolean
 *                           example: false
 *                         likeCount:
 *                           type: number
 *                           example: 0
 *       400:
 *         description: 잘못된 요청
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: 유효하지 않은 포트폴리오 ID입니다.
 *       404:
 *         description: 포트폴리오를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: 해당 ID의 포트폴리오를 찾을 수 없습니다.
 */

/**
 * @swagger
 * /api/portfolios:
 *   post:
 *     summary: 새 포트폴리오 생성 (인증 필요)
 *     security:
 *       - cookieAuth: []
 *     tags: [Portfolios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Portfolio'
 *     responses:
 *       201:
 *         description: 포트폴리오 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Portfolio'
 *       401:
 *         description: 인증 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 인증이 필요합니다
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: 포트폴리오 생성에 실패했습니다.
 */

/**
 * @swagger
 * /api/portfolios/{id}:
 *   put:
 *     summary: 포트폴리오 수정 (인증 필요)
 *     security:
 *       - cookieAuth: []
 *     tags: [Portfolios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 포트폴리오 ID (24자리 16진수 ObjectId)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Portfolio'
 *     responses:
 *       200:
 *         description: 포트폴리오 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Portfolio'
 *       401:
 *         description: 인증 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 인증이 필요합니다
 *       403:
 *         description: 권한 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: 포트폴리오를 수정할 권한이 없습니다.
 *       404:
 *         description: 포트폴리오를 찾을 수 없음
 *
 *   delete:
 *     summary: 포트폴리오 삭제 (인증 필요)
 *     security:
 *       - cookieAuth: []
 *     tags: [Portfolios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 포트폴리오 ID
 *     responses:
 *       200:
 *         description: 포트폴리오 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 포트폴리오가 성공적으로 삭제되었습니다.
 *       401:
 *         description: 인증 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 인증이 필요합니다
 *       403:
 *         description: 권한 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: 포트폴리오를 삭제할 권한이 없습니다.
 *       404:
 *         description: 포트폴리오를 찾을 수 없음
 */
/**
 * @swagger
 * /api/portfolios/search/{type}/{keyword}:
 *   get:
 *     summary: 포트폴리오 검색 (기술 스택, 키워드 검색 및 정렬)
 *     description: |
 *       기술 스택과 키워드를 조합하여 포트폴리오를 검색합니다.
 *       - 검색 조건이 없는 경우 전체 포트폴리오가 조회됩니다.
 *       - 검색어는 영문(대소문자 구분 없음), 한글, 공백을 포함할 수 있습니다.
 *       - 정렬은 최신순(latest) 또는 인기순(popular)으로 가능합니다.
 *
 *       사용 예시:
 *       - 전체 검색: /search/-/-
 *       - 기술 스택으로만 검색: /search/React/-
 *       - 키워드로만 검색: /search/-/인공지능
 *       - 기술 스택 + 키워드 검색: /search/React/AI
 *       - 정렬 옵션 추가: /search/React/AI?sort=popular
 *     tags: [Portfolios]
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *         description: |
 *           검색할 기술 스택 (예: React, JavaScript, Python 등)
 *           미입력 시 "-" 입력
 *       - in: path
 *         name: keyword
 *         required: true
 *         schema:
 *           type: string
 *         description: |
 *           검색 키워드 (제목에서 검색)
 *           영문(대소문자 무관), 한글, 공백 포함 가능
 *           미입력 시 "-" 입력
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [latest, popular]
 *         required: false
 *         description: |
 *           정렬 방식 선택
 *           - latest: 최신순 (기본값)
 *           - popular: 인기순 (좋아요 수 기준)
 *     responses:
 *       200:
 *         description: 검색 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   description: 검색된 포트폴리오 수
 *                   example: 2
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "507f1f77bcf86cd799439011"
 *                       title:
 *                         type: string
 *                         example: "AI 기반 React 프로젝트"
 *                       contents:
 *                         type: string
 *                         example: "프로젝트 상세 내용..."
 *                       view:
 *                         type: integer
 *                         example: 150
 *                       images:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["image1.jpg", "image2.jpg"]
 *                       tags:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["AI", "웹개발"]
 *                       techStack:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["React", "TensorFlow"]
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-01-01T00:00:00.000Z"
 *                       thumbnailImage:
 *                         type: string
 *                         example: "thumbnail.jpg"
 *                       userID:
 *                         type: string
 *                         example: "user123"
 *                       likeCount:
 *                         type: integer
 *                         example: 42
 *                       jobGroup:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "507f1f77bcf86cd799439012"
 *                           name:
 *                             type: string
 *                             example: "프론트엔드"
 *       500:
 *         description: 서버 에러
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "포트폴리오 검색에 실패했습니다."
 */
/**
 * @swagger
 * /api/portfolios/{id}/like:
 *   post:
 *     summary: 포트폴리오 좋아요 (토글)
 *     tags: [Portfolios]
 *     responses:
 *       201:
 *         description: 포트폴리오 좋아요 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 like:
 *                   type: boolean
 *                   example: true
 *                 likeCount:
 *                   type: number
 *                   example: 0
 *       500:
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 서버 에러
 */
