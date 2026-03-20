# CLOSY — 내 옷장 기반 AI 스타일리스트

매일 아침 코디를 물어보는 AI 스타일리스트 앱. 내가 가진 옷으로 최적의 코디를 추천해준다.

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| 앱 | React Native (Expo SDK 54) + Expo Router |
| 백엔드 | FastAPI (Python) |
| DB | PostgreSQL (로컬 Docker) / Supabase (프로덕션 예정) |
| AI | Google Vision AI (옷 분석) + Gemini Flash (코디 추천) |
| 상태관리 | Zustand v5 |
| 인프라 | Docker / Docker Compose |

---

## 프로젝트 구조

```
Closy-App/
├── docker-compose.yml              # Docker 서비스 정의 (DB, 백엔드, pgAdmin)
├── .gitignore
├── README.md
│
├── backend/
│   ├── Dockerfile                   # 백엔드 컨테이너 빌드 설정
│   ├── requirements.txt             # Python 패키지 목록
│   ├── .env                         # 로컬 환경변수 (git 제외)
│   ├── .env.example                 # 환경변수 템플릿
│   ├── db/
│   │   └── init.sql                 # 초기 테이블 생성 (users, wardrobe_items, chat_messages)
│   ├── static/
│   │   └── wardrobe/                # 업로드된 옷 이미지 저장 디렉토리
│   └── app/
│       ├── __init__.py
│       ├── main.py                  # FastAPI 앱 진입점 (CORS, 라우터, static 서빙)
│       ├── config.py                # 환경변수 설정 (Pydantic Settings)
│       ├── database.py              # PostgreSQL 비동기 연결 (SQLAlchemy + asyncpg)
│       ├── models.py                # DB 테이블 모델 (User, WardrobeItem, ChatMessage)
│       ├── schemas.py               # 요청/응답 Pydantic 스키마
│       ├── deps.py                  # 인증 의존성 (JWT 토큰 검증)
│       └── routers/
│           ├── __init__.py
│           ├── auth.py              # 회원가입 / 로그인 (JWT 발급)
│           ├── wardrobe.py          # 옷장 CRUD + 이미지 업로드
│           ├── vision.py            # Google Vision AI 이미지 분석 → 태그 생성
│           └── chat.py              # Gemini 코디 추천 (옷장 컨텍스트 포함)
│
└── frontend/
    ├── app.json                     # Expo 앱 설정 (이름, 아이콘, 스플래시)
    ├── package.json                 # npm 패키지 + 스크립트
    ├── tsconfig.json                # TypeScript 설정
    ├── .env                         # 프론트 환경변수 (API URL)
    ├── .env.example                 # 환경변수 템플릿
    │
    ├── app/                         # ── Expo Router 페이지 (파일 = URL) ──
    │   ├── _layout.tsx              # 루트 레이아웃 (SafeAreaProvider, 인증 분기)
    │   ├── index.tsx                # 진입점 → 옷장 탭으로 리다이렉트
    │   ├── wardrobe-add.tsx         # 아이템 추가 화면 (이미지→크롭→AI분석→저장)
    │   ├── wardrobe-add.styles.ts   # ↑ 스타일
    │   ├── (auth)/
    │   │   ├── _layout.tsx          # 인증 레이아웃
    │   │   ├── login.tsx            # 로그인 화면
    │   │   ├── login.styles.ts      # ↑ 스타일
    │   │   ├── signup.tsx           # 회원가입 화면
    │   │   └── signup.styles.ts     # ↑ 스타일
    │   └── (tabs)/
    │       ├── _layout.tsx          # 탭 네비게이터 (옷장/채팅 탭)
    │       ├── wardrobe.tsx         # 옷장 메인 화면 (2열 그리드, 카테고리 필터)
    │       ├── wardrobe.styles.ts   # ↑ 스타일
    │       ├── chat.tsx             # AI 채팅 화면 (코디 추천 대화)
    │       └── chat.styles.ts       # ↑ 스타일
    │
    ├── components/                  # ── 재사용 컴포넌트 ──
    │   ├── common/
    │   │   ├── Header.tsx           # 공통 헤더 (CLOSY 로고 + 서브타이틀)
    │   │   └── Header.styles.ts     # ↑ 스타일
    │   ├── wardrobe/
    │   │   ├── WardrobeCard.tsx     # 옷 카드 (이미지 + 이름 + 태그)
    │   │   ├── WardrobeCard.styles.ts
    │   │   ├── CategoryFilter.tsx   # 카테고리 필터 탭 (전체/상의/하의/...)
    │   │   ├── CategoryFilter.styles.ts
    │   │   ├── CategorySegmentTabs.tsx  # 아이템 추가 시 카테고리 선택 탭
    │   │   ├── CategorySegmentTabs.styles.ts
    │   │   ├── ImageUploadBox.tsx   # 이미지 선택 영역 + 바텀시트 (촬영/갤러리)
    │   │   ├── ImageUploadBox.styles.ts
    │   │   ├── CropModal.tsx        # 전체화면 크롭 모달 (ImageManipulator로 실제 크롭)
    │   │   ├── CropModal.styles.ts
    │   │   ├── CropSelectionOverlay.tsx  # 드래그/리사이즈 크롭 박스 오버레이
    │   │   ├── CropSelectionOverlay.styles.ts
    │   │   ├── TagSection.tsx       # AI 생성 태그 섹션 (카테고리/색상/스타일/시즌)
    │   │   ├── TagSection.styles.ts
    │   │   ├── TagChipEditor.tsx    # 태그 칩 편집기 (추가/삭제 가능)
    │   │   ├── TagChipEditor.styles.ts
    │   │   ├── SelectedItemPreview.tsx  # 선택된 아이템 미리보기
    │   │   ├── SelectedItemPreview.styles.ts
    │   │   ├── AddItemModal.tsx     # (레거시) 간단 추가 모달
    │   │   └── AddItemModal.styles.ts
    │   └── chat/
    │       ├── MessageBubble.tsx    # 채팅 말풍선 (유저/AI 구분)
    │       ├── MessageBubble.styles.ts
    │       ├── ChatInput.tsx        # 메시지 입력창
    │       └── ChatInput.styles.ts
    │
    ├── api/                         # ── 백엔드 API 호출 레이어 ──
    │   ├── client.ts               # HTTP 클라이언트 (fetch 래퍼, 타임아웃, 에러 처리)
    │   ├── auth.ts                 # 로그인/회원가입 API
    │   ├── wardrobe.ts             # 옷장 CRUD + 이미지 업로드 API
    │   └── chat.ts                 # 채팅 API
    │
    ├── services/                    # ── 비즈니스 로직 서비스 ──
    │   └── visionService.ts        # Vision AI 분석 (이미지→base64→백엔드→태그)
    │
    ├── store/                       # ── Zustand 전역 상태 ──
    │   ├── authStore.ts            # 인증 상태 (토큰, 로그인/로그아웃)
    │   ├── wardrobeStore.ts        # 옷장 상태 (아이템 목록, CRUD, 필터)
    │   └── chatStore.ts            # 채팅 상태 (메시지 목록, 전송)
    │
    ├── types/                       # ── TypeScript 타입 정의 ──
    │   └── index.ts                # 공통 타입 (WardrobeItem, ChatMessage, CropRect 등)
    │
    ├── styles/                      # ── 공통 스타일 ──
    │   ├── colors.ts               # 컬러 시스템 (다크 테마 기반)
    │   ├── typography.ts           # 폰트 크기/굵기 프리셋
    │   └── common.ts               # 공통 레이아웃 스타일
    │
    └── assets/                      # 앱 아이콘, 스플래시 이미지
```

---

## 시작하기

### 사전 준비

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) 설치
- [Node.js](https://nodejs.org/) 18+ 설치
- [Gemini API 키](https://aistudio.google.com/app/apikey) 발급
- [Google Cloud Vision API](https://console.cloud.google.com/) 활성화 + 서비스 계정 키
- 스마트폰에 [Expo Go](https://expo.dev/go) 앱 설치 (SDK 54 지원 버전)

### 1. 저장소 클론

```bash
git clone https://github.com/your-username/Closy-App.git
cd Closy-App
```

### 2. 환경변수 설정

**백엔드**

```bash
cp backend/.env.example backend/.env
```

`backend/.env` 열어서 아래 값 입력:

```
GEMINI_API_KEY=your_gemini_api_key_here
SECRET_KEY=랜덤_문자열_입력
GOOGLE_APPLICATION_CREDENTIALS=/app/your-service-account.json
```

**프론트엔드**

```bash
cp frontend/.env.example frontend/.env
```

`frontend/.env` 열어서 본인 컴퓨터의 로컬 IP 입력:

```
EXPO_PUBLIC_API_URL=http://본인_IP:8000
```

> **IP 확인 방법 (Windows):** cmd에서 `ipconfig` 실행 → `무선 LAN 어댑터 Wi-Fi`의 IPv4 주소
>
> **IP 확인 방법 (Mac/Linux):** `ifconfig | grep inet` 또는 `ip addr`
>
> Android 에뮬레이터는 `http://10.0.2.2:8000`, iOS 시뮬레이터/웹은 `http://localhost:8000`

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

백엔드가 정상 동작하면 브라우저에서 `http://localhost:8000` 접속 시 아래 응답이 와야 함:

```json
{"message": "OOTD AI API is running 👗"}
```

### 4. 프론트엔드 실행

```bash
cd frontend
npm install
npx expo start --clear
```

Expo Go 앱으로 QR 코드 스캔하면 바로 실행.

> **주의:** 폰과 컴퓨터가 **같은 Wi-Fi**에 연결되어 있어야 함

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
| POST | `/wardrobe` | 옷 등록 (메타데이터 + image_url) |
| POST | `/wardrobe/upload-image` | 옷 이미지 파일 업로드 → URL 반환 |
| PATCH | `/wardrobe/{id}` | 옷 정보 수정 |
| DELETE | `/wardrobe/{id}` | 옷 삭제 |

### Vision
| Method | Path | 설명 |
|--------|------|------|
| POST | `/vision/analyze` | 이미지 → Vision AI 분석 → 태그 반환 |

### Chat
| Method | Path | 설명 |
|--------|------|------|
| POST | `/chat` | 코디 추천 요청 (Gemini + 옷장 컨텍스트) |
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

# 백엔드 리빌드 (requirements.txt 변경 시)
docker-compose up --build -d backend

# 컨테이너 전체 종료
docker-compose down

# 프론트 캐시 초기화 후 재시작
cd frontend && npx expo start --clear
```

---

## 주요 흐름

### 옷 등록 흐름

```
이미지 선택 (갤러리/카메라)
    ↓
CropModal (전체화면 크롭 — 드래그/리사이즈)
    ↓
확인 → expo-image-manipulator로 실제 이미지 크롭
    ↓
Vision AI 분석 → 카테고리/색상/스타일/시즌 태그 자동 생성
    ↓
태그 수동 편집 가능
    ↓
저장 → 이미지 서버 업로드 → DB에 메타데이터 저장
```

### 코디 추천 흐름

```
사용자 메시지 입력 ("오늘 뭐 입을까?")
    ↓
백엔드에서 사용자 옷장 데이터 조회
    ↓
Gemini AI에 옷장 컨텍스트 + 메시지 전달
    ↓
AI 코디 추천 응답 → 채팅 화면에 표시
```

---

## 개발 현황

### 완료
- [x] 백엔드 기본 구조 (FastAPI + PostgreSQL + Docker)
- [x] 인증 API (회원가입 / 로그인 / JWT)
- [x] 옷장 CRUD API + 이미지 업로드
- [x] Google Vision AI 연동 (옷 사진 → 자동 태깅)
- [x] 채팅 API (Gemini 연동 + 옷장 컨텍스트)
- [x] 프론트 옷장 화면 (그리드, 카테고리 필터)
- [x] 프론트 아이템 추가 (이미지 크롭 + AI 태그 + DB 저장)
- [x] 프론트 채팅 화면 (말풍선, 입력창)
- [x] 프론트 ↔ 백엔드 API 연동
- [x] CSS 전체 파일 분리 (*.styles.ts)

### 진행 예정
- [ ] 추구미 이미지 첨부 기능
- [ ] 미착용 알림 (30일 이상 미착용)
- [ ] 무신사 파트너스 링크 연동
- [ ] 구독 결제 (인앱 결제)
- [ ] Railway 배포 + Supabase 프로덕션 전환
