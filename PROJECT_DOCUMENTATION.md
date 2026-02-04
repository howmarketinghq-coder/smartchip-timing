# SMART CHIP 마라톤 타이밍 기록 조회 시스템

## 프로젝트 개요

마라톤 대회 참가자들이 배번호 또는 이름으로 기록을 조회하고, 기록증/포토기록증을 다운로드할 수 있는 웹 서비스

---

## 기술 스택

| 구분 | 기술 |
|------|------|
| **프레임워크** | Next.js 15 (App Router) |
| **언어** | TypeScript |
| **스타일링** | Tailwind CSS |
| **데이터베이스** | PostgreSQL (Supabase) |
| **ORM** | Prisma |
| **인증** | NextAuth v5 (Credentials) |
| **호스팅** | Vercel |
| **차트** | Chart.js + react-chartjs-2 |
| **엑셀처리** | xlsx (SheetJS) |

---

## 배포 정보

### 프로덕션 URL
- **사이트**: https://smartchip-timing-ff19.vercel.app
- **관리자**: https://smartchip-timing-ff19.vercel.app/admin/login

### 서비스 대시보드
- **Vercel**: https://vercel.com/dashboard
- **Supabase**: https://supabase.com/dashboard/project/yuxgazkmaetnvxqcyxox
- **GitHub**: https://github.com/howmarketinghq-coder/smartchip-timing

---

## 관리자 계정

```
아이디: admin
비밀번호: smartchip2026
```

---

## 환경 변수 (.env)

```env
# Supabase PostgreSQL (Pooler - 서버리스용)
DATABASE_URL="postgresql://postgres.yuxgazkmaetnvxqcyxox:%40tnrwk12%21%21%40@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres"

# Supabase PostgreSQL (Direct - 마이그레이션용)
DIRECT_URL="postgresql://postgres:%40tnrwk12%21%21%40@db.yuxgazkmaetnvxqcyxox.supabase.co:5432/postgres"

# NextAuth 시크릿
AUTH_SECRET="SmartChip2026SecretKey123"
```

### Vercel 환경 변수 설정
Vercel Dashboard → Project → Settings → Environment Variables에 위 3개 변수 등록 (따옴표 제외)

---

## 데이터베이스 스키마

### Event (대회)
```sql
CREATE TABLE "Event" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "date" TIMESTAMP NOT NULL,
  "courses" TEXT NOT NULL,        -- JSON 배열: ["5Km", "10Km", "하프", "풀코스"]
  "status" TEXT DEFAULT 'past',   -- upcoming, active, past
  "certificateImg" TEXT,
  "photoCertImg" TEXT,
  "siteUrl" TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);
```

### Record (기록)
```sql
CREATE TABLE "Record" (
  "id" TEXT PRIMARY KEY,
  "eventId" TEXT NOT NULL REFERENCES "Event"("id") ON DELETE CASCADE,
  "bib" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "course" TEXT NOT NULL,
  "gender" TEXT NOT NULL,         -- M, F
  "finishTime" TEXT NOT NULL,     -- HH:MM:SS
  "speed" FLOAT NOT NULL,
  "pace" TEXT NOT NULL,           -- MM:SS
  "splits" TEXT NOT NULL,         -- JSON 배열
  "createdAt" TIMESTAMP DEFAULT NOW(),
  UNIQUE("eventId", "bib")
);

CREATE INDEX "Record_eventId_idx" ON "Record"("eventId");
CREATE INDEX "Record_bib_idx" ON "Record"("bib");
CREATE INDEX "Record_name_idx" ON "Record"("name");
```

### Poster (포스터/배너)
```sql
CREATE TABLE "Poster" (
  "id" TEXT PRIMARY KEY,
  "eventId" TEXT REFERENCES "Event"("id") ON DELETE SET NULL,
  "type" TEXT NOT NULL,           -- hero, next
  "imageUrl" TEXT NOT NULL,
  "link" TEXT,
  "order" INT DEFAULT 0,
  "createdAt" TIMESTAMP DEFAULT NOW()
);

CREATE INDEX "Poster_type_idx" ON "Poster"("type");
```

### Admin (관리자)
```sql
CREATE TABLE "Admin" (
  "id" TEXT PRIMARY KEY,
  "username" TEXT UNIQUE NOT NULL,
  "password" TEXT NOT NULL,       -- bcrypt 해시
  "createdAt" TIMESTAMP DEFAULT NOW()
);
```

---

## 페이지 구조

### 공개 페이지
| 경로 | 설명 |
|------|------|
| `/` | 메인 페이지 (히어로 슬라이더, 대회 목록) |
| `/events` | 과거 대회 목록 |
| `/record/[eventId]` | 기록 검색 페이지 |
| `/record/[eventId]/[bib]` | 기록 결과 페이지 |
| `/record/[eventId]/[bib]/ranking` | 순위 페이지 |
| `/record/[eventId]/[bib]/certificate` | 기록증 페이지 |
| `/record/[eventId]/[bib]/photo-certificate` | 포토기록증 페이지 |

