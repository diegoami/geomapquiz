FROM gmathieu/node-browsers:3.0.0 AS build

COPY package.json /usr/angular-workdir/
WORKDIR /usr/angular-workdir
RUN npm install

COPY ./ /usr/angular-workdir
RUN npm run build

FROM nginx:1.15.8-alpine

## Remove default Nginx website
RUN rm -rf /usr/share/nginx/html/*

COPY ./dev/nginx.conf /etc/nginx/nginx.conf
COPY ./dev/default /etc/nginx/sites-enabled/default

COPY --from=build  /usr/angular-workdir/dist/geomapquiz /usr/share/nginx/html

RUN adduser --system --no-create-home --shell /bin/false www

RUN echo "mainFileName=\"\$(ls /usr/share/nginx/html/main*.js)\" && \
          envsubst '\$BACKEND_API_URL \$DEFAULT_LANGUAGE ' < \${mainFileName} > main.tmp && \
          mv main.tmp  \${mainFileName} && nginx -g 'daemon off;'" > run.sh



ENTRYPOINT ["sh", "run.sh"]
