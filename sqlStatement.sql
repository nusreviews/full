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
                    comments varchar(20000),
                    dateCreated timestamp default current_timestamp, 
                    dateUpdated timestamp default now() on update now(),
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

insert into module(modId, name, description) values ("CS1010", "Programming Methodology", "0.");
insert into module(modId, name, description) values ("CS1020", "Data Structures and Algorithms I", " 1");
insert into module(modId, name, description) values ("CS2020", "Data Structures and Algorithms II", " 2");
insert into module(modId, name, description) values ("CS3020", "Data Structures and Algorithms III", " 3");
insert into module(modId, name, description) values ("CS3030", "Data Structures and Algorithms 4", " 4");
insert into module(modId, name, description) values ("CS3040", "Data Structures and Algorithms 5", " 5");
insert into module(modId, name, description) values ("CS3050", "Data Structures and Algorithms 6", " 6");
insert into module(modId, name, description) values ("CS3060", "Data Structures and Algorithms 7", " 7");
insert into module(modId, name, description) values ("CS3070", "Data Structures and Algorithms 8", " 8");
insert into module(modId, name, description) values ("CS3080", "Data Structures and Algorithms 9", " 9");
insert into module(modId, name, description) values ("CS3090", "Data Structures and Algorithms 10", " 10");
insert into module(modId, name, description) values ("CS4000", "Data Structures and Algorithms 11", " 11");
insert into module(modId, name, description) values ("CS4010", "Data Structures and Algorithms 12", " 12");
insert into module(modId, name, description) values ("CS4020", "Data Structures and Algorithms 13", " 13");
insert into module(modId, name, description) values ("CS4030", "Data Structures and Algorithms 14", " 14");
insert into module(modId, name, description) values ("CS4040", "Data Structures and Algorithms 15", " 15");
insert into module(modId, name, description) values ("CS4050", "Data Structures and Algorithms 16", " 16");
insert into module(modId, name, description) values ("CS4060", "Data Structures and Algorithms 17", " 17");
insert into module(modId, name, description) values ("CS4070", "Data Structures and Algorithms 18", " 18");
insert into module(modId, name, description) values ("CS4080", "Data Structures and Algorithms 19", " 19");
insert into module(modId, name, description) values ("CS4090", "Data Structures and Algorithms 20", " 20");
insert into module(modId, name, description) values ("CS4100", "Data Structures and Algorithms 21", " 21");
insert into module(modId, name, description) values ("CS4110", "Data Structures and Algorithms 22", " 22");
insert into module(modId, name, description) values ("CS4120", "Data Structures and Algorithms 23", " 23");

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

insert into liked(reviewId, userId) values(1, 1);
insert into liked(reviewId, userId) values(1, 2);
insert into liked(reviewId, userId) values(1, 3);

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
SELECT * FROM review where modId = "CS1010" group by modId ORDER BY dateUpdated DESC ;
SELECT modId, date(dateUpdated) as test FROM review  group by modId ORDER BY dateUpdated DESC ;

# percentage
SELECT floor(count(*)/(SELECT count(*) FROM review where modId = "CS1010") * 100) AS percent FROM review where modId = "CS1010" and recommend = true; 


select numRecommend.modId, floor((numRecommend/totalReview)*100) as percentage
from 
(select modId, count(*) as numRecommend from review where recommend = true group by modId) as numRecommend, 
(select modId, count(*) as totalReview from review group by modId) as numReview
where numRecommend.modId = numReview.modId;

# avg rating
select teachingTable.modId,
        totalTeaching/totalReview as avgTeaching,
        totalDifficulty/totalReview as avgDifficulty,
        totalEnjoyability/totalReview as avgEnjoyability,
        totalWorkload/totalReview as avgWorkload
from 
(select modId, sum(teaching) as totalTeaching, sum(difficulty) as totalDifficulty, sum(enjoyability) as totalEnjoyability, sum(workload) as totalWorkLoad from review group by modId) as teachingTable,
(select modId, count(*) as totalReview from review group by modId) as numReview
where numReview.modId = teachingTable.modId;



select modId, sum(teaching) as totalTeaching from review group by modId;

# review card of a user
select * from review, user where user.userId = 2 and review.reviewBy = user.userId;

# review card of a module
select * from review where modId = "cs4100";

# add review
select * from module where modId = "cs1010";

# get list of prof
select * from professor;
select * from professor where profId = 1;


# number of likes of a review
select count(*) as amount from user, review, liked where user.userId = liked.userId and review.reviewId = liked.reviewId and liked.reviewId = 1;
