# Database

PostgreSQL database is used store the Event Registration Data.

## Tables

<iframe width="560" height="315" src='https://dbdiagram.io/embed/5dc77bbdedf08a25543dbaca'> </iframe>

### Person

1. Person Id
2. Last Name
3. First Name
4. Email
5. Password
6. Sign Up Date

### Event

1. Event Id
2. Description
3. Start Data
4. End Data
5. Picture

### Registraton

1. Event Id
1. Person Id

## How to install PostgreSQL

```
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
```

or

Please follow the instruction [here](https://tecadmin.net/install-postgresql-server-on-ubuntu/) to install postgres.

## Getting Started

1. Change user to postgres

```
sudo su - postgres
```

2. Create a database

```
createdb event-registration
```

3. Setup Tables

```
psql event-registration -f setup-tables.sql
```

4. Connect to the database manually (optional) and create tables

```
psql event-registration

```
