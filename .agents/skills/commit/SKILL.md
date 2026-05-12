---
name: commit
description: Git 커밋 컨벤션에 따라 변경 사항을 분석하고 커밋을 생성합니다. 커밋, 변경사항 저장, git commit 요청 시 사용합니다.
disable-model-invocation: true
allowed-tools:
  - Bash(git status *)
  - Bash(git diff *)
  - Bash(git add *)
  - Bash(git commit *)
  - Bash(git log *)
  - Bash(git branch *)
---

Git 커밋 컨벤션에 따라 커밋을 생성합니다.

## 절차

1. `git branch --show-current`로 현재 브랜치를 확인한다
2. 현재 브랜치가 허용된 브랜치가 아니면 커밋을 중단하고 사용자에게 안내한다
3. `git status`와 `git diff`를 확인하여 변경 내용을 파악한다
4. `git log --oneline -5`로 최근 커밋 스타일을 확인한다
5. 변경 내용이 없으면 커밋하지 않는다
4. 스테이징되지 않은 변경 사항은 관련 파일만 선별적으로 `git add`한다 (`git add .`이나 `git add -A`는 사용하지 않는다)
5. `.env`, `credentials`, 비밀키 등 민감한 파일은 커밋하지 않는다
6. 아래 커밋 메시지 포맷에 따라 커밋을 생성한다

## 커밋 메시지 포맷

```
<type>: <subject>
```

### type 종류

- `feat`: 새로운 기능 추가
- `fix`: 버그 수정
- `docs`: 문서 변경
- `style`: 코드 포맷팅, 세미콜론 누락 등 (기능 변경 없음)
- `refactor`: 리팩토링 (기능 변경 없음, 버그 수정 없음)
- `test`: 테스트 추가/수정
- `chore`: 빌드, 설정 파일 변경 등 기타
- `init`: 프로젝트 초기 설정

### subject 규칙

- 한글로 작성한다
- 마침표를 붙이지 않는다
- 명령형으로 작성한다 (예: "추가", "수정", "변경")
- 50자 이내로 작성한다

### 예시

```
feat: 회원가입 API 추가
fix: 로그인 시 토큰 만료 검증 오류 수정
docs: README에 실행 방법 추가
refactor: UserService 인증 로직 분리
test: 채팅방 생성 테스트 추가
chore: Docker Compose MySQL 설정 추가
```

## 브랜치 규칙

- 커밋 전 반드시 현재 브랜치를 검증한다
- `feat/*` 패턴의 브랜치에서만 커밋을 허용한다
- `main`, `develop` 브랜치에서는 절대 커밋하지 않는다
- 허용되지 않는 브랜치에서는 커밋을 중단하고 다음 메시지를 출력한다:
  > 현재 브랜치(`<브랜치명>`)에서는 커밋할 수 없습니다. `feat/*` 브랜치에서 작업해주세요.

## 주의사항

- `--amend`는 사용자가 명시적으로 요청한 경우에만 사용한다
- `--no-verify`는 사용하지 않는다
- 커밋 메시지는 반드시 HEREDOC으로 전달한다
- 커밋 후 `git status`로 결과를 확인한다