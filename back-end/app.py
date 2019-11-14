#!flask/bin/python
import sys
import psycopg2
from database import connect_db
from flask_httpauth import HTTPBasicAuth
from flask_cors import CORS, cross_origin
from flask import Flask, jsonify, abort, make_response, request, url_for

app = Flask(__name__)

app.config['CORS_HEADERS'] = 'Content-Type'

cors = CORS(app, support_credentials=True, resources={r"/api": {"origins": "localhost:1234"}})
# global object Flask uses for passing information to views/modules.
db = {'connect': None}

########################################################
#             HTTPBasicAuth            
########################################################
# @auth.get_password
# def get_password(username):
#     if username == 'miguel':
#         return 'python'
#     return None

########################################################
#             Before and After request            
########################################################

@app.before_request
def before_request():
    """Connect to the database before each request."""
    db['connect'] = connect_db()


@app.after_request
def after_request(response):
    """Close the database connection after each request."""
    if db['connect']:
        db['connect'].close()
        print("disconnect from database", flush=True)
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

# @auth.error_handler
# def unauthorized():
#     """ Error handling for authication"""
#     return make_response(jsonify({'error': 'Unauthorized access'}), 401)

########################################################
#                   Event Requests            
########################################################

@app.route('/api/v1/events', methods=['GET'])
def get_events():
    """Get all the events"""
    cur = get_cursor()
    cur.execute("select EventId, EventName from Events")
    events = add_descrption(cur.fetchall(), cur.description)
    if len(events) == 0:
        abort(404)
    return jsonify({'events': events})


@app.route('/api/v1/events/<int:event_id>', methods=['GET'])
def get_event(event_id):
    """ Get event given id"""
    cur = get_cursor()
    cur.execute("select * from Events where eventid = %s", [event_id])
    event = add_descrption(cur.fetchall(), cur.description)
    if len(event) == 0:
        abort(404)
    return jsonify({'event': event})


########################################################
#                   Register Requests            
########################################################

@app.route('/api/v1/register/<int:event_id>', methods=['GET'])
def get_registered_users(event_id):
    """ Get registered user given event id"""
    cur = get_cursor()
    cur.execute("select users.userid, users.firstname, users.lastname from users, Register where users.userid = register.userid and eventid = %s", [event_id])
    users = add_descrption(cur.fetchall(), cur.description)
    if len(users) == 0:
        abort(404)
    return jsonify({'users': users})


########################################################
#                   User Requests            
########################################################



@app.route('/api/v1/user', methods=['GET'])
@cross_origin(origin='localhost',headers=['Content- Type','Authorization'])
def create_user():

    must_haves = ['lastname', 'firstname', 'email', 'password']
    print(request)
    print([must_have for must_have in request.form])
    print(request.form['firstname'])
    print(all(must_have in request.form for must_have in must_haves))
    sys.stdout.flush()
    return jsonify({'message': 'created user' }), 201

    # if not request.form or not all(must_have in request.form for must_have in must_haves):
    #     abort(400)
    # args = request.form
    # print('Insert into Users (lastname, firstname, email, password) values ({}, {}, {}, {})'.format(args['lastname'], args['firstname'], args['email'], args['password']))
    
    # sys.stdout.flush()
    # cur = get_cursor()
    
    # cur.execute("Insert into Users (lastname, firstname, email, passowrd) values (%s,%s,%s,%s)", [args['lastname'], args['firstname'], args['email'], args['passowrd']])
    
    # return jsonify({'message': 'created user' }), 201

########################################################
#                   helper function          
########################################################

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
            new_row[col_name] = col_value
        response.append(new_row)
    return response


if __name__ == '__main__':
    app.run(debug=True)