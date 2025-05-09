# Rivals Tracker
Track your Marvel Rivals stats or anyone you want with their username! This project aims to develop a website that collects, processes, and visualizes player data from a video game. The system will leverage Object-Oriented Programming (OOP) principles to ensure modularity, reusability, and maintainability. The program will support user authentication (if needed), data retrieval from APIs or databases, data processing, and interactive visual representation of player statistics. The goal is to provide an intuitive and insightful way to analyze player performance, trends, and achievements.

## Team Members
Benjamin Nguyen, Kenneth Chau, Alexander Leang

## Techstack

**Client:** React, Vite

**Frontend:** ChakraUI

**Backend:** Java, Maven, Spring Boot, PostgreSQL

**API:** [MarvelRivalsAPI](https://marvelrivalsapi.com/)

## How to Use:

1. Clone the repository:
```
git clone https://github.com/contactkc/rivals-tracker.git
```
2. Navigate to the project directory:
```
cd rivals-tracker
```
3. Install npm dependencies
```
npm install
```
4. Make your environmental file (.env)
```
Add your key inside the env in this format:
VITE_MARVEL_RIVALS_API_KEY=YOUR_API_KEY
```

## Features Implemented
- Minimalistic Front End website
- Check out all available heroes with their roles and level of difficulty
- Check out all the maps the game has to offer, as well as video links to them
- Want to know whats new in the latest update? Check out the Patches page

## Future Work
- Finish user authentication implementation so login/signup page works
- Finish player search so users can search up any player's stats with a username
- Move API hooks from front end to proxy calls in back end?
- Make a player stats page for API to populate which the home page will redirect users after entering username

## Known Issues
- Player API fetch isn't working
- No sign up or login working
