# CLOSY — 내 옷장 기반 AI 스타일리스트

매일 아침 코디를 물어보는 AI 스타일리스트 앱. 내가 가진 옷으로 최적의 코디를 추천해준다.

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| 앱 | React Native (Expo SDK 54) + Expo Router |
| 백엔드 | FastAPI (Python) |
| DB | PostgreSQL (로컬 Docker) / Supabase (프로덕션 예정) |
| AI | Gemini Flash (Vision + 대화) |
| 상태관리 | Zustand v5 |
| 인프라 | Docker / Docker Compose |

---

## 프로젝트 구조

```
Closy-App/
├── docker-compose.yml
├── .gitignore
├── README.md
│
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── .env                  # 로컬 환경변수 (git 제외)
│   ├── .env.example          # 환경변수 템플릿
│   ├── db/
│   │   └── init.sql          # 초기 테이블 생성 스크립트
│   └── app/
│       ├── main.py
│       ├── config.py
│       ├── database.py
│       ├── models.py
│       ├── schemas.py
│       ├── deps.py
│       └── routers/
│           ├── auth.py       # 회원가입 / 로그인
│           ├── wardrobe.py   # 옷장 CRUD
│           └── chat.py       # Gemini 코디 추천
│
└── frontend/
    ├── app/
    │   ├── _layout.tsx       # 루트 레이아웃 (SafeAreaProvider, GestureHandler)
    │   ├── index.tsx         # 진입점 → 옷장 탭으로 리다이렉트
    │   └── (tabs)/
    │       ├── _layout.tsx   # 탭 네비게이터
    │       ├── wardrobe.tsx  # 옷장 화면
    │       └── chat.tsx      # AI 채팅 화면
    ├── components/
    │   ├── common/
    │   │   └── Header.tsx    # CLOSY 헤더
    │   ├── wardrobe/
    │   │   ├── CategoryFilter.tsx  # 카테고리 필터 탭
    │   │   ├── WardrobeCard.tsx    # 옷 카드
    │   │   └── AddItemModal.tsx    # 아이템 추가 모달
    │   └── chat/
    │       ├── MessageBubble.tsx   # 말풍선
    │       └── ChatInput.tsx       # 입력창
    ├── styles/
    │   ├── colors.ts         # 컬러 시스템
    │   ├── typography.ts     # 타이포그래피
    │   └── common.ts         # 공통 스타일
    ├── store/
    │   ├── wardrobeStore.ts  # 옷장 상태 (Zustand)
    │   └── chatStore.ts      # 채팅 상태 (Zustand)
    ├── types/
    │   └── index.ts          # 전체 타입 정의
    ├── assets/               # 앱 아이콘, 스플래시 이미지
    ├── app.json
    └── package.json
```

---

## 시작하기

### 사전 준비

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) 설치
- [Node.js](https://nodejs.org/) 18+ 설치
- [Gemini API 키](https://aistudio.google.com/app/apikey) 발급
- 스마트폰에 [Expo Go](https://expo.dev/go) 앱 설치 (SDK 54 지원 버전)

### 1. 저장소 클론

```bash
git clone https://github.com/your-username/Closy-App.git
cd Closy-App
```

### 2. 환경변수 설정

```bash
# backend/.env.example을 복사해서 .env 생성
cp backend/.env.example backend/.env
```

`backend/.env` 열어서 아래 값 입력:

```
GEMINI_API_KEY=your_gemini_api_key_here
SECRET_KEY=your_secret_key_here
```

### 3. 백엔드 + DB 실행 (Docker)

```bash
docker-compose up -d
```

| 서비스 | URL | 설명 |
|--------|-----|------|
| FastAPI | http://localhost:8000 | 백엔드 API |
| Swagger UI | http://localhost:8000/docs | API 문서 |
| pgAdmin | http://localhost:5050 | DB 관리 GUI |

pgAdmin 로그인: `admin@closy.dev` / `admin1234`

### 4. 프론트엔드 실행

```bash
cd frontend
npm install
npx expo start --clear
```

Expo Go 앱으로 QR 코드 스캔하면 바로 실행.

---

## API 엔드포인트

### Auth
| Method | Path | 설명 |
|--------|------|------|
| POST | `/auth/signup` | 회원가입 |
| POST | `/auth/login` | 로그인 (JWT 발급) |

### Wardrobe
| Method | Path | 설명 |
|--------|------|------|
| GET | `/wardrobe` | 옷장 목록 조회 (`?category=상의` 필터 가능) |
| POST | `/wardrobe` | 옷 등록 |
| PATCH | `/wardrobe/{id}` | 옷 정보 수정 |
| DELETE | `/wardrobe/{id}` | 옷 삭제 |

### Chat
| Method | Path | 설명 |
|--------|------|------|
| POST | `/chat` | 코디 추천 요청 (Gemini 연동) |
| GET | `/chat/history` | 대화 기록 조회 |

---

## 유용한 명령어

```bash
# 컨테이너 로그 확인
docker-compose logs -f backend

# DB 초기화 (데이터 전부 삭제)
docker-compose down -v && docker-compose up -d

# 백엔드만 재시작
docker-compose restart backend

# 컨테이너 전체 종료
docker-compose down

# 프론트 캐시 초기화 후 재시작
cd frontend && npx expo start --clear
```

---

## 개발 현황

### 완료
- [x] 백엔드 기본 구조 (FastAPI + PostgreSQL + Docker)
- [x] 인증 API (회원가입 / 로그인 / JWT)
- [x] 옷장 CRUD API
- [x] 채팅 API (Gemini 연동)
- [x] 프론트 옷장 화면 (그리드, 카테고리 필터, 아이템 추가)
- [x] 프론트 채팅 화면 (말풍선, 입력창)

### 진행 예정
- [ ] 프론트 ↔ 백엔드 API 연동
- [ ] Gemini Vision 이미지 분석 (옷 사진 → 자동 태깅)
- [ ] 추구미 이미지 첨부 기능
- [ ] 미착용 알림 (30일 이상 미착용)
- [ ] 무신사 파트너스 링크 연동
- [ ] 구독 결제 (인앱 결제)
- [ ] Railway 배포 + Supabase 프로덕션 전환
