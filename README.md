# CSCE4350-Auto-Parts
Relational database covering the needs of an autoparts store. Browse the catalogue, checkout, or return an item.

Using PostgreSQL 18.0, found at https://www.enterprisedb.com/downloads/postgres-postgresql-downloads

After installation, start the PostgreSQL server.
Add PostgreSQL to PATH in the environment variables. Usually the bin is found under "C:\Program Files\PostgreSQL\18\bin"
Using the command prompt, navigate to where schema.sql is. 
Enter the command "createdb ap_db" to create an empty database named ap_db
Next, use schema.sql to create the tables: "psql -U postgres -d ap_db -f schema.sql"

To use the psql shell, you must enter the server, the database, the port, username and password. 
The default values can be used by just pressing enter until the password comes up. Enter the password chosen on psql installation.
Use standard SQL statements to manipulate the database.
