-- Migration 006: Add default shipping address to user profiles
-- Run in Supabase SQL Editor

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS default_shipping_address JSONB;
