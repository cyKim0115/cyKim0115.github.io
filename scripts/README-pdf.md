# PDF 생성

포트폴리오·이력 문서를 PDF로보냅니다. **사이트 HTML을 수정한 뒤 이 스크립트를 다시 실행**해 `pdf/`를 최신화하세요.

```powershell
cd C:\Users\cykim\repo\cyKim0115.github.io
npm install
npx playwright install chromium
npm run pdf
```

| 출력 | 소스 |
|------|------|
| `pdf/portfolio.pdf` | `index.html?pdf=1` — Company·Personal **전부 펼침** (필터/접힘 없음) |
| `pdf/resume.pdf` | `이력서.html` |
| `pdf/career.pdf` | `경력기술서.html` |
| `pdf/cover-letter.pdf` | `자기소개서.html` |

부분 실행:

```powershell
npm run pdf:portfolio
npm run pdf:docs
```
