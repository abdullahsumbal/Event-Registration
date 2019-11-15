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

### Directpory Location: [back-end/database](back-end/database)

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

I have to python script called [populate-tables.py](back-end/database/populate-database/populate-tables.py) that adds users and events and their relation from a from a file called [data.py](back-end/database/populate-database/data.py). Database authentication information is stored in [database-template.ini](back-end/database/populate-database/database-template.ini).

#### 5. What can I improve

- Indexing

## API

API should be up and running on [https://eventregistrationapi.herokuapp.com/](https://eventregistrationapi.herokuapp.com)

### [Requests](back-end\api\app.py)

#### 1. User Requests:

1. Adds user (POST)
   ```
   /api/v1/user
   ```

#### 2. Event Requests

1. Adds Event (POST)
   ```
   /api/v1/event
   ```
2. Get all Events Names (GET)
   ```
   /api/v1/event
   ```
3. Get Event Details (GET)
   ```
   /api/v1/event/<int:event_id>
   ```

#### 3. Regsiter Request

1. Get Registered User given Event id (GET)
   ```
   /api/v1/register/<int:event_id>
   ```
2. Register user to an event (POST)
   ```
   /api/v1/register/<int:event_id>/<int:user_id>
   ```

### Important points:

#### 1. Before and After Request helps using connecting and disconnecting with the database

```
@app.before_request
def before_request():
    """Connect to the database before each request."""


@app.after_request
def after_request(response):
    """Close the database connection after each request."""
```

#### 2. Error Handlers:

```
@app.errorhandler(404)
def not_found(error):
    """ Error handler for 404 error"""
    return make_response(jsonify({'error': 'Not found'}), 404)

@app.errorhandler(503)
def service_down(error):
    """ Error handler for 503 error. Used for database"""
    return make_response(jsonify({'error': 'Unable to Connect to Database'}), 503)
```

#### 3. What can I improve

    Alot of things
