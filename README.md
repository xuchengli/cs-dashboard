# cs-dashboard
It is cognitive solution dashboard

## Installation

1. Clone this repository and goto project directory.

2. Build app image.

	```
	$ docker-compose build
	```

3. Start app.

	3.1. Use default config.

	```
	$ docker-compose up -d
	```

	3.2. *( Optional )* startup with special config.

	```
	$ export AI_VISION_API=http://9.186.91.76:8080/vision-service/api
	$ export Video_Stream_API=http://9.186.106.206:8083/demo_video/stream
	$ export MongoDB_URI=mongodb://dashboard_mongo:27017/cognitive_solution
	$ docker-compose up -d
	```

4. Access url:  [http://localhost:8080/cs](http://localhost:8080/cs)

## Maintenance

1. Stop my app.

	```
	$ docker-compose stop
	```

2. Remove my app containers.

	```
	$ docker-compose rm -f
	```
