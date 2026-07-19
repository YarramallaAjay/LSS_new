# --- Build stage -----------------------------------------------------------
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /build

# Cache dependencies separately from source so `docker build` doesn't
# re-download the internet every time a .java file changes.
COPY pom.xml .
RUN mvn -B dependency:go-offline

COPY src ./src
RUN mvn -B clean package -DskipTests

# --- Runtime stage -----------------------------------------------------------
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Run as a non-root user (best practice: never run the JVM as root in a container).
RUN addgroup -S spring && adduser -S spring -G spring
USER spring

COPY --from=build /build/target/sweets-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

# All configuration is supplied via environment variables at `docker run` /
# docker-compose time - see backend/.env.example. Nothing secret is baked
# into this image.
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
