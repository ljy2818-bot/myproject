# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Database Schema (`schema.sql`)

PostgreSQL 기반 회원 관리 + 잠재 고객 관리 스키마.

### 테이블 구조

| 테이블 | 설명 |
|--------|------|
| `roles` | 권한 그룹 (admin / user / moderator) |
| `users` | 회원 기본 정보, UUID PK |
| `user_roles` | 회원-역할 다대다 매핑 |
| `email_verifications` | 이메일 인증 토큰 |
| `password_resets` | 비밀번호 재설정 토큰 |
| `user_sessions` | 로그인 세션 / 리프레시 토큰 |
| `leads` | 잠재 고객 (status: new → contacted → qualified → converted / lost) |

### 주요 규칙
- `users.id`, `leads.id`, `user_sessions.id` 는 `uuid_generate_v4()` 사용 (`uuid-ossp` 확장 필요)
- `users`, `leads` 는 `set_updated_at()` 트리거로 `updated_at` 자동 갱신
- `leads.assigned_to` → `users.id` FK (담당자 삭제 시 NULL)
- `leads.converted_at` 가 NULL 이 아니면 전환 완료
