# CloudApp - Angular Web Application

CloudApp is an advanced Angular-based web application that demonstrates best practices in component architecture, API integration, security, performance optimization, and responsive design.

## Features

- **User Profile Component**: Displays and allows editing of user data (name, email, avatar)
- **Data Table Component**: Displays paginated, sortable, and filterable table data
- **Notification Component**: Displays success, error, and info messages with auto-dismissal
- **Authentication**: Mock login system with protected routes
- **Responsive Design**: Works on all device sizes
- **Lazy Loading**: Optimized performance with lazy-loaded modules

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install --legacy-peer-deps
```

## Running the Application

You can run the application in two ways:

### Development server with Mock API

This will start both the Angular application and the JSON Server mock API:

```bash
npm run dev
```

- Angular app will be available at: http://localhost:4200
- Mock API will be available at: http://localhost:3000

### Angular application only

```bash
npm start
```

The application will be available at http://localhost:4200.

### Mock API only

```bash
npm run api
```

The mock API will be available at http://localhost:3000.

## Demo Credentials

Use the following credentials to log in:

- Email: admin@example.com
- Password: password

## Project Structure

```
src/
├── app/
│   ├── core/                  # Core functionality
│   │   ├── auth/              # Authentication
│   │   ├── services/          # Core services
│   │   └── models/            # Data models
│   ├── shared/                # Shared components
│   │   ├── components/        # Reusable components
│   │   │   ├── notification/  # Notification component
│   │   │   ├── data-table/    # Data table component
│   │   │   └── user-profile/  # User profile component
│   ├── features/              # Feature modules (lazy-loaded)
│   │   ├── home/              # Home page
│   │   ├── profile/           # Profile page
│   │   └── settings/          # Settings page
│   ├── layout/                # Layout components
│   └── mock-api/             # Mock API data
├── assets/                    # Static assets
└── environments/              # Environment configurations
```

## Building for Production

```bash
ng serve
```

The build artifacts will be stored in the `dist/` directory.

## Further Development

This project can be extended in several ways:

1. Add more components and features
2. Implement real backend API integration
3. Add unit and integration tests
4. Implement state management with NgRx
5. Add more advanced form validation
6. Implement real authentication with JWT
7. Add internationalization (i18n) support
