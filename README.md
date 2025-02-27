# BC-University Student Registration System

## Overview

The **Student Registration System** is a web application designed to manage students, courses, and payments in an educational institution. It allows administrators to register students, assign courses, and manage payment records. The application features a responsive frontend built with React and a backend powered by Node.js and MySQL, ensuring smooth data management and secure operations.

## Features

- **Student Registration**: Register new students with personal details.
- **Course Management**: Admin can add, update, and delete courses.
- **Payment Management**: Track and update payment details for students.
- **Data Validation**: Input validation to ensure correct and safe data entry.
- **Responsive UI**: A clean, professional interface with a purple and grey color scheme.
- **CRUD Operations**: Full Create, Read, Update, and Delete operations for students, courses, and payments.
- **Database Integration**: MySQL database to store and retrieve data.

## Technologies Used

- **Frontend**: React (or Next.js)
  - Handles UI components, page routing, and state management.
  - Fetches data from the backend using API calls.
  
- **Backend**: Node.js, Express.js
  - Handles server-side logic, CRUD operations, and routes.
  - Manages MySQL database operations.

- **Database**: MySQL
  - Stores data related to students, courses, and payments.

- **Styling**: Custom CSS with a purple and grey color scheme for a professional look.

## How It Works

### Frontend

1. The React frontend is built to allow users to interact with the system.
2. Forms are provided for students to register, courses to be managed, and payments to be processed.
3. Data is fetched from the backend via API calls (GET, POST, PUT, DELETE) and displayed in the UI.
4. The frontend validates user input using basic form validation before sending data to the backend.

### Backend

1. The Node.js backend handles the business logic and performs CRUD operations on the MySQL database.
2. The backend is structured into multiple files:  
   - `server.js`: Starts the server and connects to the MySQL database.
   - `components/`: Handles CRUD operations for courses, payments, and students.
3. Data is sent to the frontend in JSON format, and the backend responds to the client with status codes and error messages if necessary.
4. The backend ensures data validation, checks for errors during database operations, and provides appropriate responses.

### Database

1. The MySQL database stores tables for students, courses, and payments.
2. Relationships are established between the tables to manage data integrity.
3. Queries are optimized for fast data retrieval, updates, and deletions.

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory and install backend dependencies:
   ```
   cd BC-University/backend
   npm install
   ```

3. Set up the MySQL database and update the database connection credentials in the `db.js` file.

4. Start the backend server:
   ```
   npm start
   ```

5. Open a separate terminal window and navigate to the `frontend` folder, then install frontend dependencies:
   ```
   cd student-registration-system
   npm install
   ```

6. Start the frontend:
   ```
   npm start
   ```

7. Access the app on `http://localhost:3000`.

## File Structure

```
BC-University/
├── backend/
│   ├── db.js
│   ├── node_modules/
│   ├── package-lock.json
│   ├── package.json
│   ├── server.js
│   └── components/
├── student-registration-system/
│   ├── node_modules/
│   ├── public/
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   ├── logo192.png
│   │   ├── logo512.png
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── src/
│   │   ├── components/
│   │   ├── App.css
│   │   ├── App.js
│   │   ├── App.test.js
│   │   ├── index.css
│   │   ├── index.js
│   │   ├── logo.svg
│   │   ├── reportWebVitals.js
│   │   └── setupTests.js
│   ├── .gitignore
│   ├── package-lock.json
│   ├── package.json
├── LICENSE
└── README.md
```

## Contributing

Feel free to fork the repository and submit pull requests. Contributions to improve functionality, UI, or database efficiency are always welcome.

## License

This project is licensed under the MIT License.

