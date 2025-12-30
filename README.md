# ShieldGate API Gateway

**Cloudflare/AWS-style API Gateway – Simplified, TypeScript + Node.js**

---

## Overview

ShieldGate is a **high-performance, multi-tenant API gateway** built with TypeScript and Node.js. It separates the **data plane** (fast request path) from the **control plane** (config & policy management), implements **rate limiting**, **policy enforcement**, and **failure-resilient behavior**, and is designed for **observability and operational safety**.

---

## Features

### Fast Path (Data Plane)
- API request routing via **Fastify**
- **Tenant-aware** request identification
- **Rate limiting**:
  - Sliding window
  - Token bucket
- Immediate request rejection on limit breach (429)

### Control Plane
- Manage tenants and policies independently
- Versioned policies with rollback support
- Admin APIs for configuration

### Multi-Tenancy & Policy Engine
- Tenant isolation
- Config-driven policies
- Hot-key sharding to prevent Redis bottlenecks

### Observability & Async Processing
- Event emission for metrics/logging
- Queue-based aggregation (BullMQ + Redis)
- Prometheus + Grafana for monitoring

### Failure Handling Philosophy
- **Redis down** → fail-open or fail-closed per tenant
- **Queue down** → drop events, never block traffic
- **Control plane down** → traffic continues using cached policies
- Graceful degradation is always prioritized

### Optional GenAI-Assisted Intelligence
- Explainable abuse detection
- Adaptive rate limiting
- Human-readable alerts

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Server | Node.js + TypeScript |
| Framework | Fastify / NestJS |
| Cache | Redis |
| DB | Postgres (control plane) |
| Queue | BullMQ |
| Observability | Prometheus, Grafana |
| Dev Tools | ESLint, Prettier, Husky, lint-staged |

---

## Architecture Phases

1. **Foundation**: Data plane vs Control plane, API contracts  
2. **Core Gateway & Rate Limiting**: Fast path enforcement  
3. **Multi-Tenancy & Policy Engine**: Config-driven rules  
4. **Async Event Pipeline & Observability**: Slow path, metrics, analytics  
5. **Abuse Detection & GenAI**: Optional AI-powered insights  
6. **Reliability & Failure Handling**: Fail-open/closed, circuit breakers, audit logs

---

## Request Lifecycle (Fast Path)

**Example: Shopify storefront request**

```bash
Client → ShieldGate → Shopify Backend
```


**Steps:**

1. Receive request (Fastify)
2. Identify tenant via API key
3. Fetch policy from in-memory cache or Redis
4. Rate limit check (Redis Lua script)
5. Decision: allow or reject (429)
6. Proxy request to backend
7. Emit async event (metrics/logs)
8. Return response

---

## Failure Handling Summary

| Component | Normal Behavior | Failure Behavior |
|-----------|----------------|----------------|
| Redis     | Rate limiting counters, policy cache | Fail-open/fail-closed per tenant; never block traffic |
| Queue     | Async events for analytics | Drop events; request latency unaffected |
| DB        | Control plane writes | Admin operations fail; existing policies remain active |
| Control Plane | Policy updates & admin API | Live traffic unaffected using cached policies |

**Golden Rule:** Traffic must **never hang**, and failures must degrade **gracefully, not catastrophically**.

---

## Getting Started

```bash
# Clone repo
git clone https://github.com/vinaysolaskar/api-gateway.git
cd api-gateway

# Install dependencies
npm install

# Run development server
npm run dev
```

## Dev Guidelines

Commit messages: follow conventional commits (feat, chore, fix, docs)

Branching: main = stable, develop = staging, feature/* for tasks

Pre-commit hooks: lint-staged for ESLint + Prettier checks

Testing: Add unit/integration tests in tests/ folder