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
feat: add transaction creation with equal/custom split support

- Zod validation for transaction input
- Business logic for none/equal/custom split calculation
- Prisma schema with TransactionPerson relation
- POST /transactions endpoint

