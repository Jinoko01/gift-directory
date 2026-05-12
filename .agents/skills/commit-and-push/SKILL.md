---
name: commit-and-push
description: 변경 사항을 커밋하고 원격 저장소에 푸시합니다. 커밋 후 push, 저장 후 올리기 요청 시 사용합니다.
disable-model-invocation: true
allowed-tools:
  - Bash(git status *)
  - Bash(git diff *)
  - Bash(git add *)
  - Bash(git commit *)
  - Bash(git log *)
  - Bash(git branch *)
  - Bash(git push *)
---

커밋 규칙은 [commit skill](./../commit/skill.md)을 따른다.

## 절차

1. commit skill의 절차를 그대로 수행하여 커밋을 생성한다
2. 커밋 성공 후 `git push` 한다
   - 현재 브랜치에 upstream이 설정되어 있으면: `git push`
   - upstream이 없으면: `git push -u origin <브랜치명>`
3. 푸시 결과를 출력한다

## 주의사항

- 커밋이 실패하면 푸시하지 않는다
- `main`, `develop` 브랜치에는 커밋 및 푸시를 하지 않는다
- force push(`--force`, `-f`)는 절대 사용하지 않는다
