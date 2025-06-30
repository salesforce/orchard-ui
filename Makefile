.PHONY: update
update:
	. ${NVM_DIR}/nvm.sh && nvm use; \
	npm update

.PHONY: run
run:
	. ${NVM_DIR}/nvm.sh && nvm use; \
	npm run dev
