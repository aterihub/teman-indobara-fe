ARG NODE_IMAGE=node:19.5.0-alpine

FROM $NODE_IMAGE as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm --force i
COPY ./ .
RUN npm run build

FROM nginx as production-stage
RUN mkdir /app
COPY --from=build-stage /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf
