# Environment Variables Setup

## Required Environment Variables

Buat fail `.env` di root directory projek dengan variables berikut:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/compare-harga

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Nuxt Auth Secret
# Generate with `openssl rand -base64 32`
NUXT_AUTH_SECRET=your-nuxt-auth-secret

# Application Configuration
NODE_ENV=development
PORT=3000

# Scraping Configuration
SCRAPING_DELAY=1000
SCRAPING_RETRY_ATTEMPTS=3

# Cache Configuration
CACHE_TTL=3600

# Google OAuth
GOOGLE_CLIENT_ID="ID_KLIEN_GOOGLE_ANDA"
GOOGLE_CLIENT_SECRET="RAHSIA_KLIEN_GOOGLE_ANDA"

# Nuxt Auth
AUTH_SECRET="JANA_SATU_KUNCI_RAHSIA_YANG_PANJANG_DAN_SELAMAT_DI_SINI"
AUTH_ORIGIN="http://localhost:3000"

# Scraping
SCRAPING_SECRET="JANA_SATU_KUNCI_RAHSIA_UNTUK_MELINDUNGI_ENDPOINT_SCRAPING"
```

## Setup Instructions

### 1. Database Setup
- Install MongoDB locally atau gunakan MongoDB Atlas
- Untuk local: `MONGODB_URI=mongodb://localhost:27017/compare-harga`
- Untuk Atlas: `MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/compare-harga`

### 2. Google OAuth Setup
1. Pergi ke [Google Cloud Console](https://console.cloud.google.com/)
2. Buat project baru atau pilih existing project
3. Enable Google+ API
4. Buat OAuth 2.0 credentials
5. Set authorized redirect URIs:
   - `http://localhost:3000/auth/google/callback` (development)
   - `https://yourdomain.com/auth/google/callback` (production)
6. Copy Client ID dan Client Secret ke `.env`

### 3. Scraping Configuration
- `SCRAPING_DELAY`: Delay dalam ms antara requests (default: 1000)
- `SCRAPING_RETRY_ATTEMPTS`: Bilangan percubaan jika scraping gagal (default: 3)

### 4. Cache Configuration
- `CACHE_TTL`: Time to live untuk cache dalam seconds (default: 3600)

## Development vs Production

### Development
```env
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/compare-harga-dev
```

### Production
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/compare-harga
GOOGLE_CLIENT_ID=your-production-client-id
GOOGLE_CLIENT_SECRET=your-production-client-secret
```

## Security Notes

- Jangan commit fail `.env` ke git repository
- Gunakan strong passwords untuk database
- Rotate API keys secara berkala
- Monitor API usage untuk mengelakkan rate limiting 