# Project Structure

## Purpose

This document explains the purpose of every important file and folder in the LexVault codebase.

Its goal is to help both developers and AI assistants quickly understand how the project is organized without reading the entire codebase.

Each documented file describes:

- What the file does.
- How it fits into the application's workflow.
- Which files it depends on.
- Any important implementation notes.

This document should always reflect the current project structure.


## High-Level Structure 

LexVault 
├── docs/ → Project documentation 
├── lexvault-web/ → React frontend 
├── src/ → Backend services 
├── server.js → Backend entry point 
└── .env → Environment variables

---

# Project Structure



## server.js

### Purpose

Main backend entry point.

Creates the Express server, exposes the API endpoint, coordinates translation, dictionary lookup, and storage operations.

---

### Flow

Frontend

↓

POST /analyze

↓

src/translation.js

↓

src/dictionary.js

↓

src/addWord.js

↓

Response

---

### Dependencies

**Uses**

- src/translation.js
- src/dictionary.js
- src/addWord.js

**Used By**

- None (Application Entry Point)

---

### Notes

- Entry point of the backend.
- Should remain lightweight.
- Business logic should stay inside dedicated modules.
- Currently exposes a single endpoint: `POST /analyze`.



## src/ai.js

### Purpose

Reserved for future AI-powered features such as sentence generation, explanations, quizzes, and learning assistance.

---

### Flow

---

### Dependencies

**Uses**


**Used By**

### Notes

- Currently unused.
- Translation is handled by DeepL.
- Dictionary data is retrieved through Dictionary API.



## src/translation.js

### Purpose 

Handles English-to-Turkish translation using the DeepL API.

### Flow

Word
↓
DeepL API
↓
Turkish Translation
↓
server.js

### Dependencies 

**Uses**

- dotenv
- axios

**Used**

- sever.js

### Notes

- Responsible only for translation.
- Uses DeepL Free API.
- Always translates from English to Turkish.
- Returns only the translated meaning.



## src/dictionary.js

### Purpose

Retrieves linguistic information from the Free Dictionary API.

---

### Flow

Word
↓
Dictionary API
↓
Pronunciation
Type
Definition
Example
↓
server.js

---

### Dependencies

**Uses**

- axios

**Used By**

- server.js

### Notes

- Retrieves pronunciation, part of speech, definition, and example.
- Searches across all available meanings and definitions.
- Returns empty strings for missing fields.
- Does not perform translation.



## src/addWord.js

### Purpose

Handles the storage layer of LexVault.

Receives analyzed vocabulary data, checks for duplicates, updates existing entries when necessary, and creates new entries in the current storage provider.

---

### Flow

Analyzed Word

↓

Duplicate Check

↓

Existing Entry?

↓

Yes → Update Times & Date

↓

No → Normalize Source

↓

Create New Entry

↓

Return Status

---

### Dependencies

**Uses**

- notion.js

**Used By**

- server.js

---

### Notes

- Responsible for all storage operations.
- Implements duplicate detection using the word title.
- Increments the `Times` field when a duplicate is found.
- Updates the last seen date for existing words.
- Creates new entries when no duplicate exists.
- Normalizes source names before saving to avoid duplicate multi-select values.
- Includes retry logic for temporary network failures.
- Caches the Notion Data Source ID to reduce unnecessary API requests.
- Stores vocabulary data received from translation and dictionary services.



## src/notion.js

### Purpose

Creates and exports the Notion client used throughout the backend.

Acts as a single connection point between LexVault and the Notion API.

---

### Flow

Environment Variables

↓

NOTION_TOKEN

↓

Notion Client

↓

Export Client

↓

Used by Backend Modules

---

### Dependencies

**Uses**

- dotenv
- @notionhq/client

**Used By**

- addWord.js

---

### Notes

- Initializes the Notion SDK only once.
- All Notion operations should use this shared client.
- Centralizes authentication with the Notion API.



## src/index.js

### Purpose

Legacy CLI entry point.

Runs LexVault from the terminal by collecting user input, analyzing the word, and saving it to the storage provider.

---

### Flow

Terminal

↓

input.js

↓

ai.js

↓

addWord.js

↓

Storage

↓

Exit

---

### Dependencies

**Uses**

