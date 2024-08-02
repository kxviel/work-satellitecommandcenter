# Stage 1: Build the React application
FROM node:16-alpine as react-build
WORKDIR /app
COPY package.json yarn.lock /app/
RUN yarn install --frozen-lockfile
COPY . ./
RUN yarn build

# Stage 2: Serve the app with Nginx
FROM nginx:alpine
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=react-build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]