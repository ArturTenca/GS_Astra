# ASTRA — Auditoria de Cybersecurity (repositório mobile)

Auditoria do cliente React Native/Expo e práticas de repositório. **A segurança definitiva depende do Supabase** (RLS, Auth, Storage) aplicado pelas migrations **fora do Git público**.

## 1. O que pode ir para o GitHub (seguro)

| Item | Status |
|------|--------|
| Código TypeScript da app | OK — sem `service_role`, sem senhas |
| `.env.example` | OK — apenas placeholders |
| `assets/`, `docs/` acadêmicos | OK |
| `package-lock.json` | OK — auditar com `npm audit` periodicamente |

## 2. O que NÃO pode ir para o GitHub

| Item | Motivo | Ação neste repo |
|------|--------|-----------------|
| `.env`, `.env.local`, etc. | Contém URL + anon key do projeto | `.gitignore` + só `.env.example` |
| `supabase/migrations/*.sql` | Revela RLS, funções `SECURITY DEFINER`, schema | **Gitignore** — aplicar localmente |
| `supabase/seed.sql` | Dados de demo + lógica de membership | **Gitignore** |
| `service_role` key | Bypass total de RLS | Nunca no cliente; validação em `env.ts` |
| Chaves JWT reais em README/issues | Vazamento de projeto | Proibido |

## 3. Controles implementados no app

### Autenticação e sessão

- Tokens Supabase em **Expo SecureStore** (native), nunca AsyncStorage.
- Web dev: `sessionStorage` com prefixo (tab-scoped) — aceitável para dev; **build mobile é o alvo de produção**.
- MFA TOTP opcional (Supabase Auth).
- Mensagens de login genéricas (`map-auth-error.ts`) — sem enumeração de usuário.

### Autorização

- **RLS** em todas as tabelas (definido nas migrations privadas).
- App usa apenas **anon key** + JWT do utilizador.
- `can_write_mission`, `can_write_colony_for_mission`, políticas de incident/alert — enforced no Postgres.
- UI `permissions.ts` é hint apenas; **RLS é a barreira real**.

### Dados e validação

- Zod em formulários (login, register, incidents, missions, colonies, alerts).
- `sanitizeDisplayName` / limites de tamanho.
- Repositórios sem concatenação SQL (PostgREST parametrizado).
- Audit log com blocklist de metadados sensíveis (`audit.service.ts`).

### Logging

- `logger` só em `__DEV__`; redação de chaves `password`, `token`, `jwt`, etc.

### Armazenamento de preferências

- Tema/sidebar: SecureStore (native) ou `sessionStorage` (web) — **não** guarda tokens.

## 4. Riscos residuais e mitigação

| Risco | Severidade | Mitigação |
|-------|------------|-----------|
| Anon key no bundle Expo (`EXPO_PUBLIC_*`) | Baixa (esperado) | RLS obrigatório; nunca `service_role` |
| Web: sessão em sessionStorage | Média (só web) | Usar build nativo em produção; HTTPS |
| MFA secret mostrado no enroll | Baixa (padrão TOTP) | Utilizador guarda no authenticator; ecrã único |
| Deep link `?open=id` | Baixa | RLS impede ler ID de outra missão |
| Dependências npm | Variável | `npm audit`; atualizar Expo periodicamente |
| Migrations fora do Git | Operacional | Backup privado da pasta `supabase/migrations/` |

## 5. Checklist antes de push no GitHub

```bash
# Nenhum .env tracked
git ls-files | grep -E '\.env'   # deve mostrar só .env.example

# Nenhum SQL tracked
git ls-files | grep '\.sql'      # deve estar vazio

# Sem service_role no código
grep -r "service_role" --include="*.ts" --include="*.tsx" src/
```

## 6. Alinhamento entregável acadêmico

| Pilar | Documento |
|-------|-----------|
| Threat modeling | [THREAT_MODEL.md](./THREAT_MODEL.md) |
| Pentest manual | [PENTEST_CHECKLIST.md](./PENTEST_CHECKLIST.md) |
| Resposta a incidentes | [INCIDENT_RESPONSE_PLAYBOOK.md](./INCIDENT_RESPONSE_PLAYBOOK.md) |
| Requisitos GS | `.cursor/docs/REQUIREMENTS_CYBERSECURITY.md` |

## 7. Conclusão

O repositório **pode ser público** após remover SQL e `.env` do histórico de tracking, desde que:

1. Migrations sejam aplicadas apenas no Supabase privado.
2. Cada developer use `.env` local gitignored.
3. RLS e Storage policies sejam revistos após cada alteração de schema (em ambiente privado).

**Nenhum sistema é “zero vulnerabilidade”** — o objetivo é superfície mínima, defesa em profundidade (cliente + RLS + MFA + auditoria).
