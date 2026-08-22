# Expenser Backend

Backend API for **Kutta** — a personal AI voice-first expense tracker.

## Overview

This service handles transaction storage, validation, and business logic (split calculations, timestamps) for Kutta. It never trusts the LLM layer for financial calculations, authorization, or database writes — all AI-generated input is validated before reaching the database.

## Tech Stack

- **Runtime:** Node.js + TypeScript
- **API Framework:** Fastify
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Validation:** Zod

## Project Structure


## commit descriptions
1. Branch: feat/transactions-api-setup
commit msg: feat: add transaction creation with equal/custom split support

- Zod validation for transaction input
- Business logic for none/equal/custom split calculation
- Prisma schema with TransactionPerson relation
- POST /transactions endpoint

2. Branch: feat/transactions-list-filters
feat: add GET /transactions with pagination and timezone-aware period filters

- Supports hourly/daily/weekly/monthly/yearly filtering
- Period boundaries computed in client's local timezone, converted to UTC for DB queries
- Standard offset pagination (page/limit)