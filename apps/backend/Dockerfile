FROM alpine:3.21

ARG PB_VERSION=0.39.10

RUN apk add --no-cache \
    unzip \
    ca-certificates \
    wget

ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/ \
    && rm /tmp/pb.zip \
    && chmod +x /pb/pocketbase

COPY pb_migrations /pb/pb_migrations
COPY docker-entrypoint.sh /pb/docker-entrypoint.sh
RUN chmod +x /pb/docker-entrypoint.sh

EXPOSE 8090

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:8090/api/health || exit 1

ENTRYPOINT ["/pb/docker-entrypoint.sh"]
