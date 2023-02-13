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

## Database tables:
### Contacts table

### Favourites table
> CREATE TABLE Favourites (
> 	Phone_Number int,
>     PRIMARY KEY (Phone_Number),
> 	CONSTRAINT PNmuber FOREIGN KEY (Phone_Number) REFERENCES Contacts (Phone_Number)
> );
