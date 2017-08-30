drop database nusreviews;
create database nusreviews;
use nusreviews;

CREATE TABLE module(modId varchar(6) NOT NULL, name varchar(255), description varchar(20000), PRIMARY KEY(modId));

create table user(userId int not null AUTO_INCREMENT, lastName varchar(255), firstName varchar(255), primary key(userId));

create table professor(profId int not null AUTO_INCREMENT, lastName varchar(255),  firstName varchar(255), primary key(profId));

create table review(reviewId int not null AUTO_INCREMENT, 
                    modId varchar(6), 
                    reviewBy int not null, 
                    taughtBy int not null, 
                    teaching int, 
                    difficulty int, 
                    enjoyability int, 
                    workload int, 
                    recommend boolean,
                    likes int default 0,
                    comments varchar(20000),
                    reviewDate timestamp default current_timestamp, 
                    primary key(reviewId), 
                    foreign key(modId) references module(modId), 
                    foreign key(reviewBy) references user(userId), 
                    foreign key(taughtBy) references professor(profId));

create table liked(reviewId int not null,
                    userId int not null,
                    primary key(reviewId, userId),
                    foreign key(userId) references user(userId),
                    foreign key(reviewId) references review(reviewId));

CREATE TRIGGER Ucase_insert_module BEFORE INSERT ON module FOR EACH ROW
SET NEW.modId = UPPER(NEW.modId);

CREATE TRIGGER Ucase_update_module BEFORE UPDATE ON module FOR EACH ROW
SET NEW.modId = UPPER(NEW.modId);

CREATE TRIGGER Ucase_insert_review BEFORE INSERT ON review FOR EACH ROW
SET NEW.modId = UPPER(NEW.modId);

CREATE TRIGGER Ucase_update_review BEFORE UPDATE ON review FOR EACH ROW
SET NEW.modId = UPPER(NEW.modId);

insert into module(modId, name, description) values ("CS1010", "Programming Methodology", "This module introduces the fundamental concepts of problem solving by computing and programming using an imperative programming language. It is the first and foremost introductory course to computing. It is also the first part of a three-part series on introductory programming and problem solving by computing, which also includes CS1020 and CS2010. Topics covered include problem solving by computing, writing pseudo-codes, basic problem formulation and problem solving, program development, coding, testing and debugging, fundamental programming constructs (variables, types, expressions, assignments, functions, control structures, etc.), fundamental data structures: arrays, strings and structures, simple file processing, and basic recursion. This module is appropriate for SoC students.");
insert into module(modId, name, description) values ("CS1020", "Data Structures and Algorithms I", "After CS1010");
insert into module(modId, name, description) values ("CS2020", "Data Structures and Algorithms II", "After CS1020");
insert into module(modId, name, description) values ("CS3020", "Data Structures and Algorithms III", "After CS1020");
insert into module(modId, name, description) values ("CS3030", "Data Structures and Algorithms 4", "After CS1020");
insert into module(modId, name, description) values ("CS3040", "Data Structures and Algorithms 5", "After CS1020");
insert into module(modId, name, description) values ("CS3050", "Data Structures and Algorithms 6", "After CS1020");
insert into module(modId, name, description) values ("CS3060", "Data Structures and Algorithms 7", "After CS1020");
insert into module(modId, name, description) values ("CS3070", "Data Structures and Algorithms 8", "After CS1020");
insert into module(modId, name, description) values ("CS3080", "Data Structures and Algorithms 9", "After CS1020");
insert into module(modId, name, description) values ("CS3090", "Data Structures and Algorithms 10", "After CS1020");
insert into module(modId, name, description) values ("CS4000", "Data Structures and Algorithms 11", "After CS1020");
insert into module(modId, name, description) values ("CS4010", "Data Structures and Algorithms 12", "After CS1020");
insert into module(modId, name, description) values ("CS4020", "Data Structures and Algorithms 13", "After CS1020");
insert into module(modId, name, description) values ("CS4030", "Data Structures and Algorithms 14", "After CS1020");
insert into module(modId, name, description) values ("CS4040", "Data Structures and Algorithms 15", "After CS1020");
insert into module(modId, name, description) values ("CS4050", "Data Structures and Algorithms 16", "After CS1020");
insert into module(modId, name, description) values ("CS4060", "Data Structures and Algorithms 17", "After CS1020");
insert into module(modId, name, description) values ("CS4070", "Data Structures and Algorithms 18", "After CS1020");
insert into module(modId, name, description) values ("CS4080", "Data Structures and Algorithms 19", "After CS1020");
insert into module(modId, name, description) values ("CS4090", "Data Structures and Algorithms 20", "After CS1020");
insert into module(modId, name, description) values ("CS4100", "Data Structures and Algorithms 21", "After CS1020");
insert into module(modId, name, description) values ("CS4110", "Data Structures and Algorithms 22", "After CS1020");
insert into module(modId, name, description) values ("CS4120", "Data Structures and Algorithms 23", "After CS1020");

