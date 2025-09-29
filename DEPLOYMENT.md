# Roommate Matcher - Production Deployment Guide

## 🚀 **Industry Standard Deployment**

### **Environment Setup**

#### **Prerequisites**

```bash
# Python 3.11+
python --version

# Node.js 18+
node --version
npm --version

# Git
git --version
```

#### **Backend Setup**

```bash
# Clone and setup Python environment
git clone <repository-url>
cd roommate-matcher

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
# or
.venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Set environment variables
export FLASK_ENV=production
export SECRET_KEY=your-secret-key
export SUPABASE_URL=your-supabase-url
export SUPABASE_KEY=your-supabase-key
```

#### **Frontend Setup**

```bash
cd frontend
npm install
npm run build
```

### **Production Configuration**

#### **1. Environment Variables**

Create `.env.production`:

```env
# API Configuration
FLASK_ENV=production
API_BASE_URL=https://your-domain.com/api
SECRET_KEY=your-production-secret-key

# Database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# Security
CORS_ORIGINS=https://your-frontend-domain.com
RATE_LIMIT_PER_MINUTE=100
MAX_CONTENT_LENGTH=16777216

# Logging
LOG_LEVEL=INFO
LOG_FILE=/var/log/roommate-matcher/api.log

# Performance
CACHE_TIMEOUT=300
MAX_WORKERS=4
```

#### **2. Production API Server**

Create `wsgi.py`:

```python
#!/usr/bin/env python3
"""
Production WSGI entry point for Roommate Matcher API
"""

import os
import logging
from pathlib import Path

# Set production environment
os.environ.setdefault('FLASK_ENV', 'production')

# Configure logging for production
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('/var/log/roommate-matcher/api.log'),
        logging.StreamHandler()
    ]
)

# Import application
from frontend.api_server import app

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 8000)))
```

#### **3. Docker Configuration**

`Dockerfile`:

```dockerfile
# Multi-stage build for production
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --only=production
COPY frontend/ ./
RUN npm run build

FROM python:3.11-slim AS backend
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .
COPY --from=frontend-build /app/frontend/out ./frontend/out

# Create non-root user
RUN useradd --create-home --shell /bin/bash app \
    && chown -R app:app /app
USER app

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

EXPOSE 8000
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "4", "wsgi:app"]
```

`docker-compose.yml`:

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - '8000:8000'
    environment:
      - FLASK_ENV=production
      - SUPABASE_URL=${SUPABASE_URL}
      - SUPABASE_KEY=${SUPABASE_KEY}
    volumes:
      - ./logs:/var/log/roommate-matcher
    restart: unless-stopped
    healthcheck:
      test: ['CMD', 'curl', '-f', 'http://localhost:8000/health']
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  nginx:
    image: nginx:alpine
    ports:
      - '80:80'
      - '443:443'
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - api
    restart: unless-stopped

volumes:
  logs:
```

#### **4. Nginx Configuration**

`nginx.conf`:

```nginx
events {
    worker_connections 1024;
}

