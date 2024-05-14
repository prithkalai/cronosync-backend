# CronoSync

CronoSync is a full-stack application designed to help users manage their tasks and agendas efficiently, with a focus on storing and managing repetitive tasks. The application provides features such as user registration and login, task creation and management, category organization, and email reminders.

## Features

- User authentication and authorization
- Management of repetitive tasks and agendas
- Category organization
- Email reminders for tasks
- Logging and error handling

## Technologies Used

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT for authentication
- Nodemailer for email notifications

### Frontend

- React
- TypeScript
- React Router

The Frontend Repo can be viewed here: https://github.com/prithkalai/cronosync

## Installation

### Prerequisites

- Node.js
- MongoDB

### Backend Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/cronosync.git
   cd cronosync
   ```

2. Install backend dependencies:

   ```bash
   cd backend
   npm install
   ```

3. Set up the following environment variables:

   ```
   EMAIL_SERVICE_USER=your_email_user
   EMAIL_SERVICE_KEY=your_email_key
   EMAIL_SERVICE=your_email_service
   EMAIL_SERVICE_HOST=your_email_host
   PRIVATE_KEY=your_private_key
   DB_AUTH=your_db_auth
   DB_USER=your_db_user
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

## Usage

1. Use tools like Postman to interact with the backend API at `http://localhost:5000`.

## File Structure

### Backend

- `Agenda.js, User.js, Task.js, Category.js`: Model definitions for MongoDB.
- `auth.js`: Handles authentication-related functionality.
- `error.js`: Manages error handling.
- `logger.js`: Sets up logging.
- `emailReminder.js`: Handles sending email reminders.
- `db.js`: Configures database connection.
- `routes.js, users.js, tasks.js, category.js, login.js`: Define API routes.

### Frontend

- `App.tsx`: Main entry point for the React application.
- `api-client.ts, api-guest.ts`: Define functions for making API calls.
- `Layout.tsx`: Defines the layout component.
- `main.tsx`: Entry point for rendering the app.
- `routes.tsx`: Defines application routing.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue to discuss changes.

## License

This project is licensed under the MIT License.

## Contact

For any inquiries, please contact [prithkalai.dev@gmail.com].
