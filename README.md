# TV Box Server

Auto Downloader & S3 Uploader Webhook Server - migrated from Python/FastAPI to Next.js with Drizzle ORM.

## Features

- Receives webhooks from Sonarr and Radarr when media is downloaded
- Automatically uploads media files to S3
- Tracks upload status in SQLite database
- Provides API endpoints to query upload status and logs

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: SQLite with Drizzle ORM
- **S3 Client**: AWS SDK v3
- **Runtime**: Node.js 20

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/webhook/sonarr` - Sonarr webhook handler
- `POST /api/webhook/radarr` - Radarr webhook handler
- `GET /api/uploads` - List recent uploads (movies and episodes)
- `GET /api/uploads/logs?limit=50` - Upload history logs

## Environment Variables

Create a `.env` file with the following variables:

```env
# S3 Configuration
S3_BUCKET=your-bucket-name
S3_ACCESS_KEY=your-access-key
S3_SECRET_KEY=your-secret-key
S3_REGION=us-east-1
S3_ENDPOINT_URL=  # Optional: For S3-compatible services like MinIO

# Database
DATABASE_URL=file:./data/tvbox.db
```

## Development

```bash
# Install dependencies
npm install

# Initialize database
npm run db:init

# Run development server
npm run dev
```

The server will be available at `http://localhost:3000`.

## Docker Deployment

```bash
# Build and start all services
docker compose up -d

# Rebuild webhook service after changes
docker compose build webhook
docker compose up -d webhook
```

The webhook server will be available at `http://localhost:8000`.

## Docker Services

- **Sonarr** (port 8989) - TV show management
- **Radarr** (port 7878) - Movie management
- **qBittorrent** (port 8080) - Torrent client
- **Prowlarr** (port 9696) - Indexer manager
- **Overseerr** (port 5055) - Request management
- **Webhook** (port 8000) - This application

## Database Schema

### Tables

- `series` - TV series metadata (TVDB ID, title, first air year)
- `seasons` - Season information linked to series
- `episodes` - Episode records with file paths and upload status
- `movies` - Movie records (TMDB ID, title, year, upload status)
- `upload_logs` - Historical log of all upload attempts

## Webhook Configuration

### Sonarr

1. Go to Settings → Connect → Add → Webhook
2. Set URL to: `http://tvbox-webhook:3000/api/webhook/sonarr`
3. Enable "On Import" and "On Download" events

### Radarr

1. Go to Settings → Connect → Add → Webhook
2. Set URL to: `http://tvbox-webhook:3000/api/webhook/radarr`
3. Enable "On Import" and "On Download" events

## Migration Notes

This project was migrated from Python/FastAPI to Next.js. Key changes:

- FastAPI → Next.js App Router API routes
- SQLAlchemy → Drizzle ORM
- Pydantic → TypeScript interfaces
- boto3 → AWS SDK v3
- Python async → Node.js async/await

All functionality remains the same, including webhook handling, S3 uploads, and database tracking.
