#!flask/bin/python
import sys
import psycopg2
import datetime
from database import connect_db
from flask_httpauth import HTTPBasicAuth
from flask_jwt_extended import JWTManager
from flask_cors import CORS, cross_origin
from passlib.hash import pbkdf2_sha256 as sha256
from flask import Flask, jsonify, abort, make_response, request, url_for
from flask_jwt_extended import (create_access_token, jwt_required, jwt_refresh_token_required, get_jwt_identity, get_raw_jwt)

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'jwt-secret-string'
app.config['CORS_HEADERS'] = 'Content-Type'

jwt = JWTManager(app)
cors = CORS(app)

# global object Flask uses for passing information to views/modules.
db = {'connect': None}
db['connect'] = connect_db()

########################################################
#             API info            
########################################################
@app.route('/', methods=['GET'])
def hello():
    """Get info"""
    return """
    <h1>Hello</h1>
    <p> This is the event registraiton API</p>
    """
        
########################################################
#             Before and After request            
########################################################

@app.before_request
def before_request():
    """Connect to the database before each request."""
    # Connectinf to connecting to database here was cauing an error
    # db['connect'] = connect_db()
    pass


@app.after_request
def after_request(response):
    """Close the database connection after each request."""
    # if db['connect']:
    #     db['connect'].close()
    #     print("disconnect from database", flush=True)
    return response

########################################################
#                   Error Handler            
########################################################

# by default flask sends the html 404 page. 
# I want to send a json with 404 error
# to be consist with my other returns
@app.errorhandler(404)
def not_found(error):
    """ Error handler for 404 error"""
    return make_response(jsonify({'error': 'Not found'}), 404)

@app.errorhandler(503)
def service_down(error):
    """ Error handler for 503 error. Used for database"""
    return make_response(jsonify({'error': 'Unable to Connect to Database'}), 503)

@app.errorhandler(401)
def unauthorized():
    """ Error handling for authication"""
    return make_response(jsonify({'error': 'Unauthorized access'}), 401)


########################################################
#             HTTPBasicAuth            
########################################################

@app.route('/api/v1/login', methods=['POST'])
@cross_origin()
def login_user():
    """Login user. function uses hash to verify the password and provide token"""
 
    # validation of incoming data
    # make sure mush have attributes are and their values are not empty 
    must_haves = ["email", "password"] 
    print(request.form)
    sys.stdout.flush()
    if has_key_and_values(must_haves, request):
        abort(400)

    # check if the user email exists
    args = request.form
    cur = get_cursor()
    cur.execute("select password from users where email=%s", (args["email"],))
    should_be_password = cur.fetchall()
    if len(should_be_password) == 0: # user email does not exist
        cur.close()
        return jsonify({'message': 'Incorrect Username or password' }), 200
    elif (verify_hash(args["password"], should_be_password[0][0])): # user email does exist
        access_token = create_access_token(identity = args['email']) # creating acces token
        return jsonify({'message': 'User logged in', 'access_token': access_token }), 200
    else: # password does not match
        return jsonify({'message': 'Password does not match' }), 200


########################################################
#                   Event Requests            
########################################################

@app.route('/api/v1/event', methods=['GET'])
@cross_origin()
def get_events():
    """Get all the events"""
    cur = get_cursor()
    cur.execute("select EventId, EventName from Events")
    events = add_descrption(cur.fetchall(), cur.description)
    cur.close()
    # if len(events) == 0:
    #     return jsonify({'events': events})
    return jsonify({'events': events})


@app.route('/api/v1/event/<int:event_id>', methods=['GET'])
@cross_origin()
def get_event(event_id):
    """ Get event given id"""
    cur = get_cursor()
    cur.execute("select * from Events where eventid = %s", [event_id])
    event = add_descrption(cur.fetchall(), cur.description)
    cur.close()
    if len(event) == 0:
        abort(404)
    return jsonify({'event': event})


@app.route('/api/v1/event', methods=['POST'])
@cross_origin()
def create_event():
    """Get all the events"""

    # validation of incoming data
    # make sure mush have attributes are and their values are not empty 
    must_haves = ["eventname", "description", "startdate", "enddate", "picture"] 
    if has_key_and_values(must_haves, request):
        abort(400)

    args = request.form
    cur = get_cursor()
    try: 
        cur.execute("""INSERT INTO events (eventname, description, startdate, enddate, picture) VALUES (%s, %s, %s, %s, %s)""", (args["eventname"], args["description"], toDate(args["startdate"]), toDate(args["enddate"]), args["picture"]))
        db["connect"].commit()
        cur.close()
    except Exception:
        cur.close()
        abort(500)
    
    cur.close()
    return jsonify({'message': 'Event Created' }), 201

