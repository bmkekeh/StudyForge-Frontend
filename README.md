# StudyForge Frontend

StudyForge is a study application that helps students turn their own course materials into personalized study resources.

I built StudyForge to combine course materials, summaries, quizzes, flashcards, and study progress inside one course-based workspace.

This repository contains the **React + TypeScript frontend**.

## Features

The frontend currently supports:

* Creating and viewing courses
* Uploading course materials
* Viewing uploaded materials
* Generating study summaries
* Viewing saved summaries
* Generating flashcards
* Reviewing generated flashcards
* Generating quizzes
* Choosing quiz difficulty and question count
* Answering quizzes interactively
* Receiving answer explanations
* Viewing quiz results
* Saving and reopening generated quizzes
* Viewing previous quiz attempts
* Tracking quiz performance over time
* Viewing weak topics based on previous mistakes
* Generating targeted practice quizzes for weak topics

## Study Workflow

The main StudyForge workflow is:

```text
Create Course
     ↓
Upload Course Materials
     ↓
Generate Study Resources
     ↓
Summaries / Flashcards / Quizzes
     ↓
Complete Quizzes
     ↓
View Progress
     ↓
Identify Weak Topics
     ↓
Generate Targeted Practice
```

## Progress Analytics

StudyForge includes a dedicated **Progress** section for each course.

It displays:

* Quizzes completed
* Average quiz score
* Best quiz score
* Latest quiz score
* Performance history
* Recent quiz attempts
* Weak topics

Quiz performance is displayed over time so students can see how their results change across attempts.

## Weak Topic Practice

Incorrect quiz answers are associated with the topic of the question.

StudyForge uses this information to identify topics that appear repeatedly in a student's mistakes.

From the Progress section, the student can generate a new quiz focused specifically on those weak topics.

The targeted quiz behaves like a normal StudyForge quiz and is also saved so its result can contribute to future progress tracking.

## Tech Stack

* React
* TypeScript
* Vite
* React Router
* CSS
* Fetch API

The frontend communicates with the StudyForge Spring Boot backend through REST API calls.

## Component Structure

The frontend is split into smaller feature-based components rather than keeping the entire application inside large page components.

For example, the quiz interface includes:

```text
QuizTab
├── QuizGenerator
├── ActiveQuiz
├── QuizResults
├── SavedQuizzes
└── AttemptHistory
```

Course functionality is organized into tabs for:

```text
Course
├── Overview
├── Materials
├── Summary
├── Quizzes
├── Flashcards
└── Progress
```

This keeps individual features easier to maintain as the project grows.

## Running the Frontend

### Requirements

Make sure you have Node.js and npm installed.

The StudyForge backend must also be running for API-dependent features to work.

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

Vite will display the development URL in the terminal.

By default, the frontend communicates with the backend running at:

```text
http://localhost:8080
```

## Production Build

Create a production build with:

```bash
npm run build
```

## Linting

Run the frontend linter with:

```bash
npm run lint
```

## Backend

The Spring Boot + PostgreSQL backend is available here:

https://github.com/bmkekeh/StudyForge

The backend handles:

* Course and material storage
* Study-content generation
* Generated quizzes and flashcards
* Quiz attempt persistence
* Mistake tracking
* Progress statistics
* Weak-topic analysis
* Targeted quiz generation

## Project Status

The core StudyForge experience is functional.

Students can create courses, upload their own materials, generate study resources, complete quizzes, review their performance, identify weak areas, and generate additional practice based on those weaknesses.

I am continuing to improve the project, particularly its user experience and overall production readiness.