insert into user(firstName, lastName) values ("Ta Eu", "Lim");
insert into user(firstName, lastName) values ("Benedict", "Chua");
insert into user(firstName, lastName) values ("Baron", "Lim");
insert into user(firstName, lastName) values ("Jane", "See");
insert into user(firstName, lastName) values ("Sam", "See");
insert into user(firstName, lastName) values ("Curtis", "See");

insert into professor(lastName, firstName) values ("Steven", "Halim");
insert into professor(lastName, firstName) values ("Anand", "Bhojan");
insert into professor(lastName, firstName) values ("Janice", "Lee");
insert into professor(lastName, firstName) values ("Leong", "Wai Kay");
insert into professor(lastName, firstName) values ("Low", "Kok Lim");

insert into review (modId, reviewBy, taughtBy, teaching, difficulty, enjoyability, workload, recommend, comments) 
            values ("CS1010", 2, 1, 5, 4, 3, 2, true, "hi");

insert into review (modId, reviewBy, taughtBy, teaching, difficulty, enjoyability, workload, recommend, comments) 
            values ("CS1010", 3, 1, 2, 2, 2, 2, true, "hi 2");

insert into review (modId, reviewBy, taughtBy, teaching, difficulty, enjoyability, workload, recommend, comments) 
            values ("CS1010", 3, 1, 1, 1, 1, 1, false, "hi 3");

insert into review (modId, reviewBy, taughtBy, teaching, difficulty, enjoyability, workload, recommend, comments) 
            values ("CS1020", 2, 2, 5, 4, 3, 2, false, "hi");

insert into review (modId, reviewBy, taughtBy, teaching, difficulty, enjoyability, workload, recommend, comments) 
            values ("CS1020", 3, 2, 2, 2, 2, 2, false, "hi 2");

insert into review (modId, reviewBy, taughtBy, teaching, difficulty, enjoyability, workload, recommend, comments) 
            values ("CS1020", 3, 2, 1, 1, 1, 1, true, "hi 3");

insert into review (modId, reviewBy, taughtBy, teaching, difficulty, enjoyability, workload, recommend, comments) 
            values ("CS2020", 2, 3, 5, 4, 3, 2, true, "hi");

insert into review (modId, reviewBy, taughtBy, teaching, difficulty, enjoyability, workload, recommend, comments) 
            values ("CS2020", 3, 3, 2, 2, 2, 2, true, "hi 2");

insert into review (modId, reviewBy, taughtBy, teaching, difficulty, enjoyability, workload, recommend, comments) 
            values ("CS2020", 3, 3, 1, 1, 1, 1, true, "hi 3");

insert into review (modId, reviewBy, taughtBy, teaching, difficulty, enjoyability, workload, recommend, comments) 
            values ("cs4100", 3, 3, 1, 1, 1, 1, true, "hi 3");

# list of modules
select modId, name from module;

# get review date
SELECT * FROM review where modId = "CS1010" group by modId ORDER BY reviewDate DESC ;

# percentage
SELECT floor(count(*)/(SELECT count(*) FROM review where modId = "CS1010") * 100) AS percent FROM review where modId = "CS1010" and recommend = true; 

# review card of a user
select * from review, user where user.userId = 2 and review.reviewBy = user.userId;

# review card of a module
select * from review where modId = "cs4100";

# add review
select * from module where modId = "cs1010";

# like a review
update review set likes = likes + 1 where reviewId = 1;

# get list of prof
select * from professor;
select * from professor where profId = 1;

insert into liked(reviewId, userId) values(1, 1);
insert into liked(reviewId, userId) values(1, 2);
insert into liked(reviewId, userId) values(1, 3);

# number of likes of a review
select count(*) as amount from user, review, liked where user.userId = liked.userId and review.reviewId = liked.reviewId and liked.reviewId = 1;