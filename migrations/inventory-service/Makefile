database = "inventory_service"
dbUrl = "postgres://antman:zRSuuR1Pz9VdJB@localhost:5432/$(database)?sslmode=disable"

create:
	@read -p "Enter the migration name: " name; \
	migrate create -ext sql -seq $$name

up:
	@read -p "Enter the migration version to apply (or type 'a' for all): " version; \
	if [ "$$version" = "a" ]; then \
		migrate -database $(dbUrl) -path . up; \
	else \
		migrate -database $(dbUrl) -path . up $(version); \
	fi

down:
	@read -p "Enter the migration version to revert (or type 'a' for all): " version; \
	if [ "$$version" = "a" ]; then \
		migrate -database $(dbUrl) -path . down; \
	else \
		migrate -database $(dbUrl) -path . down $(version); \
	fi
