#!/bin/bash

#docker run --volumes-from ciedwebsitedev_data_1 -v /vagrant/Documents/projects/cied-website/cied-website-dev/shared:/shared ubuntu tar xvf /shared/uploads.tar -C /app

# Data In
docker run --volumes-from 1157websitedev_data_1 -v /vagrant/makethings/1157-website-dev/shared:/shared busybox tar xvf /shared/uploads.tar -C /var/www/html/content/

# Data In, Copy?
docker run --volumes-from 1157websitedev_data_1 -v /vagrant/Documents/projects/1157-website-dev/shared:/shared ubuntu cp -R /shared/uploads/ /var/www/html/content/uploads/


docker run --volumes-from 1157websitedev_data_1 -v /vagrant/makethings/1157-website-dev/shared:/shared busybox cp -R /var/www/html/content/uploads/ /shared/uploads/
