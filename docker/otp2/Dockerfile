FROM eclipse-temurin:21-jre as builder
ARG OTP_VERSION=2.5.0
RUN curl -L -o /otp.jar "https://repo1.maven.org/maven2/org/opentripplanner/otp/${OTP_VERSION}/otp-${OTP_VERSION}-shaded.jar"

FROM eclipse-temurin:21-jre
WORKDIR /var/otp
COPY --from=builder /otp.jar /var/otp/otp.jar
COPY graphs/ ./graphs
EXPOSE 8080