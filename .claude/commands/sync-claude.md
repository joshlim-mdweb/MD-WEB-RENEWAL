오늘 작업 내용을 기반으로 CLAUDE.md를 최신화한다.

## 실행 순서

1. 오늘 변경된 내용 파악:

```bash
git log --oneline --since="today"
git diff HEAD~$(git log --oneline --since="today" | wc -l | tr -d ' ')..HEAD --stat
```

2. 현재 CLAUDE.md 읽기

3. 아래 항목을 업데이트한다:

### Team Operating Model

- 새로 추가된 에이전트가 있으면 팀 테이블에 추가
- 삭제된 에이전트가 있으면 제거

### Folder Structure

- 새로 생긴 디렉토리/파일 구조 반영

### 컴포넌트 추가 규칙

- 새로 추가된 공유 컴포넌트가 있으면 "기존 공유 컴포넌트" 테이블에 추가

### Known Issues / Lessons Learned

- 오늘 발견한 실수 패턴이나 새 규칙 추가
- 형식: `- [YYYY-MM-DD] 내용`

### Survey Builder Rules / Product Policy

- 새로 확정된 정책이나 규칙 반영

4. 변경사항이 있으면 저장하고 변경 내역을 요약 출력한다.
