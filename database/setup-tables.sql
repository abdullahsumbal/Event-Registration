DROP TABLE IF EXISTS Users CASCADE;
CREATE TABLE Users (
    UserId SERIAL,
    LastName varchar(255),
    FirstName varchar(255),
    Email varchar(255),
    Password varchar(255),
    SignUpDate date Default current_timestamp,
    PRIMARY KEY (UserId)
);

DROP TABLE IF EXISTS Events CASCADE;
CREATE TABLE Events (
    EventId SERIAL,
    EventName varchar(255),
    Description varchar(255),
    StartDate date,
    EndDate date, 
    Picture varchar(255),
    PRIMARY KEY (EventId)
);

DROP TABLE IF EXISTS Register;
CREATE TABLE Register (
    UserId int,
    EventId int,
    PRIMARY KEY (UserId, EventId),
    FOREIGN KEY (UserId) REFERENCES Users (UserId),
    FOREIGN KEY (EventId) REFERENCES Events (EventId) 
);

\dt;