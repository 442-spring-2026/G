# G — MedCabinet

## Members and Roles

* Dia Dora — Product Manager
* David Yang — Developer
* Anmol Gill — Developer
* Elham Abdo — Product Designer
* Dylan Song — Developer

## Problem Area

Health and Well-being

## Mission Statement

Our mission is to help users manage their medications safely and consistently. MedCabinet lets users add, track, and edit their prescriptions in one place — with scheduled reminders to reduce missed doses and keep their health on track.

## Features

| Feature | Description |
|---|---|
| **Login** | Secure authentication via Firebase |
| **Home** | Overview of all app features |
| **Add Medicine** | Add a new medication with name, dosage, reminder time, and notes |
| **Saved Cabinet** | View all saved medications; receive and respond to timed reminders |
| **Manage Medication** | Edit or delete an existing medication |
| **Reminder History** | Track whether past doses were taken or missed |

## Routes

| Path | Page |
|---|---|
| `/login` | Login |
| `/home` | Home |
| `/dashboard` | Saved Cabinet |
| `/addmedicinepage` | Add Medicine |
| `/manage/:id` | Manage Medication |

## Tech Stack

- **Frontend:** React + Vite
- **Backend / Database:** Firebase (Firestore + Authentication)
- **Hosting:** Firebase Hosting

## Skills and Competencies

**Everyone**
- Open communication
- Staying on top of deadlines
- Teamwork and understanding

**Developer**
- Writing clean code and comments
- Test your code
- Collaborate with other developers

**Product Designer**
- Using feedback to make designs more user-friendly
- Ensuring user accessibility
- Open to iterations

**Project Manager**
- Be organized
- Having reasonable deadlines and timelines
- Effectively communicate on specific goals

## Local Setup

1. Install dependencies:
   ```bash
   npm install

## Quality

Accessibility
- We built pages so they are easy to navigate for everyone, including users who rely on screen readers.
- First, for proper HTML tags on the Cabinet Dashboard, I wrapped my medication cards in native button tags instead of generic div tags. This tells screen readers that the cards are clickable items you can interact with.
- Second, for descriptive screen reader text, I added custom aria-label tags to each card loop. Instead of just reading out a name, a screen reader will read a full, clear sentence.
- Third, for hiding visual clutter, I added aria-hidden="true" to layout icons like the clock and note icons so screen readers skip the decorative shapes and stick only to reading the important medication details.


