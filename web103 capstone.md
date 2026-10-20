
## Unit 5: Milestone 1

### Project Overview

In this project, you will work with a group to create a fullstack web app on any topic of your choice. The world is your mollusk! While we do provide a project exemplar to give you a sense of the kinds of features you can create, you are free to design your own app for a use case you and your group are interested in. The only restriction on your app is that you must include the required features described in the section below. Here's an overview:

- Implement **all** baseline features
- Implement **two** custom features
- Implement **zero or more** stretch features

🔗 [View an exemplar project - GOATPath](https://goatpath-exemplar.onrender.com/)

GOATPath is a web app designed to help aspiring UX designers chart a path into the field. The app includes a list of tasks sorted into milestones, which come pre-loaded when the user creates a profile. The user can add, edit, and delete tasks. They can also spend their hard-earned $$$ on trophies in the trophy shop! Users can view their trophies in their trophy case on their profile page.

👀 Read the feature list carefully, as **you and your group must complete 2 custom features** in addition to the baseline features.

### 🎯 Goals

By the end of this assignment you will be able to...

- [ ] 
    
    Plan, develop, and deploy a full-stack web application
    
- [ ] 
    
    Collaborate on project development with a team
    

This project is divided into **five milestones**, culminating in **Demo Day** where you will show off your hard work. In each unit, you will complete a checklist of tasks for the corresponding milestone by the due date. All milestone tasks and planning documents are included in the final project repository that you will fork during this unit.

|Milestone|Description|
|---|---|
|1|Develop the concept for your app, write user stories, create a feature list, and set up a shared GitHub repo|
|2|Create wireframes for at least three of your app's pages, construct an entity relationship diagram, and prepare to pitch your idea|
|3|Pitch your idea, set up your GitHub repo with issues for your features, and begin development|
|4|Continue development by completing issues in GitHub, fix bugs, etc.|
|Final|Continue development by completing issues in GitHub, deploy web app to Render, prepare for Demo Day|
|Demo Day|Show off your final app!|

### ✅ Baseline Features **(MUST complete ALL)**

Complete **all** of the baseline features. These features use the core skills developed in this course, including designing a database schema, creating a server, and connecting a frontend to the server.

- [ ] 
    
    The project includes an Express backend app and a React frontend app
    
- [ ] 
    
    The project includes dynamic routes for both frontend and backend apps
    

**Backend Features**

- [ ] 
    
    The project includes at least one of each of the following database relationship in Postgres: one-to-many and many-to-many with a join table
    
    - [ ] 
        
        one-to-many
        
    - [ ] 
        
        many-to-many with a join table
        
    
- [ ] 
    
    The project includes a well-designed RESTful API
    
    - _supports all four main request types for a single entity (e.g., tasks in a to-do list app): GET, POST, PATCH, and DELETE_
    - [ ] 
        
        the user can **view** items, such as tasks
        
    - [ ] 
        
        the user can **create** a new item, such as a task
        
    - [ ] 
        
        the user can **update** an existing item by changing some or all of its values, such as changing the title of task
        
    - [ ] 
        
        the user can **delete** an existing item, such as a task
        
    - [ ] 
        
        Routes follow proper naming conventions
        
    
- [ ] 
    
    The app includes the ability to reset the database to its default state
    

**Frontend Features**

- [ ] 
    
    The project includes at least one redirection
    
    - _e.g., users are able to navigate to a new page with a new URL within the app_
    
- [ ] 
    
    The project includes at least one interaction that the user can initiate and complete on the same page without navigating to a new page
    
- [ ] 
    
    The project includes dynamic frontend routes created with React Router
    
- [ ] 
    
    The app includes hierarchically designed React components
    
    - [ ] 
        
        Components are broken down into categories, including page and component types
        
    - [ ] 
        
        Corresponding container components and presenter components as appropriate
        
    
- [ ] 
    
    The project is deployed on Render with all pages and features working
    
    - [ ] 
        
        The project is deployed on Render
        
    - [ ] 
        
        All pages and features that are visible to the user are working as intended
        
    

**🧐 What does "all pages and features working" mean?**

All features visible to the user must work as expected. Every button must respond appropriately, every link must lead to the corresponding page, and every form must be submittable with the resulting data reflected in the user interface. If a feature is not working as intended, it should be removed from the user interface.

These features are truly baseline. You will likely have many more than one of certain requirements, such as `GET` requests, in your app. For any rubric item that requires **at least one** of a certain feature, include more as appropriate for your app.

### ✅ Custom Features **(MUST complete TWO)**

Choose at least **two** custom features to include in your app. These features will make your app stand out with a more custom look and functionality.

- [ ] 
    
    The project gracefully handles errors
    
- [ ] 
    
    The project includes a one-to-one database relationship
    
- [ ] 
    
    The project includes a slide-out pane or modal as appropriate for your use case
    
    - _e.g., a pane or modal that pops up and covers the page content without navigating away from the current page_
    
- [ ] 
    
    The project includes a unique field within the join table
    
- [ ] 
    
    The project includes a custom non-RESTful route with corresponding controller actions
    
- [ ] 
    
    The project allows filtering and/or sorting as appropriate for your use case
    
- [ ] 
    
    Data is automatically generated in response to a certain event or user action
    
    - _e.g., generating a default inventory for a new user starting a game or creating a starter set of tasks for a user creating a new task app account_
    
- [ ] 
    
    Data submitted via a `POST` or `PATCH` request is validated before the database is updated
    
    - _e.g., validating that an event is in the future before allowing a new event to be created_
    

### Stretch Features

We include these stretch features as ideas for how to expand your app. Not all of the features below are equally easy to implement. Some of the features in this list are quite tricky to implement and go beyond the scope of this course. You may opt to implement additional custom features in your app to personalize it even more in place of or in addition to stretch features.

Make sure you have completed all your other required features first before attempting to implement these stretch features, as they may take significant time to get working.

- [ ] 
    
    A subset of pages require the user to log in before accessing the content
    
    - [ ] 
        
        An authentication mechanism is present (GitHub OAuth or username/password with session/JWT)
        
    - [ ] 
        
        Protected route enforcement is present — some pages require login before accessing content
        
    
- [ ] 
    
    Restrict available user options dynamically
    
    - _e.g., restricting available purchases based on a user's currency_
    
- [ ] 
    
    Show a spinner while a page or page element is loading
    
- [ ] 
    
    Disable buttons and inputs during the form submission process
    
- [ ] 
    
    Disable buttons after they have been clicked
    
    - _At least 75% of buttons in your app must exhibit this behavior to receive full credit_
    
- [ ] 
    
    Users can upload images to the app and have them be stored on a cloud service
    
    - _A user profile picture does **NOT** count for this rubric item **only if** the app also includes "Login via GitHub" functionality._
    - _Adding a photo via a URL does **NOT** count for this rubric item (for example, if the user provides a URL with an image to attach it to the post)._
    - _Selecting a photo from a list of provided photos does **NOT** count for this rubric item._
    
- [ ] 
    
    Toast messages deliver simple feedback in response to user events
    

  

### Milestone 1 Instructions

Note: only **one** partner needs to fork the repository. Throughout this project, all team members should be working with the same repository, not their own copy.

This week, your major tasks will include:

- Forking the final project repository and sharing it with your teammates
- Writing the description, purpose, and inspiration for your web app
- Developing user stories to nail down the user journeys and features you will support in your app
- Writing the initial technical feature list for the app to explain what you will need to design and develop

  

With your group:

1. Fork [**the WEB103 Final Project repository**](https://github.com/codepath/web103_finalproject) on GitHub. Make sure all team members have access to the repository.
2. Locate the `milestones/milestone1.md` document within the forked repo.
3. Complete all tasks listed in `milestones/milestone1.md`, checking off each task within the document as you complete them. These tasks include:
    - [ ] 
        
        Read and understand all required features
        
        - [ ] 
            
            Understand you **must** implement **all** baseline features and **two** custom features
            
        
    - [ ] 
        
        In `readme.md`: update app name to your app's name
        
    - [ ] 
        
        In `readme.md`: add all group members' names
        
    - [ ] 
        
        In `readme.md`: complete the **Description and Purpose** section
        
    - [ ] 
        
        In `readme.md`: complete the **Inspiration** section
        
    - [ ] 
        
        In `readme.md`: list a name and description for all features (minimum 6 for full points) you intend to include in your app (in future units, you will check off features as you complete them and add GIFs demonstrating the features)
        
    - [ ] 
        
        In `planning/user_stories.md`: add all user stories (minimum 10 for full points)
        
    - [ ] 
        
        In `planning/user_stories.md`: use 1-3 unique user roles in your user stories
        
    - [ ] 
        
        In the `milestones/milestone_1.md` document, complete all thre questions in the **Reflection** section
        

  

### Project Guides

Each milestone includes project guides for the major components of that milestone. These contain detailed information about how to approach each component as well as tips and tricks.

Check out each guide for this unit for info on each deliverable!

📖 **Read ahead (optional):** You won't be creating GitHub issues or a project board until Milestone 3, but if you'd like a preview of how you'll manage development in GitHub, check out the [GitHub Project Management](https://courses.codepath.org/courses/web103/pages/guide_github_project_management "GitHub Project Management") guide now. It's optional supplementary reading — not required until Milestone 3.

- **⭐ Milestone 1:**
    - **⭐ [Choosing a Theme](https://courses.codepath.org/courses/web103/pages/guide_choosing_a_theme "Choosing a Theme")**
    - **⭐ [Writing User Stories](https://courses.codepath.org/courses/web103/pages/guide_writing_user_stories "Writing User Stories")**
    - **⭐ [Writing Features](https://courses.codepath.org/courses/web103/pages/guide_writing_features "Writing Features")**
- **Milestone 2:**
    - [Writing a Pitch](https://courses.codepath.org/courses/web103/pages/guide_writing_a_pitch "Writing a Pitch")
    - [Wireframing](https://courses.codepath.org/courses/web103/pages/guide_wireframing "Wireframing")
    - [Entity Relationship Diagrams](https://courses.codepath.org/courses/web103/pages/guide_entity_relationship_diagrams "Entity Relationship Diagrams")
- **Milestone 3:**
    - [GitHub Project Management](https://courses.codepath.org/courses/web103/pages/guide_github_project_management "GitHub Project Management")
- **Milestone 4:**
    - Continue working on your app by completing issues in GitHub, fixing bugs, etc.
- **Final Milestone:**
    - [Demo Day Prep](https://courses.codepath.org/courses/web103/pages/guide_demo_day_prep "Demo Day Prep")

  

### 🔗 Additional Resources

- [WEB103 Final Project repository](https://github.com/codepath/web103_finalproject)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [MDN Web Docs: JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

  

### 💡 Hints

- Help! I don't know where to start!
    
    - Check the Project Guides for more information about each component for this unit's milestone.
- How should I organize my project files?
    
    - Now that we're using a database, it's best to separate our backend files from our frontend files. Create a `client` folder that contains the files for your frontend and a `server` folder to contain the files for your backend.
        - In your `client` folder, you might have a `src` folder that contains:
            - an `assets` folder with any images or assets used in your web app
            - a `css` folder with any CSS files
            - a folder containing files to handle retrieving data from the database
        - In your `server` folder, you might have
            - a server file that sets up your backend server
            - a `config` folder that contains the data for your database and setup files for your database
            - a `routes` folder that contains files for routes
- I'm stuck on something!
    
    - Don't just skip the Resources section.
    - Review the AI debugging tips in the box below!
    - Still need a little extra help getting started or running into an error? Try posting in the [Class Slack Channel](http://codepath.slack.com/).

[![AI opportunity](https://courses.codepath.org/course_images/web103/ai/ai_opportunity.png "AI opportunity")](https://courses.codepath.org/course_images/web103/ai/ai_opportunity.png)

_Use AI to understand why your code isn't working_

Try using GitHub Copilot to debug or get unstuck. You can use the following prompts as a starting point:

Prompt 1:

> "You are an expert developer. Based on the current code context and the error {error_message}, what are the three most likely causes of this issue in the current or surrounding files? For each, explain how to fix it, referencing relevant lines or patterns in the project."

Prompt 2:

> "You are a mentor helping a beginner web developer reflect on {topic}. Their understanding is that {state your understanding in your own words}. Ask three follow-up questions that could help them understand what they're missing."

If you are using ChatGPT, remember that ChatGPT will have less context about your project because it won't have access to your codebase. This means you may need to adapt the above prompts to provide context yourself!

## Unit 6: Milestone 2

### Overview

Welcome to the second milestone of the final project! In this final unit before development begins, you will create the visuals for your app and **prep for your pitch next class**! About the pitch: you will have **three minutes** to share your web app plan with your classmates, instructor, and TAs in smaller breakout rooms. You will receive feedback from your peers and TA to help guide development for your app.

🔗 [View an exemplar project - GOATPath](https://goatpath-exemplar.onrender.com/)

GOATPath is a web app designed to help aspiring UX designers chart a path into the field. The app includes a list of tasks sorted into milestones, which come pre-loaded when the user creates a profile. The user can add, edit, and delete tasks. They can also spend their hard-earned $$$ on trophies in the trophy shop! Users can view their trophies in their trophy case on their profile page.

### 🎯 Goals

By the end of this assignment you will be able to...

- [ ] 
    
    Plan, develop, and deploy a full-stack web application
    
- [ ] 
    
    Collaborate on project development with a team
    

This project is divided into **five milestones**, culminating in **Demo Day** where you will show off your hard work. In each unit, you will complete a checklist of tasks for the corresponding milestone by the due date. All milestone tasks and planning documents are included in the capstone project repository that you will fork during this unit.

|Milestone|Description|
|---|---|
|1|Develop the concept for your app, write user stories, create a feature list, and set up a shared GitHub repo|
|2|Create wireframes for at least three of your app's pages, construct an entity relationship diagram, and prepare to pitch your idea|
|3|Pitch your idea, set up your GitHub repo with issues for your features, and begin development|
|4|Continue development by completing issues in GitHub, fix bugs, etc.|
|Final|Continue development by completing issues in GitHub, deploy web app to Render, prepare for Demo Day|
|Demo Day|Show off your final app!|

### Milestone 2 Instructions

🔍 As you plan your app, remember that you must implement the required features:

- **All** baseline features
- **Two** custom features
- **Zero or more** stretch features

This week, your major tasks will include:

- Sketching wireframes for **at least three** different pages in your web app and add them to the corresponding document in your repo's planning folder.
    - You may hand-sketch or use a digital design tool to create your wireframes. Either way, **embed an image of each wireframe (a screenshot or export) directly in `planning/wireframes.md`** — a link to Figma or another tool on its own does not count.
- Creating an entity relationship diagram to visualize the data involved in your web app and add it to the corresponding document in your repo's planning folder.
- Developing your three-minute pitch presentation, to be presented in the next unit.

  

With your group:

1. Locate the `milestones/milestone2.md` document within your final project repository.
2. Complete all tasks listed in `milestones/milestone2.md`, checking off each task within the document as you complete them. These tasks include:
    - [ ] 
        
        In `planning/wireframes.md`: add wireframes for at least three pages in your web app.
        
        - [ ] 
            
            Include a list of at least 3 pages in your app
            
        
    - [ ] 
        
        In `planning/entity_relationship_diagram.md`: add the entity relationship diagram you developed for your database.
        
        - [ ] 
            
            Your entity relationship diagram should include the tables in your database.
            
        
    - [ ] 
        
        Prepare your three-minute pitch presentation, to be presented during Unit 7 (the next unit).
        
        - [ ] 
            
            You do **not** need to submit any materials in advance of your pitch.
            
        
    - [ ] 
        
        In `milestones/milestone2.md`, complete all three questions in the **Reflection** section.
        

  

### Project Guides

Each milestone includes project guides for the major components of that milestone. These contain detailed information about how to approach each component as well as tips and tricks.

Check out each guide for this unit for info on each deliverable!

📖 **Read ahead (optional):** Next unit (Milestone 3), you'll set up your GitHub repo with issues and a project board. If you'd like to get a head start, check out the [GitHub Project Management](https://courses.codepath.org/courses/web103/pages/guide_github_project_management "GitHub Project Management") guide now. It's optional supplementary reading — not required until Milestone 3.

- **Milestone 1:**
    - [Choosing a Theme](https://courses.codepath.org/courses/web103/pages/guide_choosing_a_theme "Choosing a Theme")
    - [Writing User Stories](https://courses.codepath.org/courses/web103/pages/guide_writing_user_stories "Writing User Stories")
    - [Writing Features](https://courses.codepath.org/courses/web103/pages/guide_writing_features "Writing Features")
- **⭐ Milestone 2:**
    - **[⭐ Writing a Pitch](https://courses.codepath.org/courses/web103/pages/guide_writing_a_pitch "⭐ Writing a Pitch")**
    - **[⭐ Wireframing](https://courses.codepath.org/courses/web103/pages/guide_wireframing "⭐ Wireframing")**
    - **[⭐ Entity Relationship Diagrams](https://courses.codepath.org/courses/web103/pages/guide_entity_relationship_diagrams "⭐ Entity Relationship Diagrams")**
- **Milestone 3:**
    - [GitHub Project Management](https://courses.codepath.org/courses/web103/pages/guide_github_project_management "GitHub Project Management")
- **Milestone 4:**
    - Continue working on your app by completing issues in GitHub, fixing bugs, etc.
- **Final Milestone:**
    - [Demo Day Prep](https://courses.codepath.org/courses/web103/pages/guide_demo_day_prep "Demo Day Prep")

### 💡 Hints

- Help! I don't know where to start!
    
    - Check the Project Guides for more information about each component for this unit's milestone.
- I'm stuck on something!
    
    - Don't just skip the Resources section.
    - Review the AI debugging tips in the box below!
    - Still need a little extra help getting started or running into an error? Try posting in the [Class Slack Channel](http://codepath.slack.com/).

[![AI opportunity](https://courses.codepath.org/course_images/web103/ai/ai_opportunity.png "AI opportunity")](https://courses.codepath.org/course_images/web103/ai/ai_opportunity.png)

_Use AI to understand why your code isn't working_

## Unit 7: Milestone 3

### Overview

Welcome to the third milestone of the capstone project...it's pitch week! During the in-class session, you'll hear from your classmates about their planned apps and share your own ideas. In addition to getting and giving feedback, you'll learn how to set up and manage a collaborative project in GitHub. It's an exciting week, so let's get to it!

🔗 [View an exemplar project - GOATPath](https://goatpath-exemplar.onrender.com/)

GOATPath is a web app designed to help aspiring UX designers chart a path into the field. The app includes a list of tasks sorted into milestones, which come pre-loaded when the user creates a profile. The user can add, edit, and delete tasks. They can also spend their hard-earned $$$ on trophies in the trophy shop! Users can view their trophies in their trophy case on their profile page.

### 🎯 Goals

By the end of this assignment you will be able to...

- [ ] 
    
    Plan, develop, and deploy a full-stack web application
    
- [ ] 
    
    Collaborate on project development with a team
    

This project is divided into **five milestones**, culminating in **Demo Day** where you will show off your hard work. In each unit, you will complete a checklist of tasks for the corresponding milestone by the due date. All milestone tasks and planning documents are included in the final project repository that you will fork during this unit.

|Milestone|Description|
|---|---|
|1|Develop the concept for your app, write user stories, create a feature list, and set up a shared GitHub repo|
|2|Create wireframes for at least three of your app's pages, construct an entity relationship diagram, and prepare to pitch your idea|
|3|Pitch your idea, set up your GitHub repo with issues for your features, and begin development|
|4|Continue development by completing issues in GitHub, fix bugs, etc.|
|Final|Continue development by completing issues in GitHub, deploy web app to Render, prepare for Demo Day|
|Demo Day|Show off your final app!|

### Milestone 3 Instructions

🔍 As you plan your app, remember that you must implement the required features:

- **All** baseline features
- **Two** custom features
- **Zero or more** stretch features

This week, your major tasks will include:

- Pitching your idea in class.
- Setting up your GitHub repo with issues and a project board to make it easy to track development.
- Beginning development on your app.
- Recording GIFs of all features that have been completed by the due date.
- Documenting your project management work in a **progress report** — a required, graded part of this milestone.

  

With your group:

1. Locate the `milestones/milestone3.md` document within your final project repository.
2. Complete all tasks listed in `milestones/milestone3.md`, checking off each task within the document as you complete them. These tasks include:
    - [ ] 
        
        In your repo, create at least 5 issues from the features on your feature list.
        
    - [ ] 
        
        In your repo, create a project board. _Please be sure to share your project board with the grading team's GitHub **codepathreview**. This is separate from your repository's sharing settings._
        
    - [ ] 
        
        In your repo, update the status of issues in your project board.
        
    - [ ] 
        
        In your repo, create a GitHub Milestone for each final project unit, corresponding to each of the 5 milestones in your `milestones/` directory.
        
        - [ ] 
            
            Set the completion percentage of each milestone. The GitHub Milestone for this unit (Milestone 3 - Unit 7) should be 100% completed when you submit for full points.
            
        
    - [ ] 
        
        In `readme.md`, check off the features you have completed in this unit by adding a ✅ emoji in front of the feature's name.
        
        - [ ] 
            
            Under each feature you have completed, include a GIF showing feature functionality.
            
        
    - [ ] 
        
        In `milestones/milestone3.md`, complete all five questions in the **Reflection** section.
        
3. Create your **Milestone 3 Progress Report**:
    - [ ] 
        
        In the `milestones/` directory of your repo, create a new file named `progress_report_3.md`.
        
    - [ ] 
        
        Copy the template below into that file, and fill in every section.
        

🚨 **Your progress report is where your GitHub project work gets graded.** Graders read `milestones/progress_report_3.md` to award points for your project board, issues, milestones, and completion percentage — so record everything your team actually did. Keep each list item on its own line, replace the "Example:" lines with your own entries, and double-check the file before you submit. Work that isn't recorded in the report can't earn points.

Copy this template into `milestones/progress_report_3.md`:

```
# Milestone 3 Progress Report

## GitHub Project Setup
Project board created: yes or no
Project board shared with codepathreview: yes or no

## Issues Created
List the title of each issue you created, one per line:
- Example: Create event form
- 
- 
- 
- 

## GitHub Milestones Created
List the name of each GitHub Milestone you created, one per line:
- Example: Milestone 3 - Unit 7
- 
- 

## Milestone 3 Completion
Replace the blank before the percent sign with a number from 0 to 100.
Completion percentage for Milestone 3 - Unit 7: %
List each issue you completed this unit and the main file or folder where that work lives, one per line:
- Example: User login - server/routes/auth.js
- 

## Features Completed This Unit
List each feature you completed and checked off in readme.md this unit, one per line:
- Example: Search events by category
- 
```

  

### Project Guides

Each milestone includes project guides for the major components of that milestone. These contain detailed information about how to approach each component as well as tips and tricks.

Check out each guide for this unit for info on each deliverable!

- **Milestone 1:**
    - [Choosing a Theme](https://courses.codepath.org/courses/web103/pages/guide_choosing_a_theme "Choosing a Theme")
    - [Writing User Stories](https://courses.codepath.org/courses/web103/pages/guide_writing_user_stories "Writing User Stories")
    - [Writing Features](https://courses.codepath.org/courses/web103/pages/guide_writing_features "Writing Features")
- **Milestone 2:**
    - [Writing a Pitch](https://courses.codepath.org/courses/web103/pages/guide_writing_a_pitch "Writing a Pitch")
    - [Wireframing](https://courses.codepath.org/courses/web103/pages/guide_wireframing "Wireframing")
    - [Entity Relationship Diagrams](https://courses.codepath.org/courses/web103/pages/guide_entity_relationship_diagrams "Entity Relationship Diagrams")
- **⭐ Milestone 3:**
    - **[⭐ GitHub Project Management](https://courses.codepath.org/courses/web103/pages/guide_github_project_management "⭐ GitHub Project Management")**
- **Milestone 4:**
    - Continue working on your app by completing issues in GitHub, fixing bugs, etc.
- **Final Milestone:**
    - [Demo Day Prep](https://courses.codepath.org/courses/web103/pages/guide_demo_day_prep "Demo Day Prep")

### 💡 Hints

- Help! I don't know where to start!
    
    - Check the Project Guides for more information about each component for this unit's milestone.
- I'm stuck on something!
    
    - Don't just skip the Resources section.
    - Review the AI debugging tips in the box below!
    - Still need a little extra help getting started or running into an error? Try posting in the [Class Slack Channel](http://codepath.slack.com/).

[![AI opportunity](https://courses.codepath.org/course_images/web103/ai/ai_opportunity.png "AI opportunity")](https://courses.codepath.org/course_images/web103/ai/ai_opportunity.png)

_Use AI to understand why your c_

## Unit 8: Milestone 4

### Overview

In this milestone, you'll continue development of your web app, completing the issues you created in the last milestone, monitoring your project for any issues with scope creep, and recording your progress. Have at it!

🔗 [View an exemplar project - GOATPath](https://goatpath-exemplar.onrender.com/)

GOATPath is a web app designed to help aspiring UX designers chart a path into the field. The app includes a list of tasks sorted into milestones, which come pre-loaded when the user creates a profile. The user can add, edit, and delete tasks. They can also spend their hard-earned $$$ on trophies in the trophy shop! Users can view their trophies in their trophy case on their profile page.

### 🎯 Goals

By the end of this assignment you will be able to...

- [ ] 
    
    Plan, develop, and deploy a full-stack web application
    
- [ ] 
    
    Collaborate on project development with a team
    

This project is divided into **five milestones**, culminating in **Demo Day** where you will show off your hard work. In each unit, you will complete a checklist of tasks for the corresponding milestone by the due date. All milestone tasks and planning documents are included in the final project repository that you will fork during this unit.

|Milestone|Description|
|---|---|
|1|Develop the concept for your app, write user stories, create a feature list, and set up a shared GitHub repo|
|2|Create wireframes for at least three of your app's pages, construct an entity relationship diagram, and prepare to pitch your idea|
|3|Pitch your idea, set up your GitHub repo with issues for your features, and begin development|
|4|Continue development by completing issues in GitHub, fix bugs, etc.|
|Final|Continue development by completing issues in GitHub, deploy web app to Render, prepare for Demo Day|
|Demo Day|Show off your final app!|

### Milestone 4 Instructions

🧐 **Watch out for scope creep!** Scope creep occurs when a project expands beyond its initial goals and requirements. It often happens when new features are added to the project without being properly vetted or when developers change their minds about what they want the project to accomplish.

To avoid scope creep, make sure you're sticking to the goals you intially outlined in your pitch. Make sure any changes are approved by all team members with proper consideration for how long they will take and how difficult they will be to implement. When in doubt, ask your peers or TA for a second opinion.

This week, your major tasks will include:

- Continuing development of your app by completing issues from your GitHub project board.
- Recording GIFs of all features that have been completed by the due date.
- Documenting your progress in a **progress report** — a required, graded part of this milestone.

  

With your group:

1. Locate the `milestones/milestone4.md` document within your final project repository.
2. Complete all tasks listed in `milestones/milestone4.md`, checking off each task within the document as you complete them. These tasks include:
    - [ ] 
        
        Update the completion percentage of each GitHub Milestone. The milestone for this unit (Milestone 4 - Unit 8) should be 100% completed when you submit for full points.
        
    - [ ] 
        
        In `readme.md`, check off the features you have completed in this unit by adding a ✅ emoji in front of the feature's name.
        
        - [ ] 
            
            Under each feature you have completed, include a GIF showing feature functionality.
            
        
    - [ ] 
        
        In `milestones/milestone4.md`, complete all five questions in the **Reflection** section.
        
3. Create your **Milestone 4 Progress Report**:
    - [ ] 
        
        In the `milestones/` directory of your repo, create a new file named `progress_report_4.md`.
        
    - [ ] 
        
        Copy the template below into that file, and fill in every section.
        

🚨 **Your progress report is where your GitHub project work gets graded.** Graders read `milestones/progress_report_4.md` to award points for your milestone completion percentage and completed features — so record everything your team actually did. Keep each list item on its own line, replace the "Example:" lines with your own entries, and double-check the file before you submit. Work that isn't recorded in the report can't earn points.

Copy this template into `milestones/progress_report_4.md`:

```
# Milestone 4 Progress Report

## Milestone 4 Completion
Replace the blank before the percent sign with a number from 0 to 100.
Completion percentage for Milestone 4 - Unit 8: %
List each issue you completed this unit and the main file or folder where that work lives, one per line:
- Example: User login - server/routes/auth.js
- 

## Features Completed This Unit
List each feature you completed and checked off in readme.md this unit, one per line:
- Example: Search events by category
- 
```

  

### Project Guides

Each milestone includes project guides for the major components of that milestone. These contain detailed information about how to approach each component as well as tips and tricks.

- **Milestone 1:**
    - [Choosing a Theme](https://courses.codepath.org/courses/web103/pages/guide_choosing_a_theme "Choosing a Theme")
    - [Writing User Stories](https://courses.codepath.org/courses/web103/pages/guide_writing_user_stories "Writing User Stories")
    - [Writing Features](https://courses.codepath.org/courses/web103/pages/guide_writing_features "Writing Features")
- **Milestone 2:**
    - [Writing a Pitch](https://courses.codepath.org/courses/web103/pages/guide_writing_a_pitch "Writing a Pitch")
    - [Wireframing](https://courses.codepath.org/courses/web103/pages/guide_wireframing "Wireframing")
    - [Entity Relationship Diagrams](https://courses.codepath.org/courses/web103/pages/guide_entity_relationship_diagrams "Entity Relationship Diagrams")
- **Milestone 3:**
    - [GitHub Project Management](https://courses.codepath.org/courses/web103/pages/guide_github_project_management "GitHub Project Management")
- **⭐ Milestone 4:**
    - Continue working on your app by completing issues in GitHub, fixing bugs, etc.
- **Final Milestone:**
    - [Demo Day Prep](https://courses.codepath.org/courses/web103/pages/guide_demo_day_prep "Demo Day Prep")

### 💡 Hints

- Help! I don't know where to start!
    
    - Check the Project Guides for more information about each component for this unit's milestone.
- I'm stuck on something!
    
    - Don't just skip the Resources section.
    - Review the AI debugging tips in the box below!
    - Still need a little extra help getting started or running into an error? Try posting in the [Class Slack Channel](http://codepath.slack.com/).

[![AI opportunity](https://courses.codepath.org/course_images/web103/ai/ai_opportunity.png "AI opportunity")](https://courses.codepath.org/course_images/web103/ai/ai_opportunity.png)

_Use AI to understand why your code isn't working_

## Unit 9: Final Milestone

### Overview

It's the last unit of development and the last milestone before **Demo Day**! Can you believe you're almost there? In this milestone, you'll continue development of your web app, completing the issues you created in the last milestone, monitoring your project for any issues with scope creep, and recording your progress. You'll also deploy your app on Render and get prepared for Demo Day, the culmination of all your hard work where you get to show off your original web app!

🔗 [View an exemplar project - GOATPath](https://goatpath-exemplar.onrender.com/)

GOATPath is a web app designed to help aspiring UX designers chart a path into the field. The app includes a list of tasks sorted into milestones, which come pre-loaded when the user creates a profile. The user can add, edit, and delete tasks. They can also spend their hard-earned $$$ on trophies in the trophy shop! Users can view their trophies in their trophy case on their profile page.

### 🎯 Goals

By the end of this assignment you will be able to...

- [ ] 
    
    Plan, develop, and deploy a full-stack web application
    
- [ ] 
    
    Collaborate on project development with a team
    

This project is divided into **five milestones**, culminating in **Demo Day** where you will show off your hard work. In each unit, you will complete a checklist of tasks for the corresponding milestone by the due date. All milestone tasks and planning documents are included in the final project repository that you will fork during this unit.

|Milestone|Description|
|---|---|
|1|Develop the concept for your app, write user stories, create a feature list, and set up a shared GitHub repo|
|2|Create wireframes for at least three of your app's pages, construct an entity relationship diagram, and prepare to pitch your idea|
|3|Pitch your idea, set up your GitHub repo with issues for your features, and begin development|
|4|Continue development by completing issues in GitHub, fix bugs, etc.|
|Final|Continue development by completing issues in GitHub, deploy web app to Render, prepare for Demo Day|
|Demo Day|Show off your final app!|

### Final Milestone Instructions

This is the final week of development, as well as the week where you will submit your final app for grading! This week, your major tasks will include:

- Continuing development of your app by completing issues from your GitHub project board.
- Recording GIFs of all features that have been completed by the due date.
- Deploying your web app via Render.
- 🚩 Completing the **Final Project Feature Checklist** of baseline, custom, and stretch features you implemented in your app.
- 🚩 Recording a GIF showing a complete run-through of your app that displays all the components included in the Final Project Feature Checklist.

  

With your group:

1. Locate the `milestones/milestone5.md` document within your final project repository.
2. Deploy your project on Render.
    - [ ] 
        
        In `readme.md`, add the link to your deployed project.
        
3. Complete all tasks listed in `milestones/milestone5.md`, checking off each task within the document as you complete them. These tasks include:
    - [ ] 
        
        Update the status of issues in your project board as you complete them.
        
    - [ ] 
        
        In `readme.md`, check off the features you have completed in this unit by adding a ✅ emoji in front of their title.
        
        - [ ] 
            
            Under each feature you have completed, **include a GIF** showing feature functionality.
            
        
    - [ ] 
        
        In `milestones/milestone5.md`, complete the **Reflection** section.
        
4. Complete the final project grading tasks listed in `milestones/milestone5.md`. These tasks include:
    - [ ] 
        
        🚩 In `milestones/milestone5.md`, **complete the Final Project Feature Checklist section**, detailing each feature you completed in the project (ONLY include features you implemented, not features you planned).
        
    - [ ] 
        
        🚩 In `milestones/milestone5.md`, **include a GIF showing a complete run-through of your app** that displays all the components included in the **Final Project Feature Checklist**.
        

  

### Project Guides

Each milestone includes project guides for the major components of that milestone. These contain detailed information about how to approach each component as well as tips and tricks.

- **Milestone 1:**
    - [Choosing a Theme](https://courses.codepath.org/courses/web103/pages/guide_choosing_a_theme "Choosing a Theme")
    - [Writing User Stories](https://courses.codepath.org/courses/web103/pages/guide_writing_user_stories "Writing User Stories")
    - [Writing Features](https://courses.codepath.org/courses/web103/pages/guide_writing_features "Writing Features")
- **Milestone 2:**
    - [Writing a Pitch](https://courses.codepath.org/courses/web103/pages/guide_writing_a_pitch "Writing a Pitch")
    - [Wireframing](https://courses.codepath.org/courses/web103/pages/guide_wireframing "Wireframing")
    - [Entity Relationship Diagrams](https://courses.codepath.org/courses/web103/pages/guide_entity_relationship_diagrams "Entity Relationship Diagrams")
- **Milestone 3:**
    - [GitHub Project Management](https://courses.codepath.org/courses/web103/pages/guide_github_project_management "GitHub Project Management")
- **Milestone 4:**
    - Continue working on your app by completing issues in GitHub, fixing bugs, etc.
- **⭐ Final Milestone:**
    - [⭐ Demo Day Prep](https://courses.codepath.org/courses/web103/pages/guide_demo_day_prep "⭐ Demo Day Prep")

### 💡 Hints

- Help! I don't know where to start!
    
    - Check the Project Guides for more information about each component for this unit's milestone.
- I'm stuck on something!
    
    - Don't just skip the Resources section.
    - Review the AI debugging tips in the box below!
    - Still need a little extra help getting started or running into an error? Try posting in the [Class Slack Channel](http://codepath.slack.com/).

[![AI opportunity](https://courses.codepath.org/course_images/web103/ai/ai_opportunity.png "AI opportunity")](https://courses.codepath.org/course_images/web103/ai/ai_opportunity.png)

_Use AI to understand why your code isn't working_

### Capstone Project: Milestone 1

Total Points: **30pts**

|Required Features|Points|
|---|---|
|README file is updated so that it contains the name, description, and inspiration of app|3|
|README file is updated so that it contains all group member names|1|
|README file contains a list of at least 6 features that will be implemented in the app|12|
|User Stories file contains at least 1 user role|1|
|User Stories file contains at least 10 user stories|10|
|Group completes all 3 reflection questions in the Milestone 1 file|3|
|**Total**|**30**|

### [](https://courses.codepath.org/courses/web103/pages/grading#heading-capstone-project-milestone-2)Capstone Project: Milestone 2

Total Points: **15pts**

|Required Features|Points|
|---|---|
|Wireframes file includes a list of at least 3 pages in the app|1|
|Wireframes file includes at least 3 wireframes|6|
|Entity Relationship Diagram File includes a list of tables|1|
|Entity Relationship Diagram File includes diagram|4|
|Group completes all 3 reflection questions in the Milestone 2 file|3|
|**Total**|**15**|

### [](https://courses.codepath.org/courses/web103/pages/grading#heading-capstone-project-milestone-3)Capstone Project: Milestone 3

Total Points: **26pts**

|Required Features|Points|
|---|---|
|GitHub Project board is created|2|
|At least 5 issues are created on the Github Project Board|5|
|All 3 Milestones are created on the Github Project Board|3|
|Milestone 3 is 100% complete on Github Project Board|8|
|Group completes all 5 reflection questions in the Milestone 3 file|5|
|At least 1 completed feature is listed in the progress report|1|
|At least 1 feature has a GIF showing that feature|2|
|**Total**|**26**|

### [](https://courses.codepath.org/courses/web103/pages/grading#heading-capstone-project-milestone-4)Capstone Project: Milestone 4

Total Points: **21pts**

|Required Features|Points|
|---|---|
|Milestone 4 is 100% complete on Github Project Board|8|
|Group completes all 5 reflection questions in the Milestone 4 file|5|
|At least 2 completed features are listed in the progress report|2|
|At least 2 features have GIFs showing off a corresponding feature|6|
|**Total**|**21**|

### [](https://courses.codepath.org/courses/web103/pages/grading#heading-capstone-project-final-milestone)Capstone Project: Final Milestone

Total Points: **65pts** + 18 (Extra from Custom Required Features) + 19 (Stretch Features)

59 points are from the Baseline Required Features, 6 from the Custom Required Features (the 2 required features at 3 points each), 19 from Stretch Features

|Required Features|Points|
|---|---|
|The project includes an Express backend app and a React frontend app|5|
|The project includes at least one of each of the following database relationship in Postgres: one-to-many and many-to-many with a join table|8|
|The project includes a well-designed RESTful API|15|
|The app includes the ability to reset the database to its default state|4|
|The project includes at least one redirection|3|
|The project includes at least one interaction that the user can initiate and complete on the same page without navigating to a new page|3|
|The project includes dynamic frontend routes created with React Router|4|
|The app includes hierarchically designed React components|6|
|The project includes dynamic routes for both frontend and backend apps|3|
|The project is deployed on Render with all pages and features working|8|
|**Total**|**59**|

**You must complete at least two custom features. Each custom feature is worth 3 points, awarded all-or-nothing. Database-relationship features are credited from the schema actually implemented in your app, not from your entity-relationship diagram.**

|Custom Required Features|Points|
|---|---|
|The project gracefully handles errors|3|
|The project includes a one-to-one database relationship|3|
|The project includes a slide-out pane or modal as appropriate for your use case|3|
|The project includes a unique field within the join table|3|
|The project includes a custom non-RESTful route with corresponding controller actions|3|
|The project allows filtering and/or sorting as appropriate for your use case|3|
|Data is automatically generated in response to a certain event or user action|3|
|Data submitted via a POST or PATCH request is validated before the database is updated|3|
|**Total**|**24**|

|Stretch Features|Points|
|---|---|
|A subset of pages require the user to log in before accessing the content|3|
|Restrict available user options dynamically|3|
|Show a spinner while a page or page element is loading|2|
|Disable buttons and inputs during the form submission process|2|
|Disable buttons after they have been clicked|2|
|Users can upload images to the app and have them be stored on a cloud service|4|
|Toast messages deliver simple feedback in response to user events|3|
|**Total**|**19**|