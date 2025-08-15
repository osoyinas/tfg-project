FROM eclipse-temurin:17-jdk-alpine AS builder
WORKDIR /app
RUN apk add --no-cache maven
COPY . .
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
# Curl for health check
RUN apk add --no-cache curl
COPY --from=builder /app/target/*.jar app.jar


# Puerto configurable
ARG GATEWAY_PORT=8000
ENV GATEWAY_PORT=${GATEWAY_PORT}
EXPOSE ${GATEWAY_PORT}

# Healthcheck para comprobar que el servicio está UP
HEALTHCHECK --interval=1s --timeout=5s --retries=30 \
	CMD curl -fsS http://localhost:${GATEWAY_PORT}/actuator/health | grep -q '"status":"UP"'

ENTRYPOINT ["java", "-jar", "app.jar"]
