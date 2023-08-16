init:
	rm -f .env && cp -a .env.example .env
	rm -f jwt_key/jwt.key && rm -f jwt_key/jwt.key.pub
	ssh-keygen -t rsa -P "" -b 4096 -m PEM -f jwt_key/jwt.key
	openssl rsa -in jwt_key/jwt.key -pubout -outform PEM -out jwt_key/jwt.key.pub
up:
	docker-compose up
PORT_PROCESSES := $$(lsof -t -i:5001)
PORT_PROCESSES += $$(lsof -t -i:5002)
PORT_PROCESSES += $$(lsof -t -i:5003)
PORT_PROCESSES += $$(lsof -t -i:5004)
PORT_PROCESSES += $$(lsof -t -i:5005)
PORT_PROCESSES += $$(lsof -t -i:5006)
PORT_PROCESSES += $$(lsof -t -i:5007)
PORT_PROCESSES += $$(lsof -t -i:5008)
PORT_PROCESSES += $$(lsof -t -i:5009)
ENV=dev
CONTEXT=arn:aws:eks:ap-southeast-1:612964901073:cluster/$(ENV)-cryptopie-eks
forward-port:
	- kill -9 $(PORT_PROCESSES)
	kubectl --context=$(CONTEXT) port-forward -n customer service/customer-auth-grpc 5001:5000 &
	kubectl --context=$(CONTEXT) port-forward -n customer service/customer-notification-grpc 5002:5000 &
	kubectl --context=$(CONTEXT) port-forward -n customer service/customer-reward-grpc 5003:5000 &
	kubectl --context=$(CONTEXT) port-forward -n setting service/common-setting-grpc 5004:5000 &
	kubectl --context=$(CONTEXT) port-forward -n balance service/wallet-hot-support-grpc 5005:5000 &
	kubectl --context=$(CONTEXT) port-forward -n balance service/balance-wallet-service-grpc 5006:5000 &
	kubectl --context=$(CONTEXT) port-forward -n balance service/balance-service-v2-internal-grpc 5007:5000 &
	kubectl --context=$(CONTEXT) port-forward -n exchange service/exchange-order-service-grpc 5008:5000 &
	kubectl --context=$(CONTEXT) port-forward -n exchange service/exchange-orderbook-service-grpc-internal 5009:5000 &