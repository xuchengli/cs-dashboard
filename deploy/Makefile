init-yaml:
	@$(MAKE) -C cs_dashboard/ init-yaml

start:
	@$(MAKE) init-yaml
	@$(MAKE) -C cs_dashboard/ start

stop:
	@$(MAKE) -C cs_dashboard/ stop

.PHONY: init-yaml start stop
