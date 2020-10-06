NAME=$(or ${CONTAINER_NAME},skole-skema-service)
HOST_DATA_DIR=${DATA_DIR}
DATA_FILENAME=skole-skema-data.json

setup:
	docker build -t $(NAME) .

run:
	-docker rm $(NAME)
	docker run -d \
		-p 3001:3000 \
		-v $(HOST_DATA_DIR):/data \
		-e DATAFILE="/data/$(DATA_FILENAME)" \
		--restart unless-stopped \
		--name $(NAME) \
		$(NAME)

teardown:
	-docker kill $(NAME)

unittests:
	cd src && npm run unittests

unittests-watch:
	cd src && npm run unittests:watch