- input.js
- ai.js
- addWord.js

**Used By**

- None (CLI Entry Point)

---

### Notes

- Used only for terminal-based testing.
- Predates the web application.
- Can still be used for debugging backend functionality without the frontend.
- May be removed in the future if the CLI is no longer needed.



## src/input.js

### Purpose

Handles terminal-based user input for the LexVault CLI workflow.

Collects vocabulary data entered by the user through the command line and provides it to the analysis and storage pipeline.

---

### Flow

Terminal

↓

User Input

↓

`getWordData()`

↓

Return Word Data Object

↓

`src/ai.js`

↓

`src/addWord.js`

---

### Dependencies

**Uses**

- readline (Node.js built-in module)

**Used By**

- `src/index.js`

---

### Notes

- Responsible only for collecting CLI input.
- Does not perform AI analysis or storage operations.
- Creates a reusable readline interface for terminal communication.
- `getWordData()` collects:
  - word
  - source
- Exports `closeInput()` to properly terminate the readline interface.
- Used only by the legacy CLI workflow and is not part of the web application flow.



## lexvault-web/src/main.jsx

### Purpose

Main entry point of the LexVault React frontend application.

Initializes the React application, connects the root DOM element with the React component tree, and loads global frontend styles.

---

### Flow

Browser

↓

`main.jsx`

↓

Import Global Styles (`index.css`)

↓

Load Root Component (`App.jsx`)

↓

Render React Application

↓

User Interface

---

### Dependencies

**Uses**

- React (`react`)
- React DOM (`react-dom/client`)
- `./index.css`
- `./App.jsx`

**Used By**

- None (Frontend Entry Point)

---

### Notes

- Entry point of the React frontend.
- Responsible only for application initialization and rendering.
- Uses `createRoot()` to mount the React application to the DOM.
- Wraps the application with `StrictMode` for additional development checks.
- Does not contain UI logic or business logic.
- Global styles are loaded through `index.css`.
- Main application structure is handled by `App.jsx`.



## lexvault-web/src/App.jsx

### Purpose

Main application component of the LexVault frontend.

Manages the user interaction flow by collecting vocabulary input, sending analysis requests to the backend API, handling application state, and displaying analyzed vocabulary results.

---

### Flow

User

↓

Enter Word + Source

↓

`App.jsx` State Management

↓

POST `/analyze`

↓

Backend (`server.js`)

↓

AI Analysis + Storage

↓

Response

↓

`WordCard.jsx`

↓

Display Vocabulary Result

---

### Dependencies

**Uses**

- React (`useState`)
- `./App.css`
- `./components/WordCard.jsx`

**Used By**

- `main.jsx`

---

### Notes

- Core frontend component of LexVault.
- Handles:
  - word input
  - source input
  - loading state
  - backend communication
  - displaying results
- Sends vocabulary analysis requests to the backend `/analyze` endpoint.
- Prevents empty submissions and duplicate requests while processing.
- Stores API response data in local component state.
- Does not perform AI analysis or storage operations directly.
- Delegates result visualization to `WordCard.jsx`.
- Contains the main user interface structure:
  - application header
  - vocabulary input form
  - analyze button
  - result display area
- Uses a single component architecture currently; may be separated into smaller components as the frontend grows.



## lexvault-web/src/components/WordCard.jsx

### Purpose

Displays analyzed vocabulary results in a structured card interface.

Receives vocabulary data from the parent component and presents word information, metadata, meanings, examples, notes, and duplicate status to the user.

---

### Flow

Backend Response

↓

`App.jsx`

↓

`WordCard` Props

↓

Render Vocabulary Card

↓

User Interface

---

### Dependencies

**Uses**

- React (Functional Component)

**Used By**

- `App.jsx`

---

### Notes

- Responsible only for displaying vocabulary information.
- Does not perform API requests or data processing.
- Receives data through props:
  - `word`
  - `result`
- Displays duplicate status based on backend response:
  - Existing word → shows previous occurrence count.
  - New word → shows new record status.
- Displays vocabulary metadata:
  - pronunciation
  - word type
  - difficulty level
- Displays content sections:
  - meaning
  - example sentence
  - optional notes
