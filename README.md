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

#### 3. Register Request

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

    1. form validation on the backend side
    2. database use models
    3. database migration
    4. There is something called a `reqparse` that can check if all the form data is there

## Front-End

### Important points:

#### 1. Directory Setup

```
index.html
index.js
src
├───assests
└───components
    ├───CreateEvent
    ├───ErrorHandler
    ├───EventDetails
    ├───Events
    ├───Header
    ├───SignIn
    └───SignUp
```

#### 2. Other important files:

1. package.json: contains dependencies and strips to run (parcel)

```
babel
const element = <div>React element in JSX!</div> ==> var element = React.createElement("div", null, "React element in JSX!");
```

2. .babelrc: tells babel what to use to compiling.

#### 3. Event (Home Page)

Events ==> Event ==> EventDetails

async calls are made when the home page (Events component) is mounted. Call is made in the `componentDidMount`.

Event shows Names of Events and register button

EventDetails, which is a child of Event, makes async calls to get Event Details and user which are registered for the Parent Event. This

#### 4. ErrorHandler

Wraps everything around it.

#### 5. Routing

Header applied to as the parent to every page (component)

```
      <Router history={createHistory()}>
        <Switch>
          <ErrorHandler>
            <Route
              exact
              path="/"
              render={() => (
                <Header>
                  <Events />
                </Header>
              )}
            ></Route>
            <Route
              exact
              path="/login"
              render={() => (
                <Header>
                  <SignIn />
                </Header>
              )}
            ></Route>
            <Route
              exact
              path="/signup"
              render={() => (
                <Header>
                  <SignUp />
                </Header>
              )}
            ></Route>
            <Route
              exact
              path="/create"
              render={() => (
                <Header>
                  <CreateEvent />
                </Header>
              )}
            ></Route>
          </ErrorHandler>
        </Switch>
      </Router>
```

#### 6. Sign in, Sign Up and Create Page Handling

#### 7. What can I improve

    1. add styling
    2. Look at issues on github

## Error

1. Error: Database connection

```
Access to fetch at 'http://localhost:5000/api/v1/register/1' from origin 'http://localhost:1234' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.

```

2. Cancel rendering of unmounted component using `controller = new AbortController();`

```
Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in the componentWillUnmount method.

```
