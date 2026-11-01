# StudySprint

A responsive student productivity dashboard created as a self-proposed concept for the DevOps Web Design Challenge.

## Project details
- **Project title:** StudySprint
- **Selected track:** Self-proposed web productivity concept (the supplied reference guide mentions three tracks, but does not include their names or descriptions).
- **Goal:** Help students organise small tasks and focus on one thing at a time.
- **Audience:** Students who want a simple, low-friction planning space.

## Features
- Add tasks and choose a priority.
- Mark tasks complete, delete tasks, and clear completed tasks.
- Filter the task list by all, in-progress, and completed.
- Daily progress summary.
- 25-minute focus timer with pause, resume, and reset.
- Light/dark theme toggle.
- Saves tasks and theme preference in the browser using localStorage.
- Responsive layout for mobile and desktop.

## Technology stack
HTML5, CSS3, and vanilla JavaScript. No build tools or API keys are required.

## Run locally
1. Download or clone this repository.
2. Open `index.html` in a modern browser.
3. Internet access is only needed to load the optional Google Fonts; the website itself works without them.

## Deployment
For a public demo, upload the project to a GitHub repository and enable GitHub Pages:
1. Create a public repository and upload `index.html`, `style.css`, and `script.js`.
2. Open **Settings → Pages**.
3. Under Build and deployment, choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
4. Wait for the Pages URL to appear, open it, and test the website on phone and desktop.

Alternative: drag the project folder into Netlify Drop or deploy it using another static hosting provider.

## Walkthrough (1–2 minutes)
1. Open the live website and introduce StudySprint.
2. Add a task and choose its priority.
3. Mark a task complete and show the progress percentage.
4. Switch between task filters.
5. Start and pause the focus timer.
6. Toggle dark mode and resize to a mobile layout.

## Known limitations
- Tasks are stored in the current browser only; they do not sync across devices.
- The focus timer runs while the page remains open.
- There is no user account, cloud database, or multi-user collaboration.
- A live deployment URL and repository URL must be created by the candidate after uploading the files.

## Accessibility and quality checks
- Semantic page regions and form labels are included.
- Interactive controls have accessible labels.
- Layout adapts to smaller screens.
- No credentials or private API keys are used.
- Check all interactions and links after deployment.
