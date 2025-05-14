# Rivals Tracker
Track your Marvel Rivals stats or anyone you want with their username! This project aims to develop a website that collects, processes, and visualizes player data from a video game. The system will leverage Object-Oriented Programming (OOP) principles to ensure modularity, reusability, and maintainability. The program will support user authentication (if needed), data retrieval from APIs or databases, data processing, and interactive visual representation of player statistics. The goal is to provide an intuitive and insightful way to analyze player performance, trends, and achievements.

### [Demo](https://www.youtube.com/watch?v=Kz-kSrTUs_A)

## Team Members & Roles

- Benjamin Nguyen
  - Backend: User/Auth OOP, Database, API

- Kenneth Chau
  - Frontend: UI, Components, Hooks
  - Backend: CORS, API, Database, User Auth
  
- Alexander Leang
  - Backend: UI/UX, Database, API

## Techstack

**Client:** React, Vite

**Frontend:** ChakraUI

**Backend:** Java, Maven, Spring Boot, PostgreSQL

**API:** [MarvelRivalsAPI](https://marvelrivalsapi.com/)

## How to Use (Local Deploy):

### Prerequisites:

- Java 21 / 23. Java version can be changed under `backend/pom.xml`.
- A PostgreSQL server. Installation and instructions for [Windows][1], [Mac][2], or [Linux][3]

[1]: https://www.w3schools.com/postgresql/postgresql_install.php
[2]: https://postgresapp.com/
[3]: https://www.postgresql.org/download/linux/

1. Clone the repository:
```sh
git clone https://github.com/contactkc/rivals-tracker.git
```
2. Navigate to the project directory:
```sh
cd rivals-tracker
```
3. Install npm dependencies
```sh
npm install
```
4. Create environment files (.env)
```sh
cp .env.example .env;  \
cp backend/.env.example backend/.env;  \
cp backend/src/main/resources/application.properties.example backend/src/main/resources/application.properties
```

Add your API key inside the newly created files. For `application.properties`, paste the key in the `jwt.secret=` property.

5. Create a PostgreSQL user `postgres` with the password `passwordhere` (can be modified in `application.properties`)

	Then, create a new database:
```sql
postgres=# CREATE DATABASE marvelrivalsdb OWNER postgres;
```

6. Run:
```sh
npm run dev
```

and run `backend/src/main/BackendApplication.java` in an IDE or Spring Boot application.

Default address for the app is `http://localhost:5173/`.

## Features Implemented
- Minimalistic Front End website
- Check out all available heroes with their roles and level of difficulty
- Check out all the maps the game has to offer, as well as video links to them
- Want to know whats new in the latest update? Check out the Patches page
- User authentication implementation so login/signup page works with protected profile page
- BCrypt encrypted passwords
- Player search so users can search up any player's stats with a username
- Graphs to showcase user a visually represented data

## Future Work

## Known Issues
