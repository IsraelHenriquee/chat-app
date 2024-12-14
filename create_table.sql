-- Habilitar a extensão pgcrypto se ainda não estiver habilitada
create extension if not exists pgcrypto;

-- Criar a tabela de mensagens
create table if not exists messages (
    id bigint primary key generated always as identity,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    content text not null,
    is_sent boolean default true
);

-- Habilitar Realtime para a tabela messages
alter publication supabase_realtime add table messages;

-- Políticas de segurança para permitir acesso anônimo (para teste)
alter table messages enable row level security;

create policy "Permitir leitura anônima de mensagens"
on messages for select
to anon
using (true);

create policy "Permitir inserção anônima de mensagens"
on messages for insert
to anon
with check (true);
