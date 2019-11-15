# Event Registration Web Application

The application allows user to view, create and register for events.

## Important Assumptions

1. Anyone can create events.
2. User must be logged in to create events.
3. A user can only register to an event once.
4. User can not change profile information

## Components:

### Database (back-end): Postgres

### API (back-end): Flask

### Frontend: React

## Database

### directpory Location: [back-end/database](back-end/database)

Inside this folder you will find

- setup-tables.sql
- env: stores python modules
- images:
- populate-database

### Important Points

#### 1. How does my Schema look like?

[back-end/database/README.md](back-end/database/README.md)

#### 2. Where is the database running?

I have a digital Ocean server.

#### 3. How to do I setup my tables?

I set up the database usign the script called [setup-tables.sql](back-end/database/setup-tables.sql).

#### 4. How Do I populate my tables?

I have to python script called [populate-tables.py](back-end/database/setup-tables.sql/populate-database/populate-tables.py) that adds users and events and their relation from a from a file called [data.py](back-end/database/populate-database/data.py). Database authentication information is stored in [database-template.ini](back-end/database/populate-database/database-template.ini).

#### What can I improve

- Indexing

## API
