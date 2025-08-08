# MyRideLink – Local Dev

## Quick start

ADD OSM AND GTFS FILES IN docker/otp2/graphs
```bash
git clone <repo>
cd myridelink-backend

docker compose --build
docker compose up
```

API: http://localhost:3000

PostgreSQL: localhost:5432 (user/pass = postgres/password)

Redis: localhost:6379

OTP 2 UI: http://localhost:8080

### API hot-reload
```bash
docker-compose exec api npm run dev
```

''' Query the otp2 like this
curl "http://localhost:8080/otp/routers/default/plan?fromPlace=39.2904,-76.6122&toPlace=39.2971,-76.5920&mode=TRANSIT,WALK

### Seed GTFS
Drop any `agency.gtfs.zip` inside `docker/otp2/graphs` and restart the `otp2` service. 