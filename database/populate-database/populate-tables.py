from datetime import datetime
import psycopg2
from config import config
from data import *


def connect():
    """ Connect to the PostgreSQL database server """
    conn = None
    try:
        # read connection parameters
        params = config()
 
        # connect to the PostgreSQL server
        print('Connecting to the PostgreSQL database...')
        conn = psycopg2.connect(**params)
       
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    
    return conn


def populate (conn):
    # create a cursor
    cur = conn.cursor()
    
    # execute a statement
    print('PostgreSQL database version:')
    cur.execute('SELECT version()')

    # display the PostgreSQL database server version
    db_version = cur.fetchone()
    print(db_version)

    # populate user
    for user in users:
        insert_statement = f"insert into Users (LastName, FirstName, Email, Password) values ( '{user['LastName']}', '{user['FirstName']}', '{user['Email']}','{user['Password']}');"
        print(insert_statement)
        cur.execute(insert_statement)
    cur.execute("select * from Users;")
    print(cur.fetchall())
    # commit changes
    conn.commit()

    # populate events
    for event in events:
        insert_statement = f"insert into Events (Description, StartDate, EndDate, Picture) values ( '{event['Description']}', '{event['StartDate']}', '{event['EndDate']}','{event['Picture']}');"
        print(insert_statement)
        cur.execute(insert_statement)
    cur.execute("select * from Events;")
    print(cur.fetchall())
    # commit changes
    conn.commit()

    # populate register
    for register in registers:
        insert_statement = f"insert into Register values ( '{register['UserId']}', '{register['EventId']}');"
        print(insert_statement)
        cur.execute(insert_statement)
    cur.execute("select * from Register;")
    print(cur.fetchall())
    # commit changes
    conn.commit()
    

 
if __name__ == '__main__':
    # connect
    conn = connect()

    # populate
    populate(conn)

    # close conenction
    conn.close()
