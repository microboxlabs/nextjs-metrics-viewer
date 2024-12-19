
# Metrics Dashboard Project Documentation  

## General Overview  
This project is a web application developed with **Next.js**, **Tailwind CSS**, and **Flowbite** that enables:  
- **User authentication** with **Admin** and **Regular** roles.  
- **CSV file uploads** for processing metrics.  
- **Advanced metrics visualization** and **interactive charts** on a **Dashboard**.  
- Robust security, strict validations, and a modern, responsive interface.  

The application has been designed to ensure **efficiency**, **security**, and an excellent **user experience**.  

---

## Key Features  

### 1. Authentication and Authorization  
- **Login**:  
  - Strict email validation (valid format required).  
  - Secure password requirements:  
    - Minimum 8 characters.  
    - At least one uppercase letter, one lowercase letter, one number, and one special symbol.  
  - Mandatory password confirmation during registration.  
- **User Roles**:  
  - **Admin**: Access to the Dashboard and CSV upload page.  
  - **Regular User**: Limited access to the Dashboard.  
- **Authorization Middleware**:  
  - Protects sensitive routes based on user role.  
  - Redirects to `/login` if the user is not authenticated.  
  - Redirects to `/403` if the user is unauthorized.  
- **Session Expiration Modal**:  
  - Displays when the session has expired, offering options to renew or log out.  

---

### 2. CSV File Upload  
- **Admin-only functionality**.  
- **File validation**:  
  - Required `.csv` extension.  
  - Expected structure: columns `Date`, `Category`, `Value`.  
- **FormData** is used to send files to the backend.  
- **Loading spinner** to indicate progress.  
- Clear **success** and **error messages**.  

---

### 3. Metrics Dashboard  
- **Functional Filters**:  
  - Date range selection (`startDate` and `endDate`).  
  - Category filtering.  
- **Summary Section**:  
  - Calculation of advanced metrics:  
    - Total, Average, Maximum, Minimum, Median.  
- **Interactive Charts**:  
  - **BarChart**: Data distribution by category in bar format.  
  - **PieChart**: Proportion of values in circular format.  
  - **RadarChart**: Comparison of metrics in a radial format.  
  - **TimeSeriesChart**: Trends of values over time.  
- **Session Expiration Modal**:  
  - Notification when the session expires.  

---

### 4. Design and Usability  
- Modern, **responsive interface** built with **Tailwind CSS**.  
- **Navbar** with navigation control based on user roles.  
- Professional, responsive **footer**.  
- **Dark Mode** *(optional)*: Planned for future implementation.  

---

### 5. Backend  
- Fully configured **SQLite database**.  
- Prevention of duplicate entries when inserting metrics.  
- Robust validations for data sent through the **CSV file**.  

---

## Installation and Setup  

### Prerequisites  
- **Node.js** v14 or higher.  
- **NPM** or **Yarn**.  

### Project Installation  
1. Clone the repository:  
   git clone https://github.com/Britoshky/nextjs-metrics-viewer  
   cd project-dashboard  
2. Install dependencies:  
   npm run install:all
3. Run the development server:  
   npm run dev  

---

## Available Commands  

| Command               | Description                                  |  
|-----------------------|----------------------------------------------|  
| `npm run dev`         | Starts the project in development mode.      |  
| `npm run build`       | Creates an optimized build for production.   |  
| `npm start`           | Starts the project in production mode.       |  
| `npm run lint`        | Runs ESLint to detect syntax errors.         |  
| `npm run format`      | Formats the code using Prettier.             |  
| `npm run test`        | Runs unit tests and backend validations.     |  
| `npm run typecheck`   | Verifies types throughout the project.       |  
| `npm run install:all` | Installs dependencies for both the main      |
|                         project and the WebSocket server.            | 

---

## Application Usage  

1. **Authentication**:  
   - Go to the login page (`/login`).  
   - Register if you do not have an account.  
   - Log in with a valid email and password.  

2. **CSV File Upload (Admins)**:  
   - Navigate to the **Upload CSV** page.  
   - Select and upload a valid `.csv` file.  

3. **Metrics Visualization**:  
   - Filter by dates or categories.  
   - View advanced metrics and interactive charts.  

4. **Session Expiration Modal**:  
   - Renew or log out when the session expires.  

---

## Future Improvements  

- Optimize security with token handling and protection against **CSRF/XSS**.  
- Implement a complete **Dark Mode**.  
- Add more interactivity to the charts.  
- Expand unit test coverage and additional backend validations *(already initiated in `npm run test`)*.  
