# Use a slim Python base image
FROM python:3.12-slim

# Install uv from its official GitHub Container Registry
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Set the working directory inside the container
WORKDIR /app

# Copy your application files into the container
COPY . /app

# Install application dependencies using uv sync
# --frozen ensures that the dependencies are installed based on a uv.lock file,
# providing deterministic builds.
# --no-cache prevents uv from using its cache, which can be useful in CI/CD environments.
RUN uv sync --frozen --no-cache

# Expose the port your FastAPI application will run on
EXPOSE 80

# Use uv run to execute uvicorn within the virtual environment
CMD ["uv", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]