http {
    upstream api {
        server api:8000;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

    server {
        listen 80;
        server_name your-domain.com;

        # Redirect to HTTPS
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name your-domain.com;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;

        # Security headers
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        add_header Strict-Transport-Security "max-age=31536000";

        # API proxy
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://api;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Static files
        location / {
            root /usr/share/nginx/html;
            try_files $uri $uri/ /index.html;
        }
    }
}
```

### **Monitoring and Logging**

#### **1. Health Check Monitoring**

```python
# health_monitor.py
import requests
import time
import logging
from datetime import datetime

def monitor_health():
    """Monitor API health and log status"""
    while True:
        try:
            response = requests.get('http://localhost:8000/health', timeout=5)
            if response.status_code == 200:
                logging.info(f"✅ API healthy at {datetime.now()}")
            else:
                logging.error(f"❌ API unhealthy: {response.status_code}")
        except Exception as e:
            logging.error(f"💥 Health check failed: {e}")

        time.sleep(60)  # Check every minute

if __name__ == "__main__":
    monitor_health()
```

#### **2. Performance Monitoring**

```python
# performance_monitor.py
import psutil
import logging
from datetime import datetime

def log_system_metrics():
    """Log system performance metrics"""
    cpu_percent = psutil.cpu_percent(interval=1)
    memory = psutil.virtual_memory()
    disk = psutil.disk_usage('/')

    logging.info(f"📊 System Metrics at {datetime.now()}")
    logging.info(f"CPU: {cpu_percent}%")
    logging.info(f"Memory: {memory.percent}% ({memory.used // 1024 // 1024}MB used)")
    logging.info(f"Disk: {disk.percent}% ({disk.free // 1024 // 1024 // 1024}GB free)")

# Run every 5 minutes
if __name__ == "__main__":
    import schedule
    schedule.every(5).minutes.do(log_system_metrics)

    while True:
        schedule.run_pending()
        time.sleep(1)
```

### **Security Best Practices**

#### **1. API Security**

- ✅ Rate limiting implemented
- ✅ Input validation on all endpoints
- ✅ CORS properly configured
- ✅ Error messages don't leak sensitive info
- ✅ HTTPS enforced in production
- ✅ Secret key rotation policy

#### **2. Data Security**

- ✅ No sensitive data in logs
- ✅ Database connections encrypted
- ✅ User data sanitized
- ✅ Regular security updates

#### **3. Infrastructure Security**

- ✅ Non-root container users
- ✅ Minimal container images
- ✅ Network segmentation
- ✅ Regular vulnerability scans

### **Deployment Commands**

#### **Development**

```bash
# Start development servers
npm run dev:all           # Both frontend and backend
python test_api_comprehensive.py  # Run tests
```

#### **Production**

```bash
# Build and deploy
docker-compose up -d      # Start services
docker-compose logs -f    # Monitor logs
python test_api_comprehensive.py --benchmark  # Performance test
```

#### **Maintenance**

```bash
# Update application
docker-compose pull
docker-compose up -d

# View logs
docker-compose logs api

# Scale services
docker-compose up -d --scale api=3

# Backup data
docker-compose exec api python backup_script.py
```

### **Performance Optimization**

#### **Backend Optimizations**

- ✅ Response caching for static data
- ✅ Database connection pooling
- ✅ Async processing for heavy operations
- ✅ CDN for static assets
- ✅ Gzip compression

#### **Frontend Optimizations**

- ✅ Code splitting and lazy loading
- ✅ Image optimization
- ✅ Bundle size optimization
- ✅ Service worker for caching
- ✅ Progressive web app features

### **Monitoring Dashboard**

Create monitoring endpoints:

```python
@app.route('/metrics')
def metrics():
    """Prometheus-compatible metrics endpoint"""
    return {
        "api_requests_total": request_counter,
        "api_response_time": average_response_time,
        "active_sessions": len(chat_sessions_db),
        "error_rate": error_counter / request_counter
    }
```

### **Backup and Recovery**

```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p backups/$DATE

# Backup application data
docker-compose exec api python -c "
import json
from frontend.api_server import chat_sessions_db
with open('backup_$DATE.json', 'w') as f:
    json.dump(chat_sessions_db, f)
"

# Backup configuration
cp .env.production backups/$DATE/
cp docker-compose.yml backups/$DATE/

echo "✅ Backup completed: backups/$DATE"
```

---

## 📋 **Pre-Deployment Checklist**

- [ ] All tests passing (`python test_api_comprehensive.py`)
- [ ] Performance benchmarks acceptable
- [ ] Security scan completed
- [ ] SSL certificates configured
- [ ] Environment variables set
- [ ] Database migrations applied
- [ ] Monitoring systems active
- [ ] Backup procedures tested
- [ ] Load balancing configured
- [ ] Error tracking enabled

---

**🎯 Ready for Production!** This industry-standard deployment ensures scalability, security, and reliability for the Roommate Matcher application.
