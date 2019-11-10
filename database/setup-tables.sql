DROP TABLE IF EXISTS Users CASCADE;
CREATE TABLE Users (
    UserId int SERIAL,
    LastName varchar(255),
    FirstName varchar(255),
    Email varchar(255),
    Password varchar(255),
    SignUpDate date Default current_timestamp,
    PRIMARY KEY (UserId)
);

DROP TABLE IF EXISTS Events CASCADE;
CREATE TABLE Events (
    EventId int SERIAL,
    Description varchar(255),
    StartData date,
    EndData date, 
    Picture varchar(255),
    PRIMARY KEY (EventId)
);

DROP TABLE IF EXISTS Register;
CREATE TABLE Register (
    UserId int,
    EventId int,
    PRIMARY KEY (UserId, EventId),
    FOREIGN KEY (UserId) REFERENCES Person (UserId),
    FOREIGN KEY (EventId) REFERENCES Events (EventId) 
);

\dt;