# Motivation
Coming into university, we as students are placed in a situation where for the first time in our education journey, we have complete freedom and autonomy over our schedules and academic plans. However, this can mean a lot of uncertainty surrounding how we should manage our time. Without proper time management, one may quickly become overwhelmed with the sheer volume and variety of work that one has to complete week on week. Therefore, it is almost essential for us as university students to make use of productivity applications to establish some routine in our daily lives.

Currently, there are a whole range of productivity applications for students to choose from. However, after our experience in using these applications, we find that it is not sufficient to use a single application, and typically 2 or more applications need to be used in conjunction to effectively meet our needs. A common scenario is having a calendar to plan our schedule across the entire week, as well as using a to-do list to keep track of the tasks we hope to achieve during the individual blocks of time. We give the examples of Google Calendar and Google Keep to highlight the limitations of such a situation.

## Aim
We hope to integrate a web-based calendar and task manager into one single site and make the process of scheduling classes and deadlines (formal and self-set) quick and easy. 


## Tech Stack
Website front-end: React / HTML / CSS

Database: Google Firebase

Deployment platform: Heroku


## User Profile
Target Audience: University students who would like to manage their time better while keeping track of their tasks all on one platform. 

Biggest Problem: People who are constantly stressed because they lose track of what they need to do, or whether they have to finish a certain task at a particular time of day.

Ideal User Profile: University students who are worried that they will forget the multitude of classes and deadlines that they have. They probably like to organise their Events based on their modules and like to see their deadlines in chronological order.

## User Stories
- As a student who is already using many applications to plan my time and manage my assignments, I want to be able to plan my schedule and tasks all in one site, and not have to use multiple applications to meet all my scheduling needs.

- As a student who likes to set detailed and specific goals that I want to accomplish every day, I want to be able to link my tasks to topics that I am studying.

- As a student who hopes to track the progress that I have made for all of my modules on a weekly basis, I want a neat record of the tasks that I have accomplished and have yet to complete during the week, categorized based on which modules they are linked to.

- As a student who has questions and doubts after my revision, I want to create follow-up tasks to remind myself to address these queries in the near future in order to count as progress for my module.

## Scope of Project
The Scheduler page has a default weekly view and students can click anywhere on the calendar to create an Event. An Event can be linked to a certain Module, which allows it to be colour-coded accordingly. Under each Event, Tasks can also be added to it. 

The Tasks page will give an overview of all the Tasks set by the student. Here, students can also create smaller, individual tasks, e.g. finish 1 reading, complete Tutorial 3. 


## What’s Different about CalPal?
- Google Calendar & Apple Calendar - While events can be added directly from the calendar, these applications lack proper task management features. For example, tasks cannot be added under events, and be associated with that particular module. Only mere descriptions of the event can be added. 

- Google Keep - As a task manager, Keep lacks several features like prioritizing tasks and associating tasks with a particular module. CalPal will include such features. 

- My Study Life - As a scheduling software, this application lacks the ability to add events directly from the calendar. On the other hand, there is a separate page to add events. However, this is not seamless enough for our users. 