- Keeps UI rendering separate from application logic.
- Designed as a reusable presentation component for vocabulary entries.



## lexvault-web/src/index.css

### Purpose

Provides global CSS rules and base styling configuration for the LexVault React application.

Defines foundational browser-wide styles that apply across the entire frontend.

---

### Flow

`main.jsx`

↓

Import `index.css`

↓

Global Styles Applied

↓

React Application

---

### Dependencies

**Uses**

- CSS

**Used By**

- `main.jsx`

---

### Notes

- Global stylesheet for the React application.
- Applies base layout normalization rules:
  - removes default browser margins
  - ensures root containers can occupy full height
  - sets universal box sizing behavior
- Configures text rendering optimizations for supported browsers.
- Does not contain component-specific styling.
- Component styles should be placed in dedicated CSS files such as `App.css`.



## lexvault-web/src/App.css

### Purpose

Defines the main visual design system and component-specific styles for the LexVault frontend application.

Controls the layout, typography, colors, animations, and interface styling for the vocabulary input interface and analysis result cards.

---

### Flow

`main.jsx`

↓

`App.jsx`

↓

Import `App.css`

↓

Apply Component Styles

↓

Rendered LexVault Interface

---

### Dependencies

**Uses**

- Google Fonts:
  - Fraunces
  - IBM Plex Sans
  - IBM Plex Mono
- CSS variables
- CSS animations

**Used By**

- `App.jsx`

---

### Notes

- Contains the primary frontend styling layer of LexVault.
- Defines the application's visual identity:
  - dark archival theme
  - brass accent colors
  - typography system
  - card-based layout
- Defines reusable design variables through `:root`:
  - background colors
  - text colors
  - accent colors
  - borders
- Styles major interface sections:
  - application header
  - input card
  - form fields
  - submit button
  - result card
  - vocabulary metadata tags
  - duplicate/new record stamps
- Contains responsive behavior for smaller screens.
- Includes animations:
  - result card entrance animation
  - stamp appearance animation
- Includes accessibility considerations:
  - focus-visible states
  - reduced motion support
  - disabled input/button states
- Imports external fonts required for the LexVault design system.
- Currently contains both global visual theme rules and component styles; may be separated into dedicated style modules as the frontend grows.



## .env

### Purpose

Stores environment-specific configuration values and secret credentials required by the LexVault application.

Provides a secure way to manage external service authentication without hardcoding sensitive information into the codebase.

---

### Flow

Environment Variables

↓

Application Startup

↓

Load Configuration

↓

Backend Services

↓

External APIs

---

### Dependencies

**Uses**

- Environment variable system
- dotenv

**Used By**

- `src/notion.js`
- `src/ai.js`

---

### Notes

- Contains sensitive configuration values and API credentials.
- Should not be committed to version control.
- Provides authentication information for external services:
  - Notion API:
    - `NOTION_TOKEN`
    - `NOTION_DATABASE_ID`
  - Google Gemini API:
    - `GEMINI_API_KEY`
  - OpenAI API:
    - `OPENAI_API_KEY`
  - Groq API:
    - `GROQ_API_KEY`
- Loaded through `dotenv` during application startup.
- Allows external service configuration without modifying source code.
- Should be replaced with `.env.example` for public repositories.



## index.js

### Purpose

Utility script used to verify the connection between LexVault and the Notion API.

Tests whether the configured Notion credentials and database ID are valid by attempting to retrieve the target database information.

---

### Flow

Application Start

↓

Load Environment Variables

↓

Create Notion Client

↓

Authenticate with Notion API

↓

Retrieve Database

↓

Connection Result

↓

Console Output

---

### Dependencies

**Uses**

- dotenv
- @notionhq/client

**Used By**

- None (Utility Script)

---

### Notes

- Used for testing Notion API connectivity.
- Loads environment variables through `dotenv`.
- Creates a temporary Notion client instance for validation.
- Checks:
  - `NOTION_TOKEN`
  - `NOTION_DATABASE_ID`
- Does not participate in the main LexVault application workflow.
- Separate from:
  - `server.js` (web backend entry point)
  - `src/index.js` (legacy CLI entry point)
- Useful for debugging authentication or database configuration issues.
- Can be removed or moved into a dedicated scripts folder if no longer needed.