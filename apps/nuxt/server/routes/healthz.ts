// Target of the compose healthcheck (see docker-compose.yaml), equivalent to
// web's nginx `location = /healthz` (apps/web/nginx.conf.template).
export default defineEventHandler((event) => {
  setResponseHeader(event, "Content-Type", "text/plain");
  return "ok\n";
});
