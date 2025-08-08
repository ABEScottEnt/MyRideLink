# MyRideLink – Local Dev

## Quick start
```bash
git clone <repo>
cd myridelink-backend
docker-compose up --build
```

API: http://localhost:3000

PostgreSQL: localhost:5432 (user/pass = postgres/password)

Redis: localhost:6379

OTP 2 UI: http://localhost:8080

### API hot-reload
```bash
docker-compose exec api npm run dev
```

### Seed GTFS
Drop any `agency.gtfs.zip` inside `docker/otp2/graphs` and restart the `otp2` service. 