### 관리자 페이지
| 경로 | 설명 |
|------|------|
| `/admin/login` | 관리자 로그인 |
| `/admin/dashboard` | 대시보드 (대회 관리) |
| `/admin/events/new` | 새 대회 등록 |
| `/admin/events/[id]` | 대회 수정 |
| `/admin/events/[id]/records` | 기록 업로드 |
| `/admin/posters` | 포스터 관리 |

---

## 주요 기능

### 1. 기록 검색
- 배번호 또는 이름으로 검색
- 동명이인 시 목록 표시

### 2. 기록 결과
- 완주 시간, 평균 페이스, 평균 속도
- 구간별 기록 테이블
- 페이스 변화 차트 (Chart.js)

### 3. 순위 조회
- 코스별 전체 순위
- 성별 순위
- TOP 3 시상대 UI

### 4. 기록증
- Canvas로 기록증 이미지 생성
- 다운로드 / 공유 기능

### 5. 포토기록증
- 사용자 사진 업로드
- Canvas로 합성 후 다운로드

### 6. 관리자 기능
- 대회 CRUD
- 엑셀 파일로 기록 일괄 업로드
- 포스터/배너 관리

---

## 폴더 구조

```
smartchip-timing/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # 메인 페이지
│   │   ├── events/page.tsx             # 대회 목록
│   │   ├── record/[eventId]/           # 기록 관련 페이지
│   │   ├── admin/                      # 관리자 페이지
│   │   ├── api/                        # API 라우트
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── layout/                     # Header, Footer
│   │   ├── ui/                         # Button, Input, Modal, Toast
│   │   ├── slider/                     # HeroSlider, EventSlider
│   │   ├── record/                     # SplitTable, PaceChart
│   │   ├── certificate/                # CertificateCanvas
│   │   └── admin/                      # EventForm, ExcelUploader
│   ├── lib/
│   │   ├── prisma.ts                   # Prisma 클라이언트
│   │   ├── auth.ts                     # NextAuth 설정
│   │   └── utils.ts                    # 유틸리티 함수
│   └── types/
│       └── index.ts                    # TypeScript 타입
├── prisma/
│   └── schema.prisma                   # DB 스키마
├── public/
│   └── images/
├── .env                                # 환경 변수 (git 제외)
├── .env.example                        # 환경 변수 예시
└── package.json
```

---

## 배포 프로세스

### 코드 변경 시
```bash
git add .
git commit -m "변경 내용"
git push
```
→ Vercel이 자동으로 빌드 및 배포

### DB 스키마 변경 시
1. `prisma/schema.prisma` 수정
2. Supabase SQL Editor에서 직접 ALTER TABLE 실행
3. `npx prisma generate` 로 클라이언트 재생성
4. git push

---

## 트러블슈팅 기록

### 1. "invalid domain character" 에러
- **원인**: Vercel 환경 변수에 따옴표 포함
- **해결**: 따옴표 제거 후 저장

### 2. "Tenant or user not found" 에러
- **원인**: 잘못된 DB 연결 문자열
- **해결**: Supabase Connect 버튼에서 올바른 URI 복사

### 3. "Can't reach database server at port 5432"
- **원인**: 서버리스에서 Direct 연결 시도
- **해결**: Pooler 연결 (port 6543) 사용

### 4. "prepared statement already exists"
- **원인**: pgbouncer 호환성 문제
- **해결**: DATABASE_URL에 `?pgbouncer=true&connection_limit=1` 추가

### 5. "column Admin.createdAt does not exist"
- **원인**: 테이블 생성 시 createdAt 컬럼 누락
- **해결**: `ALTER TABLE "Admin" ADD COLUMN "createdAt" TIMESTAMP DEFAULT NOW();`

---

## 요금제 정보

### Vercel (호스팅)
| 플랜 | 가격 | 트래픽 |
|------|------|--------|
| Hobby | 무료 | 100GB/월 |
| Pro | $20/월 | 1TB/월 |

### Supabase (데이터베이스)
| 플랜 | 가격 | DB 용량 | 비고 |
|------|------|---------|------|
| Free | 무료 | 500MB | 7일 비활성 시 정지 |
| Pro | $25/월 | 8GB | 자동 정지 없음 |

**현재 예상 사용량**: 무료 플랜으로 충분 (대회 10개+, 참가자 수만 명 수용 가능)

---

## 커스텀 도메인 연결

1. Vercel Dashboard → Project → Settings → Domains
2. 도메인 입력 후 Add
3. DNS 설정:
   - 루트 도메인: A 레코드 → 76.76.21.21
   - 서브도메인: CNAME → cname.vercel-dns.com
4. SSL 자동 발급 (몇 분 소요)

---

## 샘플 데이터

### 테스트 대회
- **이름**: 제32회 경주벚꽃마라톤대회
- **날짜**: 2025-04-05
- **코스**: 5Km, 10Km, 하프, 풀코스

### 테스트 참가자 (배번호로 검색)
- 10001 ~ 10010

---

## 향후 개선 사항

- [ ] 이미지 업로드 (Supabase Storage 연동)
- [ ] 더 많은 샘플 데이터 추가
- [ ] 대회별 통계 대시보드
- [ ] 참가자 사진 연동
- [ ] SMS/이메일 알림 기능

---

## 작성일

2026-02-04

## 작성자

Claude Code (AI Assistant)
