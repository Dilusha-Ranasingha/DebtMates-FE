# 💸 DebtMates Frontend

## 📌 Overview
DebtMates is a financial management system designed to simplify debt tracking, rotational savings plans, personal savings plans, and user management. This repository contains the frontend implementation of DebtMates, built with React and styled using Tailwind CSS, following best practices for a clean and responsive user interface.

## Features
- **💳Debt Management**: Allows users to track and settle debts among friends (e.g., splitting restaurant bills) with the help of an algorithm powered by the Gemini API.
- **🔄Rotational Savings Plan Management**: Manage group-based savings plans with image upload support for rotational plans (images are uploaded to Cloudinary).
- **🎯Personal Savings Plan Management**: Track and manage individual savings goals.
- **👥User Management**: Includes user registration, login, email verification, password reset, and admin functionalities.
- **📱Responsive UI**: Built with Tailwind CSS for a modern and responsive design.

## 🛠️Technologies Used
- **React**: JavaScript library for building the user interface.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Cloudinary**: Cloud storage for uploading and managing images for rotational plans.
- **Gemini API**: Integrated for debt calculation algorithms using JSON format.
- **React Best Practices**: Modular components, custom hooks, and organized folder structure.

## 🛠️ Tech Stack
| Layer         | Technology            |
|---------------|------------------------|
| Frontend      | React.js              |
| Styling       | Tailwind CSS          |
| Media Storage | Cloudinary            |
| AI Integration| Gemini API (Google)   |

## 📂Folder Structure
- `src/components/`: Reusable UI components (e.g., `DebtTable`, `GroupCard`, `MemberSelector`).
- `src/pages/`: Page components for different sections (e.g., `AdminPages`, `GroupPages`, `RotationalPlanPages`).
- `src/hooks/`: Custom hooks for managing state and logic (e.g., `useAuth`, `useDebt`, `useGroup`).
- `src/services/`: API service layer for backend communication (`api.js`).
- `src/styles/`: Global styles (`index.css`).
- `src/utils/`: Utility functions (e.g., `passwordStrength`, `validateForm`).

## 📦Setup Instructions
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Dilusha-Ranasingha/DebtMates-FE.git
   cd DebtMates-FE
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Environment Variables**:
   - Create a `.env` file in the root directory.
   - Add necessary environment variables for API communication and Cloudinary:
     ```
     REACT_APP_API_URL=http://localhost:8080/api
     REACT_APP_CLOUDINARY_URL=<your-cloudinary-url>
     REACT_APP_CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
     REACT_APP_CLOUDINARY_API_KEY=<your-cloudinary-api-key>
     ```
4. **Run the Application**:
   ```bash
   npm start
   ```
   The app will run on `http://localhost:3000`.

## 🔐API Integration
The frontend interacts with the DebtMates backend via the following endpoints:
- **Authentication**:
  - `POST /api/auth/register`: Register a new user.
  - `POST /api/auth/login`: Log in a user.
  - `POST /api/auth/logout`: Log out a user.
  - `POST /api/auth/password-reset/request`: Request a password reset OTP.
  - `POST /api/auth/password-reset/confirm`: Confirm password reset with OTP.
- **Debt Management**:
  - `POST /api/groups/{groupId}/debts`: Record a debt in a group.
  - `GET /api/groups/{groupId}/debts`: Fetch debts for a group.
  - `GET /api/users/me/debts`: Fetch debts for the logged-in user.
- **Rotational Plans**:
  - `POST /api/rotational/groups`: Create a rotational group.
  - `PUT /api/rotational/groups/{groupId}`: Edit a rotational group.
  - `POST /api/rotational/groups/{groupId}/members`: Add members to a rotational group.
  - `POST /api/rotational/groups/{groupId}/plan`: Add a plan to a rotational group.
  - `PUT /api/rotational/payments/{paymentId}/slip`: Upload a payment slip (via Cloudinary).
- **Group Management**:
  - `POST /api/groups`: Create a new group.
  - `PUT /api/groups/{groupId}`: Update a group.
  - `POST /api/groups/{groupId}/members`: Add members to a group.
- **User Management**:
  - `GET /api/user/profile`: Fetch user profile.
  - `PUT /api/user/profile`: Update user profile.
  - `POST /api/user/change-password`: Change user password.
  - `GET /api/user/search`: Search users by username or email.

## Usage
- Navigate to different sections like Debt Management, Rotational Plans, or User Profile.
- Use the debt management feature to input contributions and let the Gemini API calculate debt settlements.
- Upload images for rotational plans, which are stored in Cloudinary and linked in the database.

## 🙌Contributing
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m "Add feature"`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a Pull Request.

## 📄License
This project is licensed under the MIT License.

## 🧰Languages and Tools
<p align="left">
    <img src="https://skillicons.dev/icons?i=react,spring,git,docker,postman,materialui,tailwind,postgres" />
</p>
