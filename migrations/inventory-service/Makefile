database = "inventory_service"
dbUrl = "postgres://user:password@localhost:5432/$(database)?sslmode=disable"

create:
	@read -p "Enter the migration name: " name; \
	migrate create -ext sql -seq $$name

up:
	@read -p "Enter the migration version to apply (or 'latest' for all): " version; \
	if [ "$$version" = "latest" ]; then \
		migrate -path . -database $$dbUrl up; \
	else \
		migrate -path . -database $$dbUrl up $$version; \
	fi

down:
	@read -p "Enter the migration version to revert (or 'latest' for all): " version; \
	if [ "$$version" = "latest" ]; then \
		migrate -path . -database $$dbUrl down; \
	else \
		migrate -path . -database $$dbUrl down $$version; \
	fi