Phase 1: Project Setup
    1. Project Structure:
        ◦ Create the project directory with the necessary subdirectories (user, admin, css, js).
    2. Basic HTML Templates:
        ◦ Create index.html as the landing page.
        ◦ Create login.html and register.html for user authentication.
        ◦ Create dashboard.html for the user dashboard.
        ◦ Create login.html for the admin login.
        ◦ Create dashboard.html for the admin dashboard.
Phase 2: User Authentication
    1. User Registration:
        ◦ Create the user registration form in register.html.
        ◦ Implement the registration logic in JavaScript (main.js).
        ◦ Store user data in localStorage.
    2. User Login:
        ◦ Create the user login form in login.html.
        ◦ Implement the login logic in JavaScript (main.js).
        ◦ Validate user credentials and redirect to the user dashboard.
Phase 3: User Dashboard
    1. Mark Attendance:
        ◦ Create buttons for marking attendance, viewing attendance, and marking leave in dashboard.html.
        ◦ Implement attendance marking logic in JavaScript (main.js).
        ◦ Store attendance data in localStorage.
    2. View Attendance:
        ◦ Implement logic to view attendance records for the logged-in user.
        ◦ Display attendance records in a readable format.
    3. Mark Leave:
        ◦ Create a form for leave requests in dashboard.html.
        ◦ Implement leave request logic in JavaScript (main.js).
        ◦ Store leave requests in localStorage.
    4. Edit Profile Picture:
        ◦ Implement logic to upload and update profile pictures.
        ◦ Store profile pictures in localStorage.
Phase 4: Admin Dashboard
    1. Admin Login:
        ◦ Create the admin login form in login.html.
        ◦ Implement admin login logic in JavaScript (main.js).
        ◦ Admin Username : admin, Password : admin123.
    2. View Users:
        ◦ Implement logic to view all registered users.
        ◦ Display the list of users in a readable format.
    3. Generate Reports:
        ◦ Create a form to filter attendance records by date in dashboard.html.
        ◦ Implement logic to generate attendance reports based on the selected date range.
    4. Leave Approvals:
        ◦ Implement logic to view and approve leave requests.
        ◦ Display leave requests and update their status.
Phase 5: Additional Features
    1. Attendance Reports:
        ◦ Implement logic to generate detailed attendance reports.
        ◦ Include counts for leaves, presents, absents, etc.
    2. Grading System:
        ◦ Implement a grading system based on attendance.
        ◦ Define criteria for assigning grades (e.g., 26 days = A grade).
Phase 6: Testing and Debugging
    1. Test Functionality:
        ◦ Thoroughly test all features to ensure they work as expected.
        ◦ Fix any bugs or issues that arise during testing.