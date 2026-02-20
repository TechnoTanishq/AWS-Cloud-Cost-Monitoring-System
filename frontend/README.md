# 💎 FinSight

## Intelligent AWS Cloud Cost Monitoring and Alerting System

FinSight is a security-first, SaaS-based cloud cost intelligence platform designed to help organizations monitor, predict, and optimize their AWS cloud spending.

It provides cost visibility, project-wise breakdown, anomaly detection, and ML-powered forecasting — all through a professional and scalable architecture.

---

## 🚀 Features

- 🔐 Secure User Authentication (JWT-based)
- 🔑 IAM Role + STS Integration (No permanent AWS credentials stored)
- 📊 Service-wise and Project-wise Cost Breakdown
- 📈 Historical Cost Visualization
- 🤖 ML-based Cost Prediction (Moving Average + Linear Regression)
- 🚨 Budget Alerts and Threshold Monitoring
- 🧾 Feedback System
- ⚙️ Account Management & IAM Role Management
- 🌙 Professional SaaS UI with Dark/Light Mode

---

## 🏗 Architecture Overview

FinSight follows a modular full-stack architecture.

### Frontend
- React + TypeScript
- Tailwind CSS
- Recharts for visualization
- Responsive enterprise design

### Backend
- FastAPI (Python)
- SQLite (Prototype phase)
- SQLAlchemy ORM
- JWT Authentication
- bcrypt password hashing

### AWS Integration (Production Phase)
- AWS Security Token Service (STS)
- AWS Identity and Access Management (IAM)
- AWS Cost Explorer
- Amazon CloudWatch

---

## 🔐 Security Model

FinSight follows a **Security-First Policy**:

- No permanent AWS Access Keys stored
- IAM Role-based cross-account integration
- Temporary credentials via STS AssumeRole
- Encrypted sensitive data storage
- Password hashing using bcrypt
- JWT-protected APIs
- Least-privilege permission model

---

## 🧠 Machine Learning Module

Prototype ML includes:

- Moving Average Forecasting
- Linear Regression for cost trend prediction
- Basic anomaly detection (threshold-based deviation)
- AI-generated cost insight summaries

Future enhancements may include:
- Time-series forecasting (Prophet/LSTM)
- Advanced anomaly detection models
- Multi-account prediction modeling

---

## 📊 Dashboard Capabilities

- Current Month Cost
- Forecasted Month-End Cost
- Budget Utilization Percentage
- Monthly Cost Trends
- Service-wise Breakdown
- Project-wise Cost Distribution
- ML Insight Panel
- Anomaly Alerts

---
