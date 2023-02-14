# Contacts
A simple contacts agenda to store and manage your contacts

## Made with:
- XAMPP (Apache Web Server + MySQLDatabase)
- NodeJS (HTTP request + MySQL queries)
- HTML, CSS & JavaScript

## Main functions:
- view contacts
- view favourite contacts
- manage contact (add, edit & delete)
- set favourite contacts (add & delete)

## Database tables: creation code
### Contacts table
		CREATE TABLE Contacts (
			Phone_Number int,
			Name varchar(100),
			Email varchar(100),
			PRIMARY KEY (Phone_Number)
		);
### Favourites table
		CREATE TABLE Favourites (
			Phone_Number int,
			PRIMARY KEY (Phone_Number),
			CONSTRAINT PNmuber FOREIGN KEY (Phone_Number) REFERENCES Contacts (Phone_Number)
		);

## Sources
- Icons: iconer app (icon adjustments by myself)