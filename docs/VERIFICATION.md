# ASTRA — Verificação pós-setup

Use este checklist depois de aplicar migrations e `seed.sql` no Supabase.

## 1. Auth

- [ ] Registo → email de confirmação → login
- [ ] Logout volta ao ecrã de login
- [ ] Perfil mostra nome, role e status `active`

## 2. Dashboard

- [ ] Cartões: missões ativas, incidentes abertos, alertas pendentes, colónias
- [ ] Gráficos de telemetria (O₂, temp, pressão) visíveis
- [ ] Toque num incidente recente abre **popup** (não muda de tab)

## 3. Missions & Colonies

- [ ] **+ Add** visível no canto superior direito
- [ ] Criar missão (código tipo `DEMO-02`, maiúsculas)
- [ ] Abrir missão → popup → **Edit** / **Delete**
- [ ] Colónias: criar, editar, apagar no popup

## 4. Incidents

- [ ] **+ Report** → GPS + fotos opcionais → sucesso
- [ ] Lista com filtros status/severidade
- [ ] Popup: descrição, GPS, fotos, timeline
- [ ] **Edit** e **Delete** no popup
- [ ] Incidente **high** ou **critical** gera alerta (tab Alerts)

## 5. Alerts

- [ ] Tab **Alerts** com badge se houver pendentes
- [ ] Filtro **Pending** funciona
- [ ] **Acknowledge alert** remove da lista pendente
- [ ] (Opcional) Abrir outro cliente / SQL insert → lista atualiza (Realtime)

## 6. Security (academic)

- [ ] Perfil → MFA enroll (opcional) com app autenticador
- [ ] `security_officer` / `system_admin` vê audit log no perfil
- [ ] Docs: `THREAT_MODEL.md`, `INCIDENT_RESPONSE_PLAYBOOK.md`, `PENTEST_CHECKLIST.md`

## SQL rápido (Supabase)

```sql
-- Confirmar tabelas
select table_name from information_schema.tables
where table_schema = 'public'
order by table_name;

-- Alertas pendentes
select count(*) from public.alerts where acknowledged_at is null;

-- Telemetria
select count(*) from public.colony_telemetry;
```

## Problemas comuns

| Sintoma | Solução |
|---------|---------|
| Lista vazia | Reexecutar `seed.sql` com utilizador registado |
| Erro ao criar missão | Código `ART-01` formato: `A-Z0-9-`, 2–16 chars |
| Sem gráficos | Seed telemetria + pelo menos 1 colónia visível |
| Realtime não atualiza | Dashboard → Database → Replication → `alerts` ON |
| Sem botões Edit/Delete | Pull to refresh; verificar membership em `mission_members` |
