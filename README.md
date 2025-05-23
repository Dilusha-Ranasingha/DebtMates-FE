# DebtMates Frontend

## Overview

This repository contains the frontend for *DebtMates*, a platform designed to simplify group financial management, including debt tracking, rotational savings, and personal savings plans. The frontend is built using **React** with **Vite** as the build tool, and it integrates with the *DebtMates* backend (maintained in a separate repository https://github.com/Dilusha-Ranasingha/DebtMates-BE.git) to provide a seamless user experience. The application features a responsive UI, protected routes for authenticated users, and various pages for managing groups, debts, rotational plans, and personal savings.

<img width="782" alt="debtmateswall" src="https://github.com/user-attachments/assets/279271e9-395d-4177-8033-16d77f0a4eea" />


## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Folder Structure](#folder-structure)
- [Setup Instructions](#setup-instructions)
- [Routing](#routing)
- [Dependencies](#dependencies)
- [Contributing](#contributing)
- [License](#license)

## 🌟Features

- **Responsive UI**: Built with Tailwind CSS for a mobile-friendly and modern design.
- **User Authentication**: Pages for user/admin login, registration, and password reset.
- **Protected Routes**: Ensures only authenticated users can access certain pages, with role-based access for admins.
- **Group Management**: Create, edit, and manage groups, including adding members and recording debts.
- **Debt Tracking**: View debt summaries and record debts within groups.
- **Rotational Savings**: Manage rotational savings groups, create plans, handle payments, and upload payment slips.
- **Personal Savings Plans**: Create, update, and view personal savings plans with deposit tracking.
- **Admin Dashboard**: Admin-specific pages for managing users and viewing activity logs.
- **Charts and Visualizations**: Integrated Chart.js for visualizing financial data.
- **Notifications**: Uses React Toastify and SweetAlert2 for user feedback.
- **PDF Generation**: Supports generating PDFs using html2pdf.js for reports or summaries.

## 💻Technologies

- **React**: JavaScript library for building the user interface.
- **Vite**: Fast build tool and development server.
- **React Router**: Handles client-side routing.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Axios**: For making HTTP requests to the backend API.
- **Chart.js & React-Chartjs-2**: For rendering charts and financial data visualizations.
- **PrimeReact & PrimeIcons**: UI component library for enhanced user experience.
- **React Datepicker**: For date selection in forms.
- **React Hot Toast & React Toastify**: For displaying notifications.
- **SweetAlert2**: For enhanced alert dialogs.
- **html2pdf.js**: For generating PDF documents.
- **Lucide React**: Icon library for UI elements.
- **Heroicons**: Additional icons for the UI.
- **ESLint**: For linting and maintaining code quality.

## 📂Folder Structure

```
DEBTMATES-FE/
├── public/                    # Static assets (e.g., images, favicon)
├── src/                       # Source code
│   ├── assets/                # Images, fonts, and other static assets
│   ├── components/            # Reusable React components (e.g., Navbar, Footer)
│   ├── hooks/                 # Custom React hooks
│   ├── pages/                 # Page components
│   │   ├── AdminPages/        # Admin-specific pages (e.g., AdminDashboard, AdminLogin)
│   │   ├── CommonPages/       # Shared pages (e.g., Profile, PasswordReset)
│   │   ├── GroupPages/        # Group-related pages (e.g., CreateGroup, DebtSummary)
│   │   ├── PersonalSavingPages/ # Personal savings pages (e.g., CreatePlan, ViewPlan)
│   │   ├── RotationalPlanPages/ # Rotational savings pages (e.g., CreateRotationalGroup)
│   │   ├── UserPages/         # User-specific pages (e.g., UserLogin, UserRegister)
│   │   ├── About.jsx          # About Us page
│   │   ├── DashboardPage.jsx  # Main dashboard page
│   │   ├── Home.jsx           # Landing page
│   │   ├── PrivacyPolicy.jsx  # Privacy policy page
│   │   └── TermsOfService.jsx # Terms of service page
│   ├── services/              # API service functions for backend communication
│   ├── store/                 # State management (if applicable)
│   ├── styles/                # Global styles (e.g., Tailwind CSS configurations)
│   ├── utils/                 # Utility functions and helpers
│   ├── App.jsx                # Main app component with routing
│   └── main.jsx               # Entry point for the React app
├── .gitignore                 # Git ignore file
├── eslint.config.js           # ESLint configuration
├── index.html                 # HTML entry point
├── package-lock.json          # Lock file for dependencies
├── package.json               # Project metadata and dependencies
├── README.md                  # Project documentation
└── vite.config.js             # Vite configuration
```

## 🚀Setup Instructions

### Prerequisites

- **Node.js 18+**: Ensure Node.js and npm are installed.
- **Git**: For cloning the repository.
- **Backend API**: The *DebtMates* backend must be running and accessible (refer to the backend repository for setup).

### Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Dilusha-Ranasingha/DebtMates-FE.git
   cd debtmates-fe
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and add the following:
   ```env
   VITE_API_URL=http://localhost:8080/api
   ```
   Replace the URL with the actual backend API URL.

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173` (or another port if specified by Vite).

5. **Build for Production**:
   ```bash
   npm run build
   ```
   The production-ready files will be generated in the `dist/` directory.

6. **Preview the Production Build**:
   ```bash
   npm run preview
   ```

7. **Lint the Code**:
   ```bash
   npm run lint
   ```
   This will run ESLint to check for code quality issues.

## ⼬Routing

The application uses **React Router** for client-side routing. Key routes include:

- `/`: Landing page (`Home`).
- `/dashboardPage`: Main dashboard (`DashboardPage`).
- `/user-login` & `/user-register`: User authentication pages.
- `/admin-login` & `/admin-register`: Admin authentication pages.
- `/password-reset`: Password reset page.
- `/profile`: User profile (protected route).
- `/admin`: Admin dashboard (protected, admin-only).
- `/dashboard`: Group dashboard (protected route).
- `/groups/create`: Create a new group (protected).
- `/groups/:groupId`: View group details (protected).
- `/groups/:groupId/debts`: Debt summary for a group.
- `/rotational-page`: Rotational savings overview (protected).
- `/personal-saving`: Personal savings overview (protected).
- `/aboutUs`, `/privacy-policy`, `/TermsofService`: Static informational pages.
- `*`: 404 Not Found page (`NotFound`).

Protected routes require authentication, and some (e.g., `/admin`) require specific roles (e.g., ADMIN).

## Dependencies

### Main Dependencies
- **react** & **react-dom**: Core React libraries.
- **react-router-dom**: For routing.
- **axios**: For API requests.
- **tailwindcss**: For styling.
- **primereact** & **primeicons**: UI components and icons.
- **chart.js** & **react-chartjs-2**: For charts.
- **react-datepicker**: For date selection.
- **react-hot-toast** & **react-toastify**: For notifications.
- **sweetalert2**: For alerts.
- **html2pdf.js**: For PDF generation.
- **lucide-react** & **@heroicons/react**: For icons.

### Dev Dependencies
- **vite**: Build tool and dev server.
- **@vitejs/plugin-react**: React plugin for Vite.
- **eslint**: Linting tool.
- **eslint-plugin-react-hooks** & **eslint-plugin-react-refresh**: ESLint plugins for React.

## ⑂Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.🪪
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a Pull Request.

Please ensure your code follows the project’s coding standards, adheres to ESLint rules, and includes appropriate tests.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
