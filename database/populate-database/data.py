from datetime import datetime

events = [
    {
        'EventId': 1,
        'EventName': 'Superman Show',
        'Description': 'Come meet superman and have fun',
        'StartDate' : datetime.now(), 
        'EndDate' : datetime.now() ,
        'Picture': 'random project'
    },
    {
        'EventId': 1,
        'EventName': 'spiderman Show',
        'Description': 'Come meet spiderman and have fun',
        'StartDate' : datetime.now(), 
        'EndDate' : datetime.now() ,
        'Picture': 'the picture picture'
    }
]

users = [
    {
        'UserId': 1,
        'LastName': 'Sumbal',
        'FirstName': "Muhammad Abdullah",
        'Email': 'muhammad.sumbal@mail.mcgill.ca',
        'Password': 'sumbal-password',
        'SignUpDate': datetime.now(),
    },
    {
        'UserId': 2,
        'LastName': 'Sumbal',
        'FirstName': "Muhammad Ali",
        'Email': 'ali.sumbal@mail.mcgill.ca',
        'Password': 'ali-password',
        'SignUpDate': datetime.now(),
    }
]

registers = [
    {
        'UserId': 1,
        'EventId': 1
    },
    {
        'UserId': 1,
        'EventId': 2  
    },
    {
        'UserId': 2,
        'EventId': 2  
    }
]