INSERT INTO USER (Username, Email_Address, Password, User_Type) VALUES ("john", "john@gatech.edu", "123 456", "city_scientist");
INSERT INTO USER (Username, Email_Address, Password, User_Type) VALUES ('john', 'john@gatech.edu', '123 456', 'city_scientist');

INSERT INTO CITY_STATE (City_Name, State_Name) VALUES ("Atlanta", "Georgia");
INSERT INTO CITY_STATE (City_Name, State_Name) VALUES ("Miami", "Florida");
INSERT INTO CITY_STATE (City_Name, State_Name) VALUES ("Orlando", "Florida");
INSERT INTO CITY_STATE (City_Name, State_Name) VALUES ("Springfield", "Illinois");
INSERT INTO CITY_STATE (City_Name, State_Name) VALUES ("Springfield", "Missouri");


SELECT * FROM CITY_STATE WHERE City_Name=City;
SELECT DISTINCT City_Name FROM CITY_STATE;

SELECT State_Name FROM CITY_STATE WHERE City_Name='Springfield';