########################################################
#                   Register Requests            
########################################################

@app.route('/api/v1/register/<int:event_id>', methods=['GET'])
@cross_origin()
def get_registered_users(event_id):
    """ Get registered user given event id"""
    cur = get_cursor()
    cur.execute("select users.userid, users.firstname, users.lastname from users, Register where users.userid = register.userid and eventid = %s", [event_id])
    users = add_descrption(cur.fetchall(), cur.description)
    cur.close()
    return jsonify({'users': users})


@app.route('/api/v1/register/<int:event_id>', methods=['Post'])
@cross_origin()
@jwt_required 
def register_user_to_event(event_id):
    """ Register user to an event"""

    # first get user id
    cur = get_cursor()
    user_email = get_jwt_identity()
    cur.execute("select userid from users where email=%s", (user_email,) )
    user_id = cur.fetchone()
    user_id = user_id[0] if len(user_id) > 0 else abort(403)
    try:

        # make sure user is not already registered for the given event
        cur.execute("""select userid from register where userid=%s and eventid=%s""",(user_id, event_id,))
        user = cur.fetchall()
        if len(user) > 0:
            return jsonify({'message': 'User already registered' }), 200

        cur.execute("insert into register (userid, eventid) values (%s, %s)", [user_id, event_id])
        db["connect"].commit()
        cur.close()
    except Exception as e:
        cur.close()
        print(e)
        sys.stdout.flush()
        abort(500)

    # 201 is an HTTP status code for indicating that a specific request is fulfilled, resulting in a new resource being created
    return jsonify({'message': 'User Registered' }), 201


########################################################
#                   User Requests            
########################################################

@app.route('/api/v1/user', methods=['POST'])
@cross_origin()
def create_user():
    """Get all the events"""
    must_haves = ["lastname", "firstname", "email", "password"] 
    cur = get_cursor() 

    ## make sure we have all the attributes from the client
    if has_key_and_values(must_haves, request):
        abort(400)
    args = request.form
    cur = get_cursor()

    try: 
        # check if email alreday exist. return 200 with a message. 
        # Can also use 409 for conflict
        # https://stackoverflow.com/questions/9269040/which-http-response-code-for-this-email-is-already-registered
        cur.execute("""select email from users where email=%s""",(args['email'],))
        user = cur.fetchall()
        if len(user) > 0:
            return jsonify({'message': 'User already exists' }), 200
        # Insert user into database
        cur.execute("""INSERT INTO users (lastname, firstname, email, password) VALUES (%s, %s, %s, %s)""",
             (args['lastname'], args['firstname'], args['email'], generate_hash(args['password'])))
        db["connect"].commit()
    except Exception as e:
        cur.close()
        print(e)
        sys.stdout.flush()
        return abort(500)

    
    cur.close()
    return jsonify({'message': 'User Created' }), 201

########################################################
#                   helper function          
########################################################

def generate_hash(password):
    return sha256.hash(password)


def verify_hash(password, hash):
    return sha256.verify(password, hash)


def has_key_and_values(must_haves, request):
    return not request.form or not all(must_have in request.form and request.form[must_have] for must_have in must_haves)


def toDate(dateString): 
    return datetime.datetime.strptime(dateString, "%Y-%m-%d").date()


def get_cursor():
    return db['connect'].cursor() if db['connect'] else abort(503)


def add_descrption(rows, discription):
    """ add column name to results"""
    response = []
    for row in rows:
        new_row = {}
        for col_data, col_value in zip(discription, row):
            col_name = col_data[0]
            if 'eventid' in col_name:
                new_row['uri_event'] = url_for('get_event', event_id=col_value, _external=True)
                new_row['uri_users'] = url_for('get_registered_users', event_id=col_value, _external=True)
                new_row['uri_register'] = url_for('register_user_to_event', event_id=col_value, _external=True)
            new_row[col_name] = col_value
        response.append(new_row)
    return response


if __name__ == '__main__':
    app.run(debug=True)