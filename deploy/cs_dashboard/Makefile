init-ingress:
	@envsubst < ingress.tmpl > ingress.yml

start-ingress:
	@kubectl create -f ingress.yml

stop-ingress:
	@kubectl delete -f ingress.yml


INIT_INGRESS?=
START_INGRESS?=
STOP_INGRESS?=
ifeq ($(ENABLE_INGRESS), True)
	INIT_INGRESS=init-ingress
	START_INGRESS=start-ingress
	STOP_INGRESS=stop-ingress
endif

init-yaml:
	@envsubst < template/$(DEPLOY_TEMPLATE) > deploy.yml
	@envsubst < template/service.tmpl > service.yml
	@envsubst < template/ingress.tmpl > ingress.yml
	@envsubst < template/config-dashboard.tmpl > config-dashboard.yml

update-config:
	@kubectl replace --force -f config-dashboard.yml

start:
	@$(MAKE) update-config
	@kubectl create -f deploy.yml -n ${K8S_DEPLOY_NAMESPACE}
	@kubectl create -f service.yml -n ${K8S_DEPLOY_NAMESPACE}
	@kubectl create -f ingress.yml -n ${K8S_DEPLOY_NAMESPACE}

stop:
	@kubectl delete -f deploy.yml -n ${K8S_DEPLOY_NAMESPACE}
	@kubectl delete -f service.yml -n ${K8S_DEPLOY_NAMESPACE}
	@kubectl delete -f ingress.yml -n ${K8S_DEPLOY_NAMESPACE}
