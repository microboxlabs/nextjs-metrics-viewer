### MicroboxLabs Fullstack Challenge: Analytics Metrics Dashboard
This technical test requires you to design and implement an **Analytics Metrics Dashboard** using **Next.js**, **Tailwind CSS**, and **Flowbite**. This system will help MicroboxLabs visualize simple data uploaded by users and generate basic metrics and visualizations.

#### **Before You Begin**
Create a private GitHub repository and invite the provided collaborators: `@korutx`, `@odtorres`. Should you have any questions, contact `devtest@microboxlabs.io`.  
**Title of the project**: Fullstack-Test-(Last Name)

#### **Problem Description**
MicroboxLabs wants a simple analytics solution where users can upload CSV data files and visualize important metrics through charts. The uploaded data will allow the team to generate insights and easily observe trends.

The system will enable **Admin** users to upload CSV data files, and both **Admin** and **Regular** users will be able to view metrics derived from that data.

#### **Core Requirements**
The goal is to create a web application where users can **upload**, **store**, and **visualize** metrics from CSV data. The key features are as follows:

### **User Roles**
1. **Admin User**: 
   - Has access to all features, including uploading CSV files, viewing metrics, and managing data.
2. **Regular User**: 
   - Can only view the metrics and visualizations generated from uploaded data.

### **Features**
1. **Data Upload (Admin Only)**
   - Admin users can upload CSV files that contain simple data. The CSV must have:
     - **Date**: Date of the metric (e.g., `2024-11-01`).
     - **Category**: Category of the data (e.g., Sales, Expenses).
     - **Value**: Numeric value of the metric (e.g., `200`).
      ```csv
      Date,Category,Value
      2024-11-01,Sales,200
      2024-11-01,Expenses,150
      2024-11-02,Sales,300
      2024-11-02,Expenses,100
      2024-11-03,Sales,250
      2024-11-03,Marketing,50
      2024-11-04,Expenses,180
      2024-11-04,Marketing,80
      ```
   - Each uploaded CSV is processed, and its contents are stored in the system.

2. **Viewing Metrics**
   - Users (Admin and Regular) can view metrics in a **dashboard**.
   - The dashboard displays:
     - **Summary Metrics**: Including total, average, maximum, and minimum value for each category.
     - **Time Series Chart**: A line chart showing values over time for each category.
     - **Category Breakdown**: A bar chart comparing values across different categories.

3. **Filtering Data**
   - Users can filter the metrics:
     - **Date Range**: Select a start and end date to filter the data.
     - **Category**: Select specific categories to focus on.
   - Filters should update both summary metrics and visualizations accordingly.

4. **Responsive User Interface**
   - Use **Tailwind CSS** and **Flowbite** components to create a simple and responsive UI.
   - The application should have:
     - A **navbar** to navigate to different parts of the app.
     - A **dashboard** page for viewing metrics.
     - A form/page for **Admin** users to upload CSV data.

5. **Basic Authorization**
   - Admin users should be able to access the upload page, while regular users should not.
   - Both user types can view and interact with the dashboard.

6. **Database**
   - Use a lightweight database (e.g., SQLite) to store data parsed from CSV files.
   - Each data point from the CSV should be stored as a record in the database, with fields for **date**, **category**, and **value**.

### **Use Cases**
1. **Nora Uploads Metrics Data**:
   - Nora logs in as an **Admin** and navigates to the **Data Upload** page.
   - She selects a CSV file containing metrics data and uploads it.
   - The system processes the file, and each data point is stored.

2. **Viewing Metrics**:
   - A **Regular User** logs in and navigates to the **Dashboard**.
   - They see a summary of key metrics, including **total**, **average**, **maximum**, and **minimum** values.
   - They can also see visualizations like a **time series chart** and a **category comparison chart**.

3. **Filtering Metrics**:
   - A user (either Admin or Regular) wants to focus on data from **October 2024** for the **Sales** category.
   - They apply a date range filter for October and select the **Sales** category.
   - The dashboard updates to show the filtered metrics and corresponding charts.

#### **Technologies to Use**
- **Frontend**: Next.js, Tailwind CSS, Flowbite.
- **Backend**: Next.js API routes for handling CSV uploads and serving metrics data.
- **Database**: SQLite or an in-memory solution to store the uploaded data.

#### **Aspects to Be Evaluated**
1. **Functionality**:
   - Does the solution meet all the core requirements?
   - Are users able to upload, view, and filter metrics effectively?
2. **Software Design**: 
   - Logical organization of files, components, and API routes.
   - Clean separation between frontend and backend logic.
3. **Code Quality**:
   - Readable, maintainable code with clear comments.
   - Good use of modern JavaScript and TypeScript features.
4. **Testing**:
   - Simple unit tests for API routes.
   - Basic UI tests for metrics viewing and filtering.
5. **UI/UX**:
   - Effective use of **Tailwind CSS** and **Flowbite** to create a user-friendly, clean, and responsive interface.

#### **Aspects to Ignore**
- **Advanced Visual Design**: Focus on functionality rather than intricate visual styling.
- **Scalability and Performance Optimization**: The emphasis is on demonstrating core capabilities, not handling massive volumes of data.

#### **Optional Bonus Points**
- **Role-Based Authentication**: Implement simple role-based access control for Admin vs. Regular User capabilities.
- **Real-Time Updates**: Add functionality for real-time updates using Server-Sent Events (SSE) or WebSockets.

#### **Getting Started**
1. **Fork/Clone** the repository.
2. Set up the project using **Next.js**, **Tailwind CSS**, and **Flowbite**.
3. Implement the **Analytics Metrics Dashboard** scenario as described.
4. Use any tools or resources, including AI (e.g., ChatGPT or GitHub Copilot), to assist you.

This challenge is designed to test your ability to work on a small fullstack application with a focus on data handling, metrics generation, and visualization. We look forward to seeing how you solve this challenge!
