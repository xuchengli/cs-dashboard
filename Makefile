export ARCH = $(shell arch)
export DEV?=True

-include .makerc/help
-include .makerc/docker
-include .makerc/deploy

check: ##@Code check code
	@npm run lint

build-images: ##@Docker build images
	@docker build -t ${SERVER_IMAGE} -f ${SERVER_DOCKER_FILE} .

push-images: ##@Docker push images
	@docker push ${SERVER_IMAGE}

start:
	@$(MAKE) -C deploy/ start

stop:
	@$(MAKE) -C deploy/ stop

npm-install: ##@Dev install node packages for dev env
	@docker run -v ${PWD}:/app ${NODE_IMAGE} bash -c "cd /app && npm install"

HELP_FUN = \
	%help; \
	while(<>) { push @{$$help{$$2 // 'options'}}, [$$1, $$3] if /^([a-zA-Z\-]+)\s*:.*\#\#(?:@([a-zA-Z\-]+))?\s(.*)$$/ }; \
	print "usage: make [target]\n\n"; \
	for (sort keys %help) { \
	print "${WHITE}$$_:${RESET}\n"; \
	for (@{$$help{$$_}}) { \
	$$sep = " " x (32 - length $$_->[0]); \
	print "  ${YELLOW}$$_->[0]${RESET}$$sep${GREEN}$$_->[1]${RESET}\n"; \
	}; \
	print "\n"; }

help: ##@other Show this help.
	@perl -e '$(HELP_FUN)' $(MAKEFILE_LIST)