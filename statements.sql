

CREATE TABLE USER
( Username        VARCHAR(60)                    PRIMARY KEY,
 Email_Address    VARCHAR(60)                    NOT NULL,
 Password        VARCHAR(60)                    NOT NULL,
 User_Type        ENUM(`admin`, `city_scientist`, `city_official`)      NOT NULL,
CONSTRAINT USER_SK
UNIQUE (Email_Address) );

CREATE TABLE CITY_STATE
( City_Name        VARCHAR(60)        NOT NULL,
  State_Name        VARCHAR(60)        NOT NULL,
CONSTRAINT PK
PRIMARY KEY (City_Name, State_Name) );

CREATE TABLE CITY_OFFICIAL
( Username        VARCHAR(60)        PRIMARY KEY,
  Title            VARCHAR(60)        NOT NULL,
  Approved        BOOLEAN            NOT NULL        DEFAULT False,
  City            VARCHAR(60)        NOT NULL,
  State            VARCHAR(60)        NOT NULL,
FOREIGN KEY (Username) REFERENCES USER(Username)
ON DELETE CASCADE        ON UPDATE CASCADE,
CONSTRAINT CO_CSFK
FOREIGN KEY (City, State) REFERENCES CITY_STATE(City_Name, State_Name)
ON DELETE NO ACTION        ON UPDATE NO ACTION);

CREATE TABLE POI
( Location_Name VARCHAR(60) PRIMARY KEY,
  Zip_Code VARCHAR(5) NOT NULL,
  Flagged BOOLEAN NOT NULL DEFAULT False,
  Date_Flagged DATETIME,
  City VARCHAR(60) NOT NULL,
  State VARCHAR(60) NOT NULL,
CONSTRAINT POI_CSFK FOREIGN KEY (City, State) REFERENCES CITY_STATE(City_Name, State_Name) ON DELETE NO ACTION ON UPDATE NO ACTION);

CREATE TABLE DATA_TYPE
( Type            VARCHAR(60)        PRIMARY KEY);


CREATE TABLE DATA_POINT
( DateTime        DATETIME        NOT NULL,
  POI_LN        VARCHAR(60)    NOT NULL,
  Approved        BOOLEAN        NOT NULL        DEFAULT False,
  D_Type        VARCHAR(60)    NOT NULL,
  D_Value        INT            NOT NULL,
CONSTRAINT DP_PK
PRIMARY KEY (DateTime, POI_LN),
FOREIGN KEY (POI_LN) REFERENCES POI(Location_Name)
ON DELETE CASCADE        ON UPDATE CASCADE,
CONSTRAINT DP_DTFK
FOREIGN KEY (D_Type) REFERENCES DATA_TYPE(Type)
ON DELETE NO ACTION        ON UPDATE NO ACTION);



INSERT INTO USER (Username, Email_Address, Password, User_Type) VALUES ('john', 'john@gatech.edu', '123456', 'city_scientist');
INSERT INTO USER (Username, Email_Address, Password, User_Type) VALUES ('admin', 'admin@admin.edu', 'admin', 'admin');
INSERT INTO USER (Username, Email_Address, Password, User_Type) VALUES ('john', 'john@gatech.edu', '123 456', 'city_scientist');

INSERT INTO CITY_STATE (City_Name, State_Name) VALUES ('Atlanta', 'Georgia');
INSERT INTO CITY_STATE (City_Name, State_Name) VALUES ("Miami", "Florida");
INSERT INTO CITY_STATE (City_Name, State_Name) VALUES ("Orlando", "Florida");
INSERT INTO CITY_STATE (City_Name, State_Name) VALUES ("Springfield", "Illinois");
INSERT INTO CITY_STATE (City_Name, State_Name) VALUES ("Springfield", "Missouri");

INSERT INTO DATA_TYPE (Type) VALUES ('Air Quality');

SELECT * FROM CITY_STATE WHERE City_Name=City;
SELECT DISTINCT City_Name FROM CITY_STATE;

SELECT u.Username, u.Email_Address, o.City, o.State, o.Title
FROM USER u JOIN CITY_OFFICIAL o ON u.Username = o.User WHERE o.Approved IS NULL;

SELECT State_Name FROM CITY_STATE WHERE City_Name='Springfield';

INSERT INTO USER (Username, Email_Address, Password, User_Type) VALUES ('john', 'john@gatech.edu', '123456', 'city_scientist');
INSERT INTO CITY_OFFICIAL(User, Title, Approved, City) VALUES ('john', 'Mayor', 1, 'Atlanta', 'Georgia');

CREATE TABLE USER
( Username VARCHAR(60) PRIMARY KEY,
 Email_Address VARCHAR(60) NOT NULL,
 Password VARCHAR(60) NOT NULL,
 User_Type ENUM('admin', 'city_scientist', 'city_official') NOT NULL,
CONSTRAINT USER_SK UNIQUE (Email_Address) ) ENGINE=INNODB;

CREATE TABLE CITY_STATE
( City_Name VARCHAR(60) NOT NULL,
  State_Name VARCHAR(60) NOT NULL, CONSTRAINT PK PRIMARY KEY (City_Name, State_Name) )ENGINE=INNODB;

CREATE TABLE CITY_OFFICIAL
( User  VARCHAR(60) PRIMARY KEY,
  Title VARCHAR(60) NOT NULL,
  Approved BOOLEAN NOT NULL DEFAULT False,
  City VARCHAR(60) NOT NULL, State VARCHAR(60) NOT NULL,
  FOREIGN KEY (User) REFERENCES USER(Username) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT CO_CSFK FOREIGN KEY (City, State) REFERENCES CITY_STATE(City_Name, State_Name) ON DELETE NO ACTION ON UPDATE NO ACTION)  ENGINE=INNODB;

  CREATE TABLE POI
  ( Location_Name VARCHAR(60) PRIMARY KEY,
    Zip_Code VARCHAR(5) NOT NULL,
    Flagged BOOLEAN NOT NULL DEFAULT False,
    Date_Flagged DATE,
    City VARCHAR(60) NOT NULL,
    State VARCHAR(60) NOT NULL, CONSTRAINT POI_CSFK FOREIGN KEY (City, State) REFERENCES CITY_STATE(City_Name, State_Name) ON DELETE NO ACTION ON UPDATE NO ACTION) ENGINE=INNODB;

    CREATE TABLE DATA_TYPE
    ( Type VARCHAR(60) PRIMARY KEY) ENGINE=INNODB;

    CREATE TABLE DATA_POINT
    ( Date_Time DATETIME NOT NULL,
      POI_LN VARCHAR(60) NOT NULL,
      Approved BOOLEAN,
      D_Type VARCHAR(60) NOT NULL,
      D_Value INT NOT NULL,
    CONSTRAINT DP_PK PRIMARY KEY (Date_Time, POI_LN),
    FOREIGN KEY (POI_LN) REFERENCES POI(Location_Name) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT DP_DTFK FOREIGN KEY (D_Type) REFERENCES DATA_TYPE(Type) ON DELETE NO ACTION ON UPDATE NO ACTION) ENGINE=INNODB;
