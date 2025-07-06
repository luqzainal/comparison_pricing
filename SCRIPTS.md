# Scripts Documentation

## Development Scripts

### `npm run dev`
Menjalankan development server dengan hot reload.
```bash
npm run dev
```

### `npm run build`
Build aplikasi untuk production.
```bash
npm run build
```

### `npm run generate`
Generate static site (SSG).
```bash
npm run generate
```

### `npm run preview`
Preview build production secara local.
```bash
npm run preview
```

## Production Scripts

### `npm run start`
Menjalankan production server.
```bash
npm run start
```

### `npm run build:prod`
Build untuk production dengan environment production.
```bash
npm run build:prod
```

### `npm run start:prod`
Menjalankan production server dengan environment production.
```bash
npm run start:prod
```

## Code Quality Scripts

### `npm run lint`
Menjalankan ESLint untuk check code quality.
```bash
npm run lint
```

### `npm run lint:fix`
Menjalankan ESLint dan auto-fix issues.
```bash
npm run lint:fix
```

### `npm run type-check`
Menjalankan TypeScript type checking.
```bash
npm run type-check
```

## Testing Scripts

### `npm run test`
Menjalankan semua tests.
```bash
npm run test
```

### `npm run test:watch`
Menjalankan tests dalam watch mode.
```bash
npm run test:watch
```

### `npm run test:coverage`
Menjalankan tests dengan coverage report.
```bash
npm run test:coverage
```

## Database Scripts

### `npm run db:seed`
Seed database dengan sample data.
```bash
npm run db:seed
```

### `npm run db:migrate`
Menjalankan database migration dan create indexes.
```bash
npm run db:migrate
```

## Utility Scripts

### `npm run clean`
Membersihkan cache dan build files.
```bash
npm run clean
```

### `npm run clean:all`
Membersihkan semua files dan reinstall dependencies.
```bash
npm run clean:all
```

### `npm run analyze`
Build dengan bundle analyzer untuk performance analysis.
```bash
npm run analyze
```

## Deployment Workflow

### Development Setup
```bash
# Clone repository
git clone <repository-url>
cd compare-harga

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env file dengan configuration yang betul

# Run database migration
npm run db:migrate

# Seed database (optional)
npm run db:seed

# Start development server
npm run dev
```

### Production Deployment
```bash
# Build untuk production
npm run build:prod

# Start production server
npm run start:prod
```

### Docker Deployment
```bash
# Build Docker image
docker build -t compare-harga .

# Run Docker container
docker run -p 3000:3000 --env-file .env compare-harga
```

## Environment Variables

Pastikan fail `.env` telah dikonfigurasi dengan betul sebelum menjalankan scripts:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/compare-harga

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret

# Application
NODE_ENV=production
SITE_URL=https://yourdomain.com

# Scraping
SCRAPING_DELAY=1000
SCRAPING_RETRY_ATTEMPTS=3

# Cache
CACHE_TTL=3600
```

## Troubleshooting

### Database Connection Issues
```bash
# Check MongoDB connection
npm run db:migrate

# Reset database
npm run db:seed
```

### Build Issues
```bash
# Clean build cache
npm run clean

# Reinstall dependencies
npm run clean:all
```

### Performance Issues
```bash
# Analyze bundle size
npm run analyze

# Check for memory leaks
npm run dev -- --inspect
``` 