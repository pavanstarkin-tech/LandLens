# LandLens 🌍🔍

[![Java Version](https://img.shields.io/badge/Java-21-orange.svg)](https://adoptium.net/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.0-green.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6.svg)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-blue.svg)](https://www.docker.com/)
[![AWS](https://img.shields.io/badge/AWS-ECS%20%7C%20CloudFront-FF9900.svg)](https://aws.amazon.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1.svg)](https://www.mysql.com/)

<p align="center">
  <img src="./frontend-react/public/logo.png" alt="LandLens Logo" width="260"/>
</p>

<p align="center">
  <a href="https://dpyyh7torlown.cloudfront.net">
    <img src="https://img.shields.io/badge/Live_Production-https%3A%2F%2Fdpyyh7torlown.cloudfront.net-brightgreen?style=for-the-badge&logo=amazonaws" alt="Live Production URL"/>
  </a>
</p>

### 🌐 **Live Deployed Web Portal:** [https://dpyyh7torlown.cloudfront.net](https://dpyyh7torlown.cloudfront.net)

---

## 📑 Table of Contents
1. [Project Description](#1-project-description)
2. [Meet Team Pixel Pirates](#2-meet-team-pixel-pirates)
3. [Key Features](#3-key-features)
4. [Technology Stack](#4-technology-stack)
5. [Live Deployment & Infrastructure Endpoints](#5-live-deployment--infrastructure-endpoints)
6. [Folder & Package Structure](#6-folder--package-structure)
7. [System Architecture & Sequence Diagrams](#7-system-architecture--sequence-diagrams)
8. [Database Setup & Entity Relationship Diagram (ERD)](#8-database-setup--entity-relationship-diagram-erd)
9. [Complete REST API Directory](#9-complete-rest-api-directory)
10. [Local Development & Setup Guide](#10-local-development--setup-guide)
11. [Environment Variables Reference](#11-environment-variables-reference)
12. [Build & Testing Instructions](#12-build--testing-instructions)
13. [Security, Auth & Rate Limiting](#13-security-auth--rate-limiting)
14. [Multi-Cloud Deployment Options](#14-multi-cloud-deployment-options)
15. [AWS Infrastructure Cost Projections](#15-aws-infrastructure-cost-projections)
16. [Future Roadmap & Improvements](#16-future-roadmap--improvements)
17. [Contributing & License](#17-contributing--license)

---

## 1. Project Description

**LandLens** is a secure, high-performance web platform designed to digitize, verify, and automate land registry processes to prevent real estate fraud, overlap claims, and document forgery. 

By integrating Optical Character Recognition (OCR), AI-driven duplicate claims detection, 360° interactive virtual property tours, and a multi-level review workflow (including government inspectors), LandLens provides a single source of truth for land asset listings.

---

## 2. Meet Team Pixel Pirates

Behind **LandLens** is the **Pixel Pirates** team—6 dedicated engineers who architected, designed, built, automated, and deployed this platform:

| Avatar | GitHub Profile | Role & Contributions |
| :---: | :--- | :--- |
| <img src="https://github.com/santhipriyaa27.png" width="60" style="border-radius: 15px;"/> | [@santhipriyaa27](https://github.com/santhipriyaa27)<br>*(Santhi Priya)* | **Team Lead, DevOps & QA Automation**<br>Lead project manager; architected Jenkins CI/CD automation pipelines, SonarQube code quality auditing (`automate_sonar.py`), bug tracking, test execution, and quality control. |
| <img src="https://github.com/hemanthkotipalli.png" width="60" style="border-radius: 15px;"/> | [@hemanthkotipalli](https://github.com/hemanthkotipalli)<br>*(Hemanth Kotipalli)* | **AI & GenAI Systems Engineer**<br>Built the interactive AI Chatbot assistant, OCR document extraction pipeline, GenAI verification algorithms, and automated land trust score calculations. |
| <img src="https://github.com/keerthithammisetty.png" width="60" style="border-radius: 15px;"/> | [@keerthithammisetty](https://github.com/keerthithammisetty)<br>*(Keerthi Thammisetty)* | **Database Architect & Schema Designer**<br>Engineered and normalized the 3NF relational database schema (`schema.sql`), optimized JPA query relationships, entity mappings, and database transaction boundaries. |
| <img src="https://github.com/Pavankumarswamy.png" width="60" style="border-radius: 15px;"/> | [@Pavankumarswamy](https://github.com/Pavankumarswamy)<br>*(Pavan Kumar Swamy)* | **Frontend UI/UX Designer & Lead Engineer**<br>Designed and implemented the glassmorphic React 18 UI, role-based dashboards (Buyer, Provider, Officer, Admin), Mapbox GL JS map engine, and 360° virtual tour player. |
| <img src="https://github.com/ramasai98.png" width="60" style="border-radius: 15px;"/> | [@ramasai98](https://github.com/ramasai98)<br>*(Rama Sai)* | **DevOps & Cloud Infrastructure Architect**<br>Architected the AWS Cloud topology—configuring CloudFront CDN edge distribution, S3 static hosting, ECS Fargate container clusters, ALB load balancers, and Terraform IaC scripts. |
| <img src="https://github.com/vasavi985.png" width="60" style="border-radius: 15px;"/> | [@vasavi985](https://github.com/vasavi985)<br>*(Rama Vasavi Patchikolla)* | **Backend Lead Developer**<br>Engineered the core Spring Boot 3.4 (Java 21) REST API services, Spring Security JWT authentication framework, role-based authorization filters, and analytics aggregators. |

---

## 3. Key Features

*   **Role-Based Access Control (RBAC)**: Managed user roles (`ADMIN`, `GOVERNMENT_OFFICER`, `PROVIDER`, `BUYER`) using stateless JWT sessions (with access and refresh token rotation) and BCrypt password encryption.
*   **Property Listing & Asset Management**: Cataloging of agricultural, commercial, industrial, and residential properties with coordinate tracking (latitude/longitude), address resolution, and pricing structures.
*   **Property Media & Virtual Tours**: Standard images, video walkthrough tours, and interactive 360-degree panorama viewer uploads.
*   **Verification Documents & OCR**: Registry document uploads (Patta, Sale Deeds, Tax Receipts) supporting OCR queues and verification statuses.
*   **AI Verification Engine & Valuations**: Asynchronous trust scoring, forgery evaluation, duplicate listing detection, coordinate overlap calculations, AI price estimations, and automated AI chat queries.
*   **Government Review Workflow**: Inspection audit trails, timeline transitions (`UPLOADED`, `AI_STARTED`, `APPROVED`, `REJECTED`), and officer remark logs.
*   **Buyer Interactions**: Property watchlists (saved items) and tour visit scheduling (date/time/status).
*   **Developer API Integration**: Dynamic API key generation, request logging (endpoint, status code, latency, IP), and rate limiting.
*   **Analytics Aggregator**: Daily analytics pre-aggregation scheduler summarizing views, searches, verifications, frauds, and API usage statistics for dashboard reporting.

---

## 4. Technology Stack

### **Frontend (`/frontend-react`)**
*   **Framework & Build**: React 18, Vite, TypeScript
*   **Styling & UI**: Tailwind CSS (PostCSS), Glassmorphism design system, Lucide React icons
*   **Mapping & GIS**: Mapbox GL JS (Custom boundary drawing, clustering, survey overlays)
*   **Virtual Tours**: Pannellum 360° interactive panorama viewer
*   **HTTP Client**: Axios with automated JWT Bearer interceptors & error handlers

### **Backend (`/back_end`)**
*   **Core Framework**: Spring Boot 3.4.0 (Java 21)
*   **Security & Auth**: Spring Security, JWT (JJWT 0.12.5), BCrypt
*   **Database & ORM**: Hibernate (JPA), MySQL Connector J, HikariCP Connection Pool
*   **API Specs**: Springdoc OpenAPI / Swagger UI (v2.8.9)
*   **Health & Metrics**: Spring Boot Actuator

### **DevOps, Quality & Cloud Infrastructure**
*   **Frontend Hosting**: AWS S3 Bucket + Amazon CloudFront CDN (Global Edge Delivery)
*   **Backend Hosting**: AWS ECS Fargate Tasks behind AWS Application Load Balancer (ALB)
*   **Network Egress**: AWS NAT Gateway (`13.207.227.126` Egress IP)
*   **Code Quality**: SonarQube Static Analysis & Automated Python Sonar Runner (`automate_sonar.py`)
*   **CI/CD & Automation**: GitHub Actions, Jenkins, PowerShell/Bash Cloud Deployment Pipelines (`deploy.ps1`)

---

## 5. Live Deployment & Infrastructure Endpoints

Production servers are live in the AWS Mumbai (`ap-south-1`) region:

*   **Live Web Portal**: `https://dpyyh7torlown.cloudfront.net`
*   **Backend Load Balancer Base URL**: `http://landlens-production-alb-1919392235.ap-south-1.elb.amazonaws.com`
*   **Health Check (Actuator)**: `http://landlens-production-alb-1919392235.ap-south-1.elb.amazonaws.com/actuator/health`
*   **Swagger Documentation**: `http://landlens-production-alb-1919392235.ap-south-1.elb.amazonaws.com/swagger-ui/index.html` *(Dev profile)*
*   **Production Database (Hostinger)**: `srv1117.hstgr.io:3306` (Schema: `u833088220_Priya_teamlead`)
*   **NAT Gateway Public Egress IP**: `13.207.227.126` (Whitelisted in Hostinger Remote MySQL settings)

---

## 6. Folder & Package Structure

### Root Directory Overview
```text
LandLense/
 ├── README.md                      # Master Project & Team Documentation
 ├── automate_sonar.py              # Automated SonarQube Code Quality Analysis Script
 ├── update_cf.py                   # CloudFront CDN Infrastructure Configuration Script
 ├── frontend-react/                # Production React 18 + Vite Frontend Application
 │    ├── src/                      # Components, Dashboards, Mapbox & Services
 │    ├── public/                   # Static Media Assets (logo.png, icons)
 │    ├── .github/workflows/        # Automated Deployment CI/CD Workflow
 │    ├── package.json              # React Dependencies & Scripts
 │    └── vite.config.ts            # Vite Compiler Configuration
 └── back_end/                      # Spring Boot 3.4 (Java 21) REST Backend Application
      ├── src/main/java/com/landlens/ # Feature Packages (Auth, Property, AI, Fraud, etc.)
      ├── src/main/resources/       # schema.sql, application.properties
      ├── terraform/                # Infrastructure-as-Code for AWS ECS/ALB/VPC
      ├── deploy.ps1                # Automated Windows Deployment Pipeline
      ├── deploy.sh                 # Automated Linux Deployment Pipeline
      ├── Dockerfile                # Multi-stage Docker Container Definition
      └── pom.xml                   # Maven Dependencies & Build Definitions
```

### Spring Boot Package Layout (`com.landlens`)
```text
com.landlens
 ├── LandlensApplication.java  # Application Entry Point
 ├── auth                      # Authorization, Security Config, and Users
 ├── user                      # User Profile Management
 ├── property                  # Listings, Images, Videos, Saved, & Bookings
 ├── document                  # Verification registry document uploads
 ├── verification              # Government Review and Timeline transitions
 ├── ai                        # AI scoring outputs, valuation and chatbot
 ├── fraud                     # Duplicate claim coordinates & community reports
 ├── notification              # Real-time alerts and user logs
 ├── api                       # Developer API key, rate-limiting, and logs
 └── analytics                 # Daily dashboard statistics pre-aggregation
```

---

## 7. System Architecture & Sequence Diagrams

### A. AWS Network Topology
```mermaid
graph TD
    Client[Client / Frontend Web & Mobile] -->|1. HTTPS Request| CF[Amazon CloudFront CDN]
    CF -->|2. Fetch Static UI| S3[Amazon S3 Bucket]
    CF -->|3. Route /api/*| ALB[Application Load Balancer]
    
    subgraph VPC [AWS VPC - Mumbai Region ap-south-1]
        ALB -->|4. Forward Port 8080| ECS[ECS Fargate Tasks]
        
        subgraph PrivateSubnets [Private Subnets]
            ECS
        end
        
        subgraph PublicSubnets [Public Subnets]
            ALB
            NAT[NAT Gateway]
        end
        
        ECS -->|5. Outbound Traffic| NAT
    end

    NAT -->|6. Egress IP: 13.207.227.126| DB[(Hostinger Remote MySQL DB)]
    ECS -->|7. Asynchronous OCR & Trust Evaluation| AI[AI Verification Engine]
```

### B. Application Request Processing Lifecycle
```mermaid
sequenceDiagram
    autonumber
    actor Client
    participant Security as Spring Security Filter Chain
    participant Controller as REST Controller
    participant Service as Service Layer
    participant Repos as JPA Repository
    participant DB as Hostinger MySQL DB
    participant AI as AI Engine & OCR

    Client->>Security: Send HTTP Request (e.g., POST /api/properties)
    alt Anonymous path permitted (e.g., /actuator/health)
        Security->>Controller: Forward to Controller
    else Protected path
        Note over Security: Validate JWT token from Authorization header
        alt JWT Valid
            Security->>Controller: Forward with Auth Principal
        else JWT Invalid / Missing
            Security-->>Client: Return 401 Unauthorized / 403 Forbidden
        end
    end

    Controller->>Service: Call Business Logic (e.g., createProperty)
    Service->>Repos: Invoke Database Operation
    Repos->>DB: Query / Insert / Update (SQL)
    DB-->>Repos: Return Result Sets
    Repos-->>Service: Return Entity Model

    opt Needs AI Verification (Documents Uploaded)
        Service->>AI: Trigger Asynchronous Verification Task
        Note over AI: Process OCR (Patta/Sale Deed) & evaluate Trust Score
        AI->>DB: Update Verification Results & Scores
    end

    Service-->>Controller: Return DTO Payload
    Controller-->>Client: Return JSON Response + HTTP Status 200/201
```

### C. Property Verification State Machine
```mermaid
stateDiagram-v2
    [*] --> UPLOADED : User Uploads Land Details & Deeds
    
    UPLOADED --> AI_VERIFICATION_PENDING : Trigger OCR & AI Checks
    
    state AI_VERIFICATION_PENDING {
        [*] --> ExtractingDocuments
        ExtractingDocuments --> CalculatingTrustScore
        CalculatingTrustScore --> CheckingSpatialOverlap
    }
    
    AI_VERIFICATION_PENDING --> AI_REJECTED : Forgery / Overlap Detected
    AI_VERIFICATION_PENDING --> PENDING_GOVT_AUDIT : High Trust Score (Passed AI)
    
    PENDING_GOVT_AUDIT --> APPROVED : Officer Approves Claim
    PENDING_GOVT_AUDIT --> REJECTED : Officer Rejects Claim
    
    APPROVED --> LIVE : Published on Marketplace
    LIVE --> DISPUTED : Community Fraud Report Filed
    
    DISPUTED --> PENDING_GOVT_AUDIT : Re-audit Investigation
    
    AI_REJECTED --> [*]
    REJECTED --> [*]
```

### D. AI Price Estimation Flow
```mermaid
sequenceDiagram
    participant User as Buyer / Provider
    participant React as React Frontend
    participant Gateway as AWS CloudFront / ALB
    participant AI as Spring Boot AI Engine
    participant DB as Hostinger MySQL DB

    User->>React: Input Survey No, Area & Coordinates
    React->>Gateway: POST /api/ai/estimate-price
    Gateway->>AI: Forward Request Payload
    AI->>DB: Fetch Local Historical Sales & Base Rates
    DB-->>AI: Return Benchmark Data
    AI->>AI: Execute ML Valuation Model
    AI-->>Gateway: Return Price Range, SqFt Rate & Confidence Score
    Gateway-->>React: JSON Response Payload
    React-->>User: Render Interactive Valuation Breakdown
```

---

## 8. Database Setup & Entity Relationship Diagram (ERD)

The MySQL database schema is strictly normalized into **3NF (Third Normal Form)** tables. Every table includes audit attributes (`id` UUID string, `created_at`, `updated_at`, `is_active` soft-delete flag).

```mermaid
erDiagram
    roles ||--o{ users : "assigns"
    users ||--o{ refresh_tokens : "generates"
    users ||--o{ login_histories : "attempts"
    users ||--o{ properties : "owns"
    users ||--o{ government_verifications : "performs"
    users ||--o{ verification_timelines : "triggers"
    users ||--o{ fraud_reports : "reports"
    users ||--o{ fraud_reports : "investigates"
    users ||--o{ property_visits : "schedules"
    users ||--o{ saved_properties : "saves"
    users ||--o{ notifications : "receives"
    users ||--o{ ai_conversations : "starts"
    users ||--o{ api_keys : "creates"

    properties ||--o{ property_images : "has"
    properties ||--o{ property_videos : "has"
    properties ||--o{ property_documents : "requires"
    properties ||--|| ai_verifications : "analyzed"
    properties ||--|| government_verifications : "assessed"
    properties ||--o{ verification_timelines : "logs"
    properties ||--o{ duplicate_claims : "acts-as-A"
    properties ||--o{ duplicate_claims : "acts-as-B"
    properties ||--o{ fraud_reports : "accused-in"
    properties ||--o{ property_visits : "hosts"
    properties ||--o{ saved_properties : "saved-in"

    ai_conversations ||--o{ ai_messages : "contains"
    api_keys ||--o{ api_usages : "tracks"
    api_keys ||--o{ api_logs : "records"
    api_keys ||--|| api_rate_limits : "restricts"
```

---

## 9. Complete REST API Directory

### 🔐 1. Authentication (`/api/auth`)
*   `POST /api/auth/register` — Register new user account (`BUYER`, `PROVIDER`, `GOVERNMENT_OFFICER`, `ADMIN`)
*   `POST /api/auth/login` — Authenticate credentials & generate JWT Access/Refresh tokens
*   `POST /api/auth/refresh` — Rotate expired access token using valid refresh token
*   `POST /api/auth/logout` — Revoke active refresh token session
*   `GET /api/auth/me` — Fetch currently authenticated user profile

### 🏡 2. Property Management (`/api/properties`)
*   `GET /api/properties` — Search & list properties with filters (city, state, price range, land type)
*   `GET /api/properties/{id}` — Fetch detailed property metadata, images, videos, and verification status
*   `POST /api/properties` — Create a new property listing (Providers only)
*   `PUT /api/properties/{id}` — Update existing property details
*   `DELETE /api/properties/{id}` — Soft-delete property listing (Admin/Owner)
*   `POST /api/properties/{id}/images` — Upload property gallery photos
*   `POST /api/properties/{id}/video` — Upload property walk-through video
*   `POST /api/properties/{id}/panorama` — Upload 360° virtual tour panorama image

### 📄 3. Documents & Verification (`/api/documents` & `/api/verification`)
*   `POST /api/documents/upload` — Upload land deed, Patta, tax receipt, or survey certificate
*   `GET /api/documents/property/{propertyId}` — Retrieve documents attached to a property
*   `GET /api/verification/{propertyId}` — View government audit status & AI verification score
*   `POST /api/verification/{propertyId}/approve` — Officer approval of land verification
*   `POST /api/verification/{propertyId}/reject` — Officer rejection with audit remarks
*   `GET /api/verification/{propertyId}/timeline` — Audit log timeline of state changes

### 🤖 4. AI Engine & Valuation (`/api/ai`)
*   `POST /api/ai/estimate-price` — Calculate AI market valuation based on survey number & coordinates
*   `POST /api/ai/verify-documents` — Trigger OCR document text extraction & authenticity validation
*   `POST /api/ai/chat` — Interact with LandLens AI conversational assistant

### 🚨 5. Fraud Detection (`/api/fraud`)
*   `POST /api/fraud/report` — Submit community land dispute or fraud report
*   `GET /api/fraud/overlap-check` — Evaluate spatial coordinate overlaps between registered lands
*   `GET /api/fraud/reports` — Review fraud investigation queue (Admin/Officer)

### 📈 6. Analytics & API Key Operations (`/api/analytics` & `/api/developer`)
*   `GET /api/analytics/daily` — Daily pre-aggregated platform metrics (views, listings, verifications)
*   `POST /api/developer/keys` — Generate developer API access key
*   `GET /api/developer/usage` — Track API request usage and rate-limit counters

---

## 10. Local Development & Setup Guide

### A. Frontend Setup (`/frontend-react`)
```bash
cd frontend-react
npm install
npm run dev
```
The frontend will run at `http://localhost:5173`.

### B. Backend Setup (`/back_end`)
```powershell
cd back_end
.\mvnw.cmd spring-boot:run
```
The server will start listening at `http://localhost:8080`.

### C. Docker Compose (Full Stack Local Orchestration)
```bash
docker-compose up --build -d
```
Boots MySQL 8.0 and the Spring Boot service cleanly in an isolated Docker container network.

---

## 11. Environment Variables Reference

| Variable Name | Description | Default Fallback (Development) |
|---|---|---|
| `DB_URL` | JDBC Connection URL for MySQL | `jdbc:mysql://localhost:3306/landlens?useSSL=false...` |
| `DB_USERNAME` | Database Authentication User | `root` |
| `DB_PASSWORD` | Database Authentication Password | `[blank]` |
| `JWT_SECRET` | HMAC SHA-256 Signature Secret | `9a2f3f4e5d6c7b8a9f0e1d2c3b4a5f6e7d8c9b0a1f2e3d4c5b6a7f8e9d0c1b2a3` |
| `JWT_EXPIRATION_MS` | JWT Access Token duration (ms) | `86400000` (24 Hours) |
| `JWT_REFRESH_EXPIRATION_MS` | Refresh Token expiry duration (ms) | `2592000000` (30 Days) |
| `SPRING_PROFILES_ACTIVE` | Active profile (`prod` or `dev`) | `default` |
| `PORT` | Embedded server port | `8080` |

---

## 12. Build & Testing Instructions

### Compile Backend `.jar`
```powershell
.\mvnw.cmd clean package -DskipTests
```

### Run JUnit Test Suite
```powershell
.\mvnw.cmd test
```

> [!IMPORTANT]
> **Database Requirement for Tests**: Ensure MySQL is running locally on port 3306 (`docker-compose up mysql`) before running tests, or pass `-DskipTests` during build execution.

---

## 13. Security, Auth & Rate Limiting

*   **Credential Encryption**: Hashing using BCrypt for password fields.
*   **Token Authorization**: Custom `JwtAuthenticationFilter` intercepts HTTP headers to validate bearer signatures.
*   **External API Guarding**: Interceptor (`ApiKeyInterceptor`) locks all `/api/v1/external/**` routes requiring `x-api-key`.
*   **Rate Limits**: Automated tracker logs developer usage and blocks keys exceeding defined thresholds (`429 Rate Limit Exceeded`).

---

## 14. Multi-Cloud Deployment Options

LandLens supports cloud-agnostic container deployments:

1.  **AWS ECS Fargate + ALB**: Primary production pipeline (`.\deploy.ps1` or `./deploy.sh`).
2.  **Koyeb (`koyeb.yaml`)**: Container deployment pulling secrets from environment configurations.
3.  **Render (`render.yaml`)**: Render Blueprint setup building directly from `Dockerfile`.
4.  **Railway (`railway.json`)**: Multi-replica container deployment.
5.  **DigitalOcean App Platform (`app.yaml`)**: Two-instance configuration with health checks.

---

## 15. AWS Infrastructure Cost Projections

| User Scale | Frontend (S3 + CloudFront) | Backend API (ECS Fargate + ALB) | Database (MySQL / RDS) | Networking & Egress (NAT Gateway) | Total Estimated Monthly Cost |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **100 Users** | **$0 - $2** *(CloudFront Free Tier)* | **$26 - $30** | **$10 - $15** *(Hostinger / Small)* | **$32 - $35** | **~$68 - $85 / mo** (~₹5.5k - ₹7k) |
| **1,000 Users** | **$2 - $5** | **$45 - $55** | **$25 - $40** *(RDS db.t4g.small)* | **$35 - $40** | **~$110 - $140 / mo** (~₹9k - ₹11.5k) |
| **10,000 Users** | **$100 - $150** | **$165 - $230** | **$150 - $250** *(RDS Multi-AZ)* | **$60 - $90** | **~$600 - $800 / mo** (~₹50k - ₹66k) |
| **100,000 (1 Lakh)**| **$1,200 - $1,800** | **$950 - $1,450** | **$800 - $1,500** *(Aurora Serverless)* | **$200 - $350** | **~$3,500 - $5,000 / mo** (~₹2.9L - ₹4.1L) |

---

## 16. Future Roadmap & Improvements

*   **Test Isolation with H2**: Mock H2 in-memory profile (`application-test.properties`) so build steps execute offline cleanly.
*   **Redis Caching Layer**: Cache wrapper for public property search endpoints to reduce DB hits.
*   **Asynchronous Message Queue**: Transition AI processing and OCR triggers from inline threads to RabbitMQ/Kafka.
*   **Geospatial Indexes**: Spatial datatypes using `Hibernate Spatial` + `MySQL Spatial` to support polygon land searches.

---

## 17. Contributing & License

1.  Create a feature branch from `main` (`git checkout -b feature/amazing-feature`).
2.  Commit your changes using meaningful, structured commit messages.
3.  Submit a Pull Request targeting the `main` branch.

*Developed with ❤️ by **Team Pixel Pirates** (Santhi Priya, Hemanth Kotipalli, Keerthi Thammisetty, Pavan Kumar Swamy, Rama Sai, and Rama Vasavi).*
