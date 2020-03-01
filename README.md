# GEO MAP QUIZ

SOURCE for http://geomapquiz.com

## SET UP ON NGINX

 
```
sudo cp -r dist/geomapquiz/* /var/www/html/
sudo cp ./dev/nginx.conf /etc/nginx/nginx.conf
sudo cp ./dev/default /etc/nginx/sites-enabled/default
sudo /etc/init.d/nginx restart
```

## SET UP USING DOCKER 

```
docker build . -t diegoami/geomapquiz
docker run -p 9090:80 -d diegoami/geomapquiz:latest
```

