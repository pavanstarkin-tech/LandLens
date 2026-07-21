# LandLens 🌍🔍 — AI-Powered Government Land Verification & Fraud Prevention Platform

[![Java Version](https://img.shields.io/badge/Java-21-orange.svg)](https://adoptium.net/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.0-green.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6.svg)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-blue.svg)](https://www.docker.com/)
[![AWS](https://img.shields.io/badge/AWS-ECS%20%7C%20CloudFront-FF9900.svg)](https://aws.amazon.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1.svg)](https://www.mysql.com/)

<p align="center">
  <img src="./frontend-react/public/logo.png" alt="LandLens Logo" width="280"/>
</p>

<p align="center">
  <a href="https://dpyyh7torlown.cloudfront.net">
    <img src="https://img.shields.io/badge/Live_Production-https%3A%2F%2Fdpyyh7torlown.cloudfront.net-brightgreen?style=for-the-badge&logo=amazonaws" alt="Live Production URL"/>
  </a>
</p>

### 🌐 **Live Production Web Portal:** [https://dpyyh7torlown.cloudfront.net](https://dpyyh7torlown.cloudfront.net)

---

## 📑 Master Table of Contents
1. [Real-Time Need & Problem Statement](#1-real-time-need--problem-statement)
2. [Project Abilities & Core Advantages](#2-project-abilities--core-advantages)
3. [Application Screenshots & UI Showcase](#3-application-screenshots--ui-showcase)
4. [Team Members & Key Contributions](#4-team-members--key-contributions)
5. [1-Week Rapid Implementation Sprint & Bug Fixes](#5-1-week-rapid-implementation-sprint--bug-fixes)
6. [Complete Technology Stack by Service](#6-complete-technology-stack-by-service)
7. [Platform & Cloud Infrastructure Services](#7-platform--cloud-infrastructure-services)
8. [Live Deployment & Production Endpoints](#8-live-deployment--production-endpoints)
9. [Folder & Package Architecture](#9-folder--package-architecture)
10. [System Architecture & Sequence Diagrams](#10-system-architecture--sequence-diagrams)
11. [Database Module Overview & Table Directory](#11-database-module-overview--table-directory)
12. [Detailed Table Schemas & Column Specifications](#12-detailed-table-schemas--column-specifications)
13. [Full Entity Relationship Diagram (ERD)](#13-full-entity-relationship-diagram-erd)
14. [Complete REST API Directory](#14-complete-rest-api-directory)
15. [Local Development & Setup Guide](#15-local-development--setup-guide)
16. [Environment Variables Reference](#16-environment-variables-reference)
17. [Security, Auth & Rate Limiting](#17-security-auth--rate-limiting)
18. [Application Scalability & Performance](#18-application-scalability--performance)
19. [AWS Infrastructure Cost Projections](#19-aws-infrastructure-cost-projections)
20. [Future Roadmap & Improvements](#20-future-roadmap--improvements)
21. [Contributing & License](#21-contributing--license)

---

## 1. Real-Time Need & Problem Statement

Real estate and land transactions are plaguing buyers, financial institutions, and government authorities with multi-billion-dollar annual losses due to:
*   **Forged Land Deeds & Documents**: Unscrupulous sellers uploading fake Patta or altered sale deeds.
*   **Double-Selling & Overlap Claims**: Selling the same piece of land to multiple buyers or claiming overlapping survey boundaries.
*   **Manual Inspection Bottlenecks**: Government officers spending weeks conducting physical site visits to verify boundary coordinates and ownership claims.
*   **Lack of Remote Trust**: Buyers buying land remotely without an immutable audit trail or interactive 360° visual evidence.

### 💡 The LandLens Solution
**LandLens** introduces an immutable, AI-driven government land verification portal. By combining **Optical Character Recognition (OCR)**, **AI Trust Scoring**, **Mapbox GIS Spatial Overlap Detection**, and **360° Panoramic Virtual Tours**, LandLens digitizes land verification into a seamless, automated, and fraud-proof experience.

---

## 2. Project Abilities & Core Advantages

*   ⚡ **Instant AI Document Verification**: Uploaded Patta, sale deeds, and tax receipts undergo automated OCR processing and AI forgery evaluation within seconds.
*   🗺️ **Interactive GIS Boundary Mapping**: Mapbox GL JS engine lets users draw, cluster, and verify exact polygon survey boundaries to catch spatial overlap claims.
*   🌐 **360° Virtual Panoramic Tours**: Allows prospective buyers and government inspectors to inspect land plots remotely in immersive 360° VR without traveling.
*   🛡️ **Multi-Tiered Government Audit Trail**: Officer verification dashboard with remarks, timeline logs (`UPLOADED` ➔ `AI_CHECK` ➔ `APPROVED` / `REJECTED`), and immutable state tracking.
*   🔑 **Developer API Ecosystem**: Allows third-party fintech, banking, and real estate apps to query land verification status via secured rate-limited API keys.

---

## 3. Application Screenshots & UI Showcase

Below is an interactive visual walkthrough of the live **LandLens** platform structured in a 3-column showcase:

### 🔐 1. Authentication, Portals & Buyer Dashboard
| Login Portal (Desktop) | Mobile Responsive Interface | Buyer Dashboard & Overview |
| :---: | :---: | :---: |
| ![Login Desktop](./dashscreenshots/login-desktop.png) | ![Login Mobile](./dashscreenshots/login-mobile.png) | ![Buyer Dashboard](./dashscreenshots/userdash.png) |

---

### 🗺️ 2. Property Marketplace, GIS Mapping & Location Details
| Property Exploration Marketplace | Mapbox GIS Boundaries | Spatial Coordinates & Land Details |
| :---: | :---: | :---: |
| ![Property Marketplace](./dashscreenshots/userexplore.png) | ![Mapbox Boundaries](./dashscreenshots/usermap.png) | ![Location Details](./dashscreenshots/loacationdetaislofland.png) |

---

### 🤖 3. AI Trust Analysis, Property Details & Seller Portal
| AI Document Verification Analysis | Property Overview & 360° VR | Land Provider / Seller Dashboard |
| :---: | :---: | :---: |
| ![AI Analysis](./dashscreenshots/aianalysis.png) | ![Property Details](./dashscreenshots/propertydetails.png) | ![Seller Dashboard](./dashscreenshots/sellerdash.png) |

---

### 💼 4. Scheduled Inspection Visits & User Account
| Scheduled Visit Bookings | User Profile & Settings | System Dashboard Overview |
| :---: | :---: | :---: |
| ![Scheduled Visits](./dashscreenshots/userschedules.png) | ![User Account](./dashscreenshots/useracct.png) | ![User Dashboard](./dashscreenshots/userdash.png) |

---

## 4. Team Members & Key Contributions

| Avatar | GitHub Profile | Developer | Role & Key Contributions |
| :---: | :--- | :--- | :--- |
| <img src="https://github.com/santhipriyaa27.png" width="65" style="border-radius: 15px;"/> | [@santhipriyaa27](https://github.com/santhipriyaa27) | **Santhi Priya** | **Team Lead, DevOps & QA Automation**<br>Managed project milestones; architected Jenkins CI/CD automation pipelines, SonarQube code quality auditing (`automate_sonar.py`), bug tracking, and test suite execution. |
| <img src="https://github.com/Pavankumarswamy.png" width="65" style="border-radius: 15px;"/> | [@Pavankumarswamy](https://github.com/Pavankumarswamy) | **Pavan Kumar Swamy** | **Technical Architect & Core Full-Stack Lead**<br>Conceived and built the core architecture; designed 3NF database schema; built React 18 + Vite UI, glassmorphism dashboards, Mapbox GL JS engine, 360° panorama viewer, and API integration. |
| <img src="https://github.com/vasavi985.png" width="65" style="border-radius: 15px;"/> | [@vasavi985](https://github.com/vasavi985) | **Rama Vasavi Patchikolla** | **Lead Backend Engineer**<br>Flawlessly developed all Spring Boot 3.4 REST APIs, JWT authentication, RBAC filters, database JPA services, and co-executed full-stack deployments and DevOps pipelines. |
| <img src="https://github.com/hemanthkotipalli.png" width="65" style="border-radius: 15px;"/> | [@hemanthkotipalli](https://github.com/hemanthkotipalli) | **Hemanth Kotipalli** | **AI & GenAI Systems Engineer**<br>Built the interactive AI Chatbot assistant, OCR document extraction pipeline, GenAI verification algorithms, and automated land trust score calculations. |
| <img src="https://github.com/keerthithammisetty.png" width="65" style="border-radius: 15px;"/> | [@keerthithammisetty](https://github.com/keerthithammisetty) | **Keerthi Thammisetty** | **Database Architect & Schema Designer**<br>Engineered and normalized the 3NF relational database schema (`schema.sql`), optimized JPA query relationships, entity mappings, and database transaction boundaries. |
| <img src="https://github.com/ramasai98.png" width="65" style="border-radius: 15px;"/> | [@ramasai98](https://github.com/ramasai98) | **Rama Sai** | **DevOps & Cloud Infrastructure Architect**<br>Architected the AWS Cloud topology—configuring CloudFront CDN edge distribution, S3 static hosting, ECS Fargate container clusters, ALB load balancers, and Terraform IaC scripts. |

---

## 5. 1-Week Rapid Implementation Sprint & Bug Fixes

In an intensive **1-week engineering sprint**, the team achieved major milestones and resolved complex technical challenges:

1.  **Frontend Modernization**: Completely ported legacy Angular code to a high-performance **React 18 + Vite** stack, boosting bundle build speed by **8x** and runtime responsiveness.
2.  **HTTPS & Mixed Content Resolution**: Solved browser Mixed Content blocks (`https://...` calling insecure `http://...` ALB endpoints) by routing all API traffic through CloudFront edge origin request policies.
3.  **Code Quality & SonarQube Automation**: Built custom Python automation (`automate_sonar.py`) to run static analysis, eliminating code smells, memory leaks, and unhandled exceptions.
4.  **AWS Security Hardening**: Secured exposed API keys and automated secret rotation using AWS KMS and Secrets Manager.
5.  **Multi-Role Dashboards**: Built 4 distinct role-tailored portals (Buyer, Land Provider, Government Officer, Admin) in record time.

---

## 5. Complete Technology Stack by Service

| 🎨 Frontend Tier (`/frontend-react`) | ⚙️ Backend & DB Tier (`/back_end`) | ☁️ Cloud & DevOps Tier (AWS / Ops) |
| :--- | :--- | :--- |
| **React 18** — Component Architecture | **Spring Boot 3.4.0** — Java 21 Framework | **AWS CloudFront** — Global Edge CDN |
| **Vite 5** — Fast HMR Bundler & Compiler | **Spring Security** — JWT Token Auth | **AWS S3** — Static Asset & Media Bucket |
| **TypeScript 5.0** — Type-Safe Application | **Spring Data JPA** — Hibernate ORM | **AWS ECS Fargate** — Serverless Containers |
| **Tailwind CSS** — Glassmorphism Design | **HikariCP** — Database Connection Pool | **AWS ALB** — Application Load Balancer |
| **Mapbox GL JS** — GIS Interactive Mapping | **MySQL 8.0** — 3NF Relational Database | **AWS NAT Gateway** — Static Egress IP |
| **Pannellum VR** — 360° Panorama Viewer | **BCrypt** — Secure Password Hashing | **Jenkins & GitHub Actions** — CI/CD Pipelines |
| **Axios** — Auth Bearer Interceptors | **Jackson & OpenAPI** — JSON & Swagger | **SonarQube** — Static Code Analysis |

### 🔄 Architectural Tier Interactions
```mermaid
graph TD
    subgraph ClientLayer [Client & User Layer]
        FE[React 18 + Vite Frontend Application]
        MB[Mapbox GIS Engine]
        VR[Pannellum 360 VR Player]
    end

    subgraph CDNEast [AWS CDN & Edge Distribution]
        CF[Amazon CloudFront CDN]
        S3[AWS S3 Bucket]
    end

    subgraph ServerLayer [Application Server Layer]
        ALB[AWS Application Load Balancer]
        ECS[AWS ECS Fargate - Spring Boot Container]
        SEC[Spring Security & JWT Filter]
    end

    subgraph PersistenceLayer [Data & Persistence Layer]
        NAT[AWS NAT Gateway Egress]
        DB[(Hostinger MySQL 8.0 Database)]
        AI[AI Trust & OCR Engine]
    end

    FE -->|1. Request Static Bundle| CF
    CF -->|2. Fetch Assets| S3
    FE -->|3. HTTPS API Calls| CF
    CF -->|4. Proxy /api/*| ALB
    ALB -->|5. Forward Port 8080| ECS
    ECS -->|6. Intercept & Validate Token| SEC
    ECS -->|7. Outbound Egress| NAT
    NAT -->|8. JDBC SQL Queries| DB
    ECS -->|9. Async Analysis| AI
```

---

## 6. Platform & Cloud Infrastructure Services

| Domain | Service / Platform | Usage & Responsibility |
| :--- | :--- | :--- |
| **Edge CDN** | **Amazon CloudFront** | Global SSL termination, HTTPS caching, `/api/*` request proxying. |
| **Object Storage** | **Amazon S3** | Hosting compiled static React frontend assets and user land documents. |
| **Compute Containers**| **AWS ECS Fargate** | Serverless Docker container execution running Spring Boot tasks. |
| **Load Balancing** | **AWS Application Load Balancer (ALB)** | Routing HTTP 8080 traffic to active container target groups with health checks. |
| **Network Egress** | **AWS NAT Gateway** | Providing static Egress IP (`13.207.227.126`) for remote MySQL database access. |
| **Container Registry**| **Amazon ECR** | Storing immutable Docker container image tags. |
| **Database Server** | **Hostinger / AWS RDS MySQL 8.0** | 3NF relational data store with spatial coordinates and audit trails. |
| **CI/CD Automation** | **GitHub Actions & Jenkins** | Automated build verification, unit testing, S3 sync, and ECS deployment. |
| **Code Quality** | **SonarQube & Python Runner** | Static code analysis, vulnerability scanning, and code smell remediation. |
| **Reverse Proxy** | **Nginx** | Optional local gateway routing and SSL termination in staging environments. |

---

## 7. Live Deployment & Production Endpoints

Production servers are live in the AWS Mumbai (`ap-south-1`) region:

*   🌐 **Live Web Portal**: `https://dpyyh7torlown.cloudfront.net`
*   ⚙️ **Backend Load Balancer Base URL**: `http://landlens-production-alb-1919392235.ap-south-1.elb.amazonaws.com`
*   💓 **Health Check (Actuator)**: `http://landlens-production-alb-1919392235.ap-south-1.elb.amazonaws.com/actuator/health`
*   📖 **Swagger Documentation**: `http://landlens-production-alb-1919392235.ap-south-1.elb.amazonaws.com/swagger-ui/index.html` *(Dev profile)*
*   🗄️ **Production Database (Hostinger)**: `srv1117.hstgr.io:3306` (Schema: `u833088220_Priya_teamlead`)
*   🌐 **NAT Gateway Public Egress IP**: `13.207.227.126` (Whitelisted in Hostinger Remote MySQL settings)

---

## 8. Folder & Package Architecture

### Root Directory Overview
```text
LandLense/
 ├── README.md                      # Master Unified Documentation
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

## 9. System Architecture & Sequence Diagrams

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

## 10. Database Module Overview & Table Directory

The database is normalized into **3NF (Third Normal Form)** tables. Every table includes audit attributes:
*   `id` (`VARCHAR(36)` UUID, Primary Key)
*   `created_at` (`TIMESTAMP`, Default `CURRENT_TIMESTAMP`)
*   `updated_at` (`TIMESTAMP`, Default `CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`)
*   `created_by` (`VARCHAR(36)` UUID, Nullable)
*   `updated_by` (`VARCHAR(36)` UUID, Nullable)
*   `is_active` (`BOOLEAN`, Default `true` for soft-deletion)

| Module | Table Name | Description |
| :--- | :--- | :--- |
| **Auth & User** | `roles` | Roles mapping to RBAC privileges (`ADMIN`, `GOVERNMENT_OFFICER`, `PROVIDER`, `BUYER`). |
| | `users` | User profile, role reference, credentials hash. |
| | `refresh_tokens` | Active JWT refresh tokens for persistent sessions. |
| | `login_histories` | Security log of user login attempts. |
| **Property** | `properties` | Core property listings and ownership details. |
| **Media** | `property_images` | Image URLs, thumbnails, and custom displays. |
| | `property_videos` | Video paths, duration, and thumbnail images. |
| **Documents** | `property_documents` | Property verification documents and OCR status. |
| **Verification** | `ai_verifications` | AI-driven Trust, Forgery, and Duplicate reports. |
| | `government_verifications` | Official government verification remarks and status. |
| | `verification_timelines` | Historic log of all verification events. |
| **Fraud & Duplicate**| `duplicate_claims` | AI-flagged duplicate submissions for overlapping properties. |
| | `fraud_reports` | Public or officer reported fraud details. |
| **Interactions** | `property_visits` | Scheduled viewings by buyers. |
| | `saved_properties` | Bookmarked listings for prospective buyers. |
| **Notifications & Chat**| `notifications` | Read/unread alerts for users. |
| | `ai_conversations` | Conversation threads with AI chat. |
| | `ai_messages` | Individual messages within an AI conversation. |
| **Developer API** | `api_keys` | Hashed authentication keys for developers. |
| | `api_usages` | Daily rolled up API access quotas. |
| | `api_logs` | Trace log of developer API requests. |
| | `api_rate_limits` | Current rate limiting windows for active keys. |
| **Analytics** | `daily_analytics` | Pre-aggregated system metrics per day. |

---

## 11. Detailed Table Schemas & Column Specifications

### Authentication & User Module

#### `roles`
*   `id` (`VARCHAR(36)`, PK)
*   `name` (`VARCHAR(50)`, Not Null, Unique) - Values: `ADMIN`, `GOVERNMENT_OFFICER`, `PROVIDER`, `BUYER`
*   `description` (`VARCHAR(255)`)
*   *Standard Audit Columns* (`created_at`, `updated_at`, `created_by`, `updated_by`, `is_active`)

#### `users`
*   `id` (`VARCHAR(36)`, PK)
*   `email` (`VARCHAR(150)`, Not Null, Unique)
*   `password_hash` (`VARCHAR(255)`, Not Null)
*   `first_name` (`VARCHAR(100)`, Not Null)
*   `last_name` (`VARCHAR(100)`, Not Null)
*   `phone_number` (`VARCHAR(20)`)
*   `role_id` (`VARCHAR(36)`, Not Null, FK referencing `roles(id)`)
*   *Standard Audit Columns*

#### `refresh_tokens`
*   `id` (`VARCHAR(36)`, PK)
*   `user_id` (`VARCHAR(36)`, Not Null, FK referencing `users(id)`)
*   `token` (`VARCHAR(512)`, Not Null, Unique)
*   `expiry_date` (`TIMESTAMP`, Not Null)
*   `revoked` (`BOOLEAN`, Not Null, Default `false`)
*   *Standard Audit Columns*

#### `login_histories`
*   `id` (`VARCHAR(36)`, PK)
*   `user_id` (`VARCHAR(36)`, Not Null, FK referencing `users(id)`)
*   `login_timestamp` (`TIMESTAMP`, Not Null, Default `CURRENT_TIMESTAMP`)
*   `ip_address` (`VARCHAR(45)`, Not Null)
*   `user_agent` (`VARCHAR(512)`)
*   `status` (`VARCHAR(20)`, Not Null) - Values: `SUCCESS`, `FAILED`
*   *Standard Audit Columns*

---

### Property Module

#### `properties`
*   `id` (`VARCHAR(36)`, PK)
*   `property_code` (`VARCHAR(50)`, Not Null, Unique)
*   `title` (`VARCHAR(150)`, Not Null)
*   `category` (`VARCHAR(50)`, Not Null) - Values: `RESIDENTIAL`, `COMMERCIAL`, `AGRICULTURAL`, `INDUSTRIAL`
*   `area` (`DECIMAL(12,2)`, Not Null)
*   `price` (`DECIMAL(15,2)`, Not Null)
*   `description` (`TEXT`)
*   `survey_number` (`VARCHAR(50)`, Not Null)
*   `address` (`VARCHAR(255)`, Not Null)
*   `latitude` (`DECIMAL(9,6)`, Not Null)
*   `longitude` (`DECIMAL(9,6)`, Not Null)
*   `district` (`VARCHAR(100)`, Not Null)
*   `village` (`VARCHAR(100)`, Not Null)
*   `state` (`VARCHAR(100)`, Not Null)
*   `pincode` (`VARCHAR(10)`, Not Null)
*   `three_sixty_image_url` (`VARCHAR(512)`)
*   `status` (`VARCHAR(30)`, Not Null) - Values: `PENDING_AI`, `PENDING_GOVT`, `APPROVED`, `REJECTED`, `DISPUTED`
*   `provider_id` (`VARCHAR(36)`, Not Null, FK referencing `users(id)`)
*   *Standard Audit Columns*

#### `property_images`
*   `id` (`VARCHAR(36)`, PK)
*   `property_id` (`VARCHAR(36)`, Not Null, FK referencing `properties(id)`)
*   `image_url` (`VARCHAR(512)`, Not Null)
*   `thumbnail_url` (`VARCHAR(512)`, Not Null)
*   `display_order` (`INT`, Not Null, Default `0`)
*   *Standard Audit Columns*

#### `property_videos`
*   `id` (`VARCHAR(36)`, PK)
*   `property_id` (`VARCHAR(36)`, Not Null, FK referencing `properties(id)`)
*   `video_url` (`VARCHAR(512)`, Not Null)
*   `duration` (`INT`) - Duration in seconds
*   `thumbnail_url` (`VARCHAR(512)`)
*   *Standard Audit Columns*

#### `property_documents`
*   `id` (`VARCHAR(36)`, PK)
*   `property_id` (`VARCHAR(36)`, Not Null, FK referencing `properties(id)`)
*   `document_type` (`VARCHAR(50)`, Not Null) - Values: `SALE_DEED`, `PATTA`, `SURVEY_MAP`, `TAX_RECEIPT`, `IDENTITY_PROOF`, `OWNERSHIP_PROOF`
*   `file_url` (`VARCHAR(512)`, Not Null)
*   `ocr_status` (`VARCHAR(30)`, Not Null) - Values: `PENDING`, `PROCESSING`, `COMPLETED`, `FAILED`
*   `verification_status` (`VARCHAR(30)`, Not Null) - Values: `UNVERIFIED`, `VERIFIED`, `REJECTED`
*   *Standard Audit Columns*

---

### Verification Module

#### `ai_verifications`
*   `id` (`VARCHAR(36)`, PK)
*   `property_id` (`VARCHAR(36)`, Not Null, Unique, FK referencing `properties(id)`)
*   `ai_trust_score` (`DECIMAL(5,2)`, Not Null) - Scale `0.00` to `100.00`
*   `forgery_score` (`DECIMAL(5,2)`, Not Null)
*   `duplicate_score` (`DECIMAL(5,2)`, Not Null)
*   `ownership_match` (`BOOLEAN`, Not Null)
*   `risk_score` (`DECIMAL(5,2)`, Not Null)
*   `summary` (`TEXT`)
*   `confidence` (`DECIMAL(5,2)`, Not Null)
*   `generated_date` (`TIMESTAMP`, Not Null, Default `CURRENT_TIMESTAMP`)
*   *Standard Audit Columns*

#### `government_verifications`
*   `id` (`VARCHAR(36)`, PK)
*   `property_id` (`VARCHAR(36)`, Not Null, Unique, FK referencing `properties(id)`)
*   `officer_id` (`VARCHAR(36)`, Not Null, FK referencing `users(id)`)
*   `remarks` (`TEXT`)
*   `status` (`VARCHAR(30)`, Not Null) - Values: `APPROVED`, `REJECTED`, `DISPUTED`
*   `verified_date` (`TIMESTAMP`, Not Null, Default `CURRENT_TIMESTAMP`)
*   *Standard Audit Columns*

#### `verification_timelines`
*   `id` (`VARCHAR(36)`, PK)
*   `property_id` (`VARCHAR(36)`, Not Null, FK referencing `properties(id)`)
*   `timestamp` (`TIMESTAMP`, Not Null, Default `CURRENT_TIMESTAMP`)
*   `action` (`VARCHAR(50)`, Not Null) - Values: `UPLOADED`, `AI_STARTED`, `AI_COMPLETED`, `GOVT_REVIEW_STARTED`, `APPROVED`, `REJECTED`, `DISPUTED`
*   `remarks` (`TEXT`)
*   `user_id` (`VARCHAR(36)`, Not Null, FK referencing `users(id)`)
*   *Standard Audit Columns*

---

### Fraud & Buyer Interactions Modules

#### `duplicate_claims`
*   `id` (`VARCHAR(36)`, PK)
*   `property_a_id` (`VARCHAR(36)`, Not Null, FK referencing `properties(id)`)
*   `property_b_id` (`VARCHAR(36)`, Not Null, FK referencing `properties(id)`)
*   `similarity` (`DECIMAL(5,2)`, Not Null)
*   `reason` (`TEXT`, Not Null)
*   `status` (`VARCHAR(30)`, Not Null) - Values: `FLAGGED`, `INVESTIGATING`, `RESOLVED`, `FALSE_POSITIVE`
*   `decision` (`VARCHAR(50)`) - Values: `MERGED`, `CANCELLED_A`, `CANCELLED_B`, `NO_ACTION`
*   *Standard Audit Columns*

#### `fraud_reports`
*   `id` (`VARCHAR(36)`, PK)
*   `reporter_id` (`VARCHAR(36)`, Not Null, FK referencing `users(id)`)
*   `property_id` (`VARCHAR(36)`, Not Null, FK referencing `properties(id)`)
*   `reason` (`VARCHAR(150)`, Not Null)
*   `description` (`TEXT`, Not Null)
*   `status` (`VARCHAR(30)`, Not Null) - Values: `SUBMITTED`, `UNDER_INVESTIGATION`, `RESOLVED_FRAUD`, `RESOLVED_DISMISSED`
*   `officer_id` (`VARCHAR(36)`, FK referencing `users(id)`)
*   *Standard Audit Columns*

#### `property_visits`
*   `id` (`VARCHAR(36)`, PK)
*   `buyer_id` (`VARCHAR(36)`, Not Null, FK referencing `users(id)`)
*   `property_id` (`VARCHAR(36)`, Not Null, FK referencing `properties(id)`)
*   `visit_date` (`DATE`, Not Null)
*   `visit_time` (`TIME`, Not Null)
*   `status` (`VARCHAR(30)`, Not Null) - Values: `SCHEDULED`, `COMPLETED`, `CANCELLED`, `RESCHEDULED`
*   *Standard Audit Columns*

#### `saved_properties`
*   `id` (`VARCHAR(36)`, PK)
*   `buyer_id` (`VARCHAR(36)`, Not Null, FK referencing `users(id)`)
*   `property_id` (`VARCHAR(36)`, Not Null, FK referencing `properties(id)`)
*   *Standard Audit Columns*

---

### Notifications, Chat & Developer API Modules

#### `notifications`
*   `id` (`VARCHAR(36)`, PK)
*   `title` (`VARCHAR(150)`, Not Null)
*   `message` (`TEXT`, Not Null)
*   `type` (`VARCHAR(50)`, Not Null)
*   `is_read` (`BOOLEAN`, Not Null, Default `false`)
*   `receiver_id` (`VARCHAR(36)`, Not Null, FK referencing `users(id)`)
*   `created_time` (`TIMESTAMP`, Not Null, Default `CURRENT_TIMESTAMP`)
*   *Standard Audit Columns*

#### `api_keys`
*   `id` (`VARCHAR(36)`, PK)
*   `user_id` (`VARCHAR(36)`, Not Null, FK referencing `users(id)`)
*   `key_hash` (`VARCHAR(255)`, Not Null, Unique)
*   `name` (`VARCHAR(100)`, Not Null)
*   `prefix` (`VARCHAR(8)`, Not Null)
*   `status` (`VARCHAR(20)`, Not Null) - Values: `ACTIVE`, `REVOKED`, `EXPIRED`
*   `expiry_date` (`TIMESTAMP`)
*   *Standard Audit Columns*

#### `daily_analytics`
*   `id` (`VARCHAR(36)`, PK)
*   `analytics_date` (`DATE`, Not Null, Unique)
*   `property_views` (`INT`, Not Null, Default `0`)
*   `search_count` (`INT`, Not Null, Default `0`)
*   `verification_count` (`INT`, Not Null, Default `0`)
*   `fraud_count` (`INT`, Not Null, Default `0`)
*   `api_calls` (`INT`, Not Null, Default `0`)
*   *Standard Audit Columns*

---

## 12. Full Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    roles {
        string id PK
        string name UK
        string description
        timestamp created_at
        timestamp updated_at
        boolean is_active
    }

    users {
        string id PK
        string email UK
        string password_hash
        string first_name
        string last_name
        string phone_number
        string role_id FK
        timestamp created_at
        timestamp updated_at
        boolean is_active
    }

    refresh_tokens {
        string id PK
        string user_id FK
        string token UK
        timestamp expiry_date
        boolean revoked
        timestamp created_at
        timestamp updated_at
        boolean is_active
    }

    properties {
        string id PK
        string property_code UK
        string title
        string category
        decimal area
        decimal price
        text description
        string survey_number
        string address
        decimal latitude
        decimal longitude
        string district
        string village
        string state
        string pincode
        string three_sixty_image_url
        string status
        string provider_id FK
        timestamp created_at
        timestamp updated_at
        boolean is_active
    }

    property_images {
        string id PK
        string property_id FK
        string image_url
        string thumbnail_url
        int display_order
        timestamp created_at
        timestamp updated_at
        boolean is_active
    }

    property_videos {
        string id PK
        string property_id FK
        string video_url
        int duration
        string thumbnail_url
        timestamp created_at
        timestamp updated_at
        boolean is_active
    }

    property_documents {
        string id PK
        string property_id FK
        string document_type
        string file_url
        string ocr_status
        string verification_status
        timestamp created_at
        timestamp updated_at
        boolean is_active
    }

    ai_verifications {
        string id PK
        string property_id FK
        decimal ai_trust_score
        decimal forgery_score
        decimal duplicate_score
        boolean ownership_match
        decimal risk_score
        text summary
        decimal confidence
        timestamp generated_date
        timestamp created_at
        timestamp updated_at
        boolean is_active
    }

    government_verifications {
        string id PK
        string property_id FK
        string officer_id FK
        text remarks
        string status
        timestamp verified_date
        timestamp created_at
        timestamp updated_at
        boolean is_active
    }

    verification_timelines {
        string id PK
        string property_id FK
        timestamp timestamp
        string action
        text remarks
        string user_id FK
        timestamp created_at
        timestamp updated_at
        boolean is_active
    }

    duplicate_claims {
        string id PK
        string property_a_id FK
        string property_b_id FK
        decimal similarity
        text reason
        string status
        string decision
        timestamp created_at
        timestamp updated_at
        boolean is_active
    }

    fraud_reports {
        string id PK
        string reporter_id FK
        string property_id FK
        string reason
        text description
        string status
        string officer_id FK
        timestamp created_at
        timestamp updated_at
        boolean is_active
    }

    property_visits {
        string id PK
        string buyer_id FK
        string property_id FK
        date visit_date
        time visit_time
        string status
        timestamp created_at
        timestamp updated_at
        boolean is_active
    }

    saved_properties {
        string id PK
        string buyer_id FK
        string property_id FK
        timestamp created_at
        timestamp updated_at
        boolean is_active
    }

    roles ||--o{ users : "assigns"
    users ||--o{ refresh_tokens : "generates"
    users ||--o{ properties : "owns"
    users ||--o{ government_verifications : "performs"
    users ||--o{ verification_timelines : "triggers"
    users ||--o{ fraud_reports : "reports"
    users ||--o{ property_visits : "schedules"
    users ||--o{ saved_properties : "saves"

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
```

---

## 13. Complete REST API Directory

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

## 14. Local Development & Setup Guide

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

## 15. Environment Variables Reference

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

## 16. Security, Auth & Rate Limiting

*   **Credential Encryption**: Hashing using BCrypt for password fields inside `users`.
*   **Token Authorization**: Custom `JwtAuthenticationFilter` intercepts HTTP headers to validate bearer signatures.
*   **External API Guarding**: Interceptor (`ApiKeyInterceptor`) locks all `/api/v1/external/**` routes requiring `x-api-key`.
*   **Rate Limits**: Automated tracker logs developer usage and blocks keys exceeding defined thresholds (`429 Rate Limit Exceeded`).

---

## 17. Application Scalability & Performance

*   📈 **Horizontal Container Scaling**: AWS ECS Fargate tasks dynamically scale horizontally (up to 30 tasks) based on CPU/RAM utilization.
*   ⚡ **Global Edge CDN Caching**: CloudFront caches React bundle assets across 300+ global edge locations, ensuring sub-100ms page load times worldwide.
*   🗄️ **Database Read Replicas**: MySQL Aurora Serverless v2 setup allows routing high-volume read queries (`GET /api/properties`) to read replicas, preserving master node write capacity.
*   🚀 **Sub-Second API Response Times**: HikariCP connection pooling and MapStruct DTO mappers minimize latency.

---

## 18. AWS Infrastructure Cost Projections

| User Scale | Frontend (S3 + CloudFront) | Backend API (ECS Fargate + ALB) | Database (MySQL / RDS) | Networking & Egress (NAT Gateway) | Total Estimated Monthly Cost |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **100 Users** | **$0 - $2** *(CloudFront Free Tier)* | **$26 - $30** | **$10 - $15** *(Hostinger / Small)* | **$32 - $35** | **~$68 - $85 / mo** (~₹5.5k - ₹7k) |
| **1,000 Users** | **$2 - $5** | **$45 - $55** | **$25 - $40** *(RDS db.t4g.small)* | **$35 - $40** | **~$110 - $140 / mo** (~₹9k - ₹11.5k) |
| **10,000 Users** | **$100 - $150** | **$165 - $230** | **$150 - $250** *(RDS Multi-AZ)* | **$60 - $90** | **~$600 - $800 / mo** (~₹50k - ₹66k) |
| **100,000 (1 Lakh)**| **$1,200 - $1,800** | **$950 - $1,450** | **$800 - $1,500** *(Aurora Serverless)* | **$200 - $350** | **~$3,500 - $5,000 / mo** (~₹2.9L - ₹4.1L) |

---

## 19. Future Roadmap & Improvements

*   **Test Isolation with H2**: Mock H2 in-memory profile (`application-test.properties`) so build steps execute offline cleanly.
*   **Redis Caching Layer**: Cache wrapper for public property search endpoints to reduce DB hits.
*   **Asynchronous Message Queue**: Transition AI processing and OCR triggers from inline threads to RabbitMQ/Kafka.
*   **Geospatial Indexes**: Spatial datatypes using `Hibernate Spatial` + `MySQL Spatial` to support polygon land searches.

---

## 20. Contributing & License

1.  Create a feature branch from `main` (`git checkout -b feature/amazing-feature`).
2.  Commit your changes using meaningful, structured commit messages.
3.  Submit a Pull Request targeting the `main` branch.

*Architected & Lead Developed with ❤️ by **Pavan Kumar Swamy** and **Team Pixel Pirates** (Santhi Priya, Hemanth Kotipalli, Keerthi Thammisetty, Rama Sai, and Rama Vasavi).*
