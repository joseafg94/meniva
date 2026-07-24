-- Agregar campos de información del local al restaurante
alter table restaurants
  add column if not exists is_open boolean default null,
  add column if not exists footer_address text,
  add column if not exists footer_phone text;
