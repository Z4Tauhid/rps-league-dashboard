RPS League Dashboard:

A full-stack Rock-Paper-Scissors League Dashboard that displays match history, live match updates, and analytics such as filtered results and leaderboard insights.

This project demonstrates modern backend architecture, secure API handling, and a responsive React dashboard UI.

Features:

 A. View Latest Match Results

Displays the most recent Rock-Paper-Scissors matches with:

Player names

Moves played

Winner

Match date

B. Filter Matches by Date

Users can select a date using a calendar picker to view matches played on that specific day.

C. Live Match Updates (SSE)

The application supports Server-Sent Events (SSE) to stream live match results in real time.

D.  Clean UI Dashboard

Responsive UI built with React + TailwindCSS featuring:

Battle arena themed interface

Icon-based move indicators

Animated winner indicator

Mobile responsive table

Architecture:

The backend follows a layered architecture:

Client (React)
       │
       ▼
Routes
       │
       ▼
Controllers
       │
       ▼
Services
       │
       ▼
External RPS API

Tech Stack:
Frontend:-

React

TypeScript

TailwindCSS

Axios

Lucide Icons

Backend:-

Node.js

Express

TypeScript

Axios

Communication

REST API

Server-Sent Events (SSE)

Key Concepts Demonstrated:

REST API design

Secure API communication

Layered backend architecture

Server-Sent Events (real-time updates)

React state management

Data filtering and transformation

Responsive UI design

**Future Improvements:

Player leaderboard Analytics

Historical analytics

Player search Along with Date

Match statistics

Pagination for large datasets

WebSocket support for live updates

**Author
Developed as part of a technical assignment demonstrating full-stack development skills.

