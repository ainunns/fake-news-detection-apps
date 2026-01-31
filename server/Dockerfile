# Builder stage
FROM python:3.12-slim AS builder
WORKDIR /app/server

COPY server/requirement.txt .

# Install CPU-only torch first to avoid pulling CUDA version
RUN pip install --no-cache-dir --user torch --index-url https://download.pytorch.org/whl/cpu
RUN pip install --no-cache-dir --user -r requirement.txt

# Runtime stage
FROM python:3.12-slim
WORKDIR /app/server

COPY --from=builder /root/.local /root/.local

COPY server/ ./
COPY dataset/ ../dataset/
COPY notebook/fake_news_classifier.pth ../notebook/

# Make sure scripts in .local are usable
ENV PATH=/root/.local/bin:$PATH
ENV PYTHONPATH=/app
EXPOSE 8000

CMD ["uvicorn", "server.main:app", "--host", "0.0.0.0", "--port", "8000"]