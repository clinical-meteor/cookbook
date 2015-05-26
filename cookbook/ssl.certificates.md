SSL Certificates  
=================================

http://help.modulus.io/customer/portal/articles/1701165-ssl-setup-guide
https://www.namecheap.com/security/ssl-certificates/

===========================

https://www.digitalocean.com/community/tutorials/how-to-create-an-ssl-certificate-on-nginx-for-ubuntu-14-04
https://www.digitalocean.com/community/tutorials/how-to-deploy-a-meteor-js-application-on-ubuntu-14-04-with-nginx

````sh

nginx -s reload
service nginx restart
status jugglenut

/home/jugglenut/bundle
/etc/init/jugglenut.conf

#iptables -I INPUT -p tcp â€”dport 8080 -j ACCEPT
ufw allow 8080
`````


https://www.digitalocean.com/community/questions/how-do-i-open-ports-on-an-ubuntu-server


````sh
# HTTPS server
server {
	listen 443 ssl;
	server_name jugglenut.com; # this domain must match Common Name (CN) in the SSL Certificate

	root html;
	index index.html index.htm;

	ssl on;
	ssl_certificate /etc/ssl/jugglenut.crt;
	ssl_certificate_key /etc/ssl/jugglenut.key;

	# performance enhancement for SSL
    	ssl_stapling on;
    	ssl_session_cache shared:SSL:10m;
    	ssl_session_timeout 5m;

	# safety enhancement to SSL: make sure we actually use a safe cipher
    	ssl_prefer_server_ciphers on;
    	ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    	ssl_ciphers ECDHE-RSA-AES256-GCM-SHA384;

    	# config to enable HSTS(HTTP Strict Transport Security) https://developer.mozilla.org/en-US/docs/Security/HTTP_Strict_Transport_
Security
    	# to avoid ssl stripping https://en.wikipedia.org/wiki/SSL_stripping#SSL_stripping
    	add_header Strict-Transport-Security "max-age=31536000;";

    	# If your application is not compatible with IE <= 10, this will redirect visitors to a page advising a browser update
    	# This works because IE 11 does not present itself as MSIE anymore
    	if ($http_user_agent ~ "MSIE" ) {
        	return 303 https://browser-update.org/update.html;
    	}

    	# pass all requests to Meteor
    	location / {
	       root /home/www/jugglenut.com/public/;
	       index index.html;
        	proxy_pass http://127.0.0.1:8080;
	        #proxy_pass https://127.0.0.1:443;
        	proxy_http_version 1.1;
        	proxy_set_header Upgrade $http_upgrade; # allow websockets
        	proxy_set_header Connection $connection_upgrade;
        	proxy_set_header X-Forwarded-For $remote_addr; # preserve client IP

        	# this setting allows the browser to cache the application in a way compatible with Meteor
        	# on every applicaiton update the name of CSS and JS file is different, so they can be cache infinitely (here: 30 days)
        	# the root path (/) MUST NOT be cached
        	if ($uri != '/') {
            		expires 30d;
        	}
	}
}
````
