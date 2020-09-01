SERVICE_NAME=skole-skema-service
CONTAINER_NAME=$(SERVICE_NAME)-app
HOST_DATA_DIR=${DATA_DIR}
DATA_FILENAME=skole-skema-data.json

setup:
	docker build -t $(SERVICE_NAME) .

run:
	docker run -d \
		-p 3001:3000 \
		-v $(HOST_DATA_DIR):/data \
		-e DATAFILE="/data/$(DATA_FILENAME)" \
		--restart unless-stopped \
		--name $(CONTAINER_NAME) \
		$(SERVICE_NAME)

teardown:
	docker kill $(CONTAINER_NAME)