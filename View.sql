CREATE DATABASE if not exists webSiteSchool;
USE webSiteSchool;

DROP TABLE if exists student;
DROP TABLE if exists class;
DROP TABLE if exists worker;
DROP TABLE if exists login;
DROP TABLE is exists grade;

CREATE TABLE login(
    login_id int AUTO_INCREMENT PRIMARY KEY,
    login_user_name varchar(100),
    login_password varchar(100),
    login_level varchar(100)
);

CREATE TABLE worker (
    worker_id int AUTO_INCREMENT PRIMARY KEY,
    worker_fonction varchar(100) NOT NULL,
    worker_firstname varchar(100) NOT NULL,
    worker_lastname varchar(100) NOT NULL,
    worker_phone varchar(10),
    worker_mail varchar(100),
    worker_login int,
    CONSTRAINT fk_worker_login FOREIGN KEY (worker_login) REFERENCES login(login_id)
);

CREATE TABLE class (
    class_id int AUTO_INCREMENT PRIMARY KEY,
    class_name int NOT NULL,
    class_level varchar(3) NOT NULL,
    class_number_student int NOT NULL,
    class_worker int,
    CONSTRAINT fk_class_worker FOREIGN KEY (class_worker) REFERENCES worker(worker_id)
);

CREATE TABLE student (
    student_id int AUTO_INCREMENT PRIMARY KEY,
    student_first_name varchar(100) NOT NULL,
    student_last_name varchar(100) NOT NULL,
    student_class int,
    student_phone varchar (10),
    student_average int NOT NULL,
    student_login int,
    CONSTRAINT fk_student_login FOREIGN KEY (student_login) REFERENCES login(login_id),
    CONSTRAINT fk_student_class FOREIGN KEY (student_class) REFERENCES class(class_id)
);

CREATE TABLE grade(
    grade_id int AUTO_INCREMENT PRIMARY KEY,
    grade_student int NOT NULL,
    grade_math int,
    grade_french int,
    grade_history int, 
    average int DEFAULT ((grade_math+grade_history+grade_french))/3   
    CONSTRAINT fk_grade_student FOREIGN KEY (grade_student) REFERENCES student(student_id)
);

INSERT INTO login VALUES 
    (1,'lpetit', '1234', 'user'),
    (2,'trobert','0000','user'),
    (3,'frichard','Labellefrance','user'),
    (4,'mdurand','Cbolafolie','user'),
    (5,'ndubois','trois','user'),
    (6,'lmoro','bonjour*10','user'),
    (7,'olaurenta','rqzwgè','user'),
    (8,'jleroy','jkhgdn','user'),
    (9,'aroux','ghk;;h','user'),
    (10,'amourel','gyuguyjh','user')
    (11,'pletessier','dfghgf','admin'),
    (12,'mpharmacy','rtyuiol','admin'),
    (13,'fcrochet','tyuik;','admin'),
    (14,'gdelangle','refgb','admin'),
    (15,'mpottier','rtyuj','admin'),
    (16,'palain','ikedf','admin'),
    (17,'mlebourder','ujrfv','admin');

INSERT INTO worker VALUES 
	(1,'teacher','Patrick','Letessier','0766006662','patrickletessier@gmail.com',11),
	(2,'teacher','Michel','Pharmacy','0784087217','michelp@gmail.com',12),
	(3,'teacher','Francine','Crochet','0243741313','fcrochet@gmail.com',13),
	(4,'teacher','Gilbert','Delangle','0631243611','gdelange@gmail.com',14),
	(5,'teacher','Marcel','Pottier','0687836038','mpottier@gmail.com',15),
	(6,'teacher','Philippe','Alain','07071228143','palain@gmail.com',16),
	(7,'director','Marouin','Lebourder','0624242424','mlebourder@gmail',17);

INSERT INTO class VALUES
	(1,1,'CP',1,1),
	(2,1,'CE1',2,2),
	(3,2,'CE1',1,3),
	(4,3,'CE1',1,4),
	(5,1,'CE2',1,5),
	(6,1,'CM1',1,6),
	(7,1,'CM2',3,7);

INSERT INTO student VALUES
	(1,'Lucas','Petit',1,'0655778833',12,1),
	(2,'Theo','Robert',2,'0623423565',13,2),
	(3,'Florian','Richard',2,'0654345678',12,3),
	(4,'Malo','Durand',3,'0743657687',11,4),
	(5,'Nathan','Dubois',4,'0619384720',20,5),
	(6,'Laura','Moro',5,'0748596710',17,6),
	(7,'Orlane','Laurenta',6,'0758472043',14,7),
	(8,'Juliette','Leroy',7,'0628461740',18,8),
	(9,'Angelique','Roux',7,'0643215467',6,9),
	(10,'Antoine','Mourel',7,'0657482905',4,10);

INSERT INTO grade VALUES 
	(1,1,13,14,12),
	(2,2,11,13,15),
	(3,3,12,12,12),
	(4,4,10,11,12),
	(5,5,20,20,20),
	(6,6,17,14,20),
	(7,7,14,14,14),
	(8,8,18,19,17),
	(9,9,10,6,2),
	(10,10,4,2,6);





CREATE VIEW Cp
    AS SELECT student_first_name, student_last_name, grade.grade_math, grade.grade_french, grade.grade_history, grade.average 
    FROM student 
    INNER JOIN grade ON student_id = grade_student 
    WHERE student_class = 1
    ORDER BY grade.average DESC;

CREATE VIEW CE11
    AS SELECT student_first_name, student_last_name, grade.grade_math, grade.grade_french, grade.grade_history, grade.average 
    FROM student 
    INNER JOIN grade ON student_id = grade_student 
    WHERE student_class = 2
    ORDER BY grade.average DESC;
    
CREATE VIEW CE12 
    AS SELECT student_first_name, student_last_name, grade.grade_math, grade.grade_french, grade.grade_history, grade.average 
    FROM student 
    INNER JOIN grade ON student_id = grade_student 
    WHERE student_class = 3
    ORDER BY grade.average DESC;
    
CREATE VIEW CE13 
    AS SELECT student_first_name, student_last_name, grade.grade_math, grade.grade_french, grade.grade_history, grade.average 
    FROM student 
    INNER JOIN grade ON student_id = grade_student 
    WHERE student_class = 4
    ORDER BY grade.average DESC;
    
CREATE VIEW CE2 
    AS SELECT student_first_name, student_last_name, grade.grade_math, grade.grade_french, grade.grade_history, grade.average 
    FROM student 
    INNER JOIN grade ON student_id = grade_student 
    WHERE student_class = 5
    ORDER BY grade.average DESC;
    
CREATE VIEW cm1
    AS SELECT student_first_name, student_last_name, grade.grade_math, grade.grade_french, grade.grade_history,grade.average 
    FROM student 
    INNER JOIN grade ON student_id = grade_student 
    WHERE student_class = 6
    ORDER BY grade.average DESC;

CREATE VIEW cm2
    AS SELECT student_first_name, student_last_name, grade.grade_math, grade.grade_french, grade.grade_history,grade.average 
    FROM student 
    INNER JOIN grade ON student_id = grade_student 
    WHERE student_class = 7
    ORDER BY grade.average DESC;
