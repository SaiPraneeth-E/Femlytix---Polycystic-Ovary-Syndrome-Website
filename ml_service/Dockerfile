FROM python:3.11-slim

WORKDIR /app

# Install system dependencies needed for h5py and some ML libraries
RUN apt-get update && apt-get install -y \
    build-essential \
    libhdf5-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Create models directory (to be mounted or copied later)
RUN mkdir -p /app/models

COPY main.py .

EXPOSE 8001

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]
