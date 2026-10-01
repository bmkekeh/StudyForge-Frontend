# StudyForge Frontend

This is the frontend for **StudyForge**, a study application I am building to help students turn their course materials into useful study tools.

I started this project because I wanted to build something that combined a normal course workspace with AI-powered study features. Instead of having notes, quizzes, flashcards, and study material in different places, StudyForge puts them together inside each course.

This repository contains the **React + TypeScript frontend**.

## Current Features

The frontend currently supports:

* Creating and viewing courses
* Uploading course materials
* Viewing uploaded materials
* Generating study summaries
* Viewing saved summaries
* Generating quizzes
* Choosing quiz difficulty and number of questions
* Answering quizzes interactively
* Getting feedback and explanations for answers
* Viewing quiz results
* Saving and reopening generated quizzes
* Tracking previous quiz attempts and scores
* Generating and reviewing flashcards

## Tech Stack

The frontend currently uses:

* React
* TypeScript
* Vite
* React Router
* CSS
* Fetch API

The application communicates with a Spring Boot backend through REST API calls.

## Project Structure

I have been splitting the frontend into smaller components as the project grows instead of keeping everything inside one large page.

For example, the quiz feature is separated into components for:

```text
QuizTab
├── QuizGenerator
├── ActiveQuiz
├── QuizResults
├── SavedQuizzes
└── AttemptHistory
```

This makes the project easier for me to maintain and makes it easier to add features without turning individual files into extremely large components.

## Running the Frontend

Install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Vite will display the local development URL in the terminal.

The StudyForge backend also needs to be running for features such as courses, uploads, quizzes, summaries, and flashcards to work.

## Backend

The Spring Boot backend for this project is available here:

https://github.com/bmkekeh/StudyForge

The backend handles the database, REST API, course materials, generated study content, and quiz attempt history.

## Current Status

StudyForge is still under development.

I am currently focused on getting the main functionality working first and then improving the UI and adding more useful study features.

So far, the main workflow is:

```text
Create a course
      ↓
Upload course material
      ↓
Generate study resources
      ↓
Study with summaries, quizzes and flashcards
      ↓
Track quiz performance
```

There is still more I want to add, but the core study workflow is working.

## Backend

The backend for StudyForge is available here:

[StudyForge Backend](https://github.com/bmkekeh/StudyForge)

It is built with Spring Boot and PostgreSQL and handles the REST API, database storage, course materials, generated study content, and quiz attempt history.