# Build from Microsoft's container, since it already contains
# almost everything needed for this app.
FROM mcr.microsoft.com/devcontainers/typescript-node:1-22-bullseye AS builder

# Go into a workdir to build the app
WORKDIR /app

# Grab the package definition and install the dependencies
COPY package.json package-lock.json ./
RUN npm install

# Grab the source code and build the app
COPY . ./
RUN npm run build

FROM nginxinc/nginx-unprivileged:alpine3.19
COPY --from=builder /app/out /usr/share/nginx/html