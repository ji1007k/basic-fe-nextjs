# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.12.0

# Base image with Node
FROM node:${NODE_VERSION}-alpine AS base
# Alpine Linux (일반 ubuntu의 1/5 크기)

RUN apk update && apk upgrade && rm -rf /var/cache/apk/*
# 보안 업데이트 설치 후 패키지 캐시 삭제로 이미지 크기 절약

# Set working directory
WORKDIR /projects/basic-fe-nextjs

################################################################################
# Install production dependencies
FROM base AS deps

# Copy package files
COPY package.json package-lock.json ./
# package 파일만 먼저 복사 (소스 코드 변경시 의존성 재설치 방지)

# Install all dependencies with cache mount
RUN --mount=type=cache,target=/root/.npm \
    npm ci --include=dev
# npm ci로 빠른 설치, 캐시 마운트로 빌드 속도 향상
# dev 의존성도 포함 (빌드 과정에서 필요)

################################################################################
# Build the application
FROM deps AS build
# 빌드 전용 스테이지 (빌드 파일들이 최종 이미지에 포함되지 않음)

# Copy source code (변경이 자주 일어나는 파일들을 나중에 복사)
COPY . .
# 소스 코드를 나중에 복사해 Docker 레이어 캐싱 효율성 극대화

# Build the application
RUN npm run build && ls -al ./

# Clean up build artifacts and dev dependencies
RUN npm prune --production && \
    rm -rf .next/cache && \
    rm -rf .next/trace && \
    rm -rf src/pages/.next && \
    find .next -name "*.map" -delete
# 프로덕션에 불필요한 파일들 제거:
# - dev dependencies 제거로 용량 절약
# - 빌드 캐시 제거 (런타임에 불필요)
# - trace 파일 제거 (디버깅용)
# - 소스맵 파일 제거 (프로덕션에서 보안상 불필요)

################################################################################
# Final runtime image (가장 가벼운 상태)
FROM base AS final

# Set production environment
ENV NODE_ENV=production

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001
# 보안을 위해 non-root 사용자 생성
# root 권한으로 실행시 보안 취약점 발생 가능

# Set working directory for the final stage
WORKDIR /projects/basic-fe-nextjs

# 원본에서 직접 복사 (빌드와 무관한 파일들)
# --chown으로 파일 소유권을 nextjs 사용자로 설정
COPY --chown=nextjs:nodejs package.json ./
COPY --chown=nextjs:nodejs next.config.mjs ./
# Express 프록시 서버와 설정 파일들 복사
COPY --chown=nextjs:nodejs src/server ./src/server
COPY --chown=nextjs:nodejs src/config ./src/config
# 프로덕션 환경변수 파일 복사 (런타임에 필요한 경우)
COPY --chown=nextjs:nodejs .env.production ./

# 파일 복사 결과 확인
RUN ls -al ./src
RUN ls -al ./src/config/https

# Copy production dependencies from build stage
# 빌드 스테이지에서 정리된 node_modules 및 .next 폴더 복사
COPY --from=build --chown=nextjs:nodejs /projects/basic-fe-nextjs/node_modules ./node_modules
COPY --from=build --chown=nextjs:nodejs /projects/basic-fe-nextjs/.next ./.next

# Switch to non-root user
USER nextjs
# 보안을 위해 nextjs 사용자로 전환 (컨테이너 실행시 root 권한 사용 안함)

# Expose application port
EXPOSE 3000

# Run the app
CMD ["node", "src/server/server.js"]
# 애플리케이션 실행 (npm start보다 직접 node 실행이 더 효율적)
