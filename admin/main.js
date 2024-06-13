//Animations
const inputs = document.querySelectorAll(".input");


function addcl() {
    let parent = this.parentNode.parentNode;
    parent.classList.add("focus");
}

function remcl() {
    let parent = this.parentNode.parentNode;
    if (this.value == "") {
        parent.classList.remove("focus");
    }
}


inputs.forEach(input => {
    input.addEventListener("focus", addcl);
    input.addEventListener("blur", remcl);
});


// Utility Functions
function getData(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

function setData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Admin Login
document.getElementById('admin-login-form')?.addEventListener('submit', function (event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === 'admin' && password === 'admin123') {
        window.location.href = 'dashboard.html';
    } else {
        alert('Invalid admin credentials');
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const dynamicContent = document.getElementById('dynamic-content');

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function () {
            document.querySelectorAll('.nav-link').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });

    document.getElementById('view-users').addEventListener('click', function () {
        const users = getData('users');
        displayContent('<h2>Users List</h2>' +
            '<div class="users-list">' +
            users.map(user =>
                `<div class="user-card">
                    <img src="${user.profilePicture}" alt="${user.username}" class="profile-picture">
                    <p>${user.username}</p>
                    <button class="delete-user" data-username="${user.username}">Delete</button>
                </div>`
            ).join('') +
            '</div>');

        // Add event listener for delete buttons
        document.querySelectorAll('.delete-user').forEach(button => {
            button.addEventListener('click', function () {
                const username = this.getAttribute('data-username');
                if (confirm(`Are you sure you want to delete user "${username}"?`)) {
                    let users = getData('users');
                    users = users.filter(user => user.username !== username);
                    setData('users', users);
                    alert(`User "${username}" has been deleted.`);
                    document.getElementById('view-users').click(); // Refresh the user list
                }
            });
        });
    });



    document.getElementById('generate-report').addEventListener('click', function () {
        const users = getData('users');
        const userOptions = users.map(user => `<option value="${user.username}">${user.username}</option>`).join('');

        displayContent('<div id="report-filters" class="styled-filters">' +
            '<h2>Generate Report</h2>' +
            '<label for="user-select">Select User:</label>' +
            '<select id="user-select">' +
            '<option value="all">All Users</option>' +
            userOptions +
            '</select>' +
            '<label for="from-date">From:</label>' +
            '<input type="date" id="from-date" name="from-date">' +
            '<label for="to-date">To:</label>' +
            '<input type="date" id="to-date" name="to-date">' +
            '<button id="generate" class="generate-btn">Generate</button>' +
            '</div>');

        document.getElementById('generate').addEventListener('click', function () {
            const selectedUser = document.getElementById('user-select').value;
            const fromDate = document.getElementById('from-date').value;
            const toDate = document.getElementById('to-date').value;
            const attendance = getData('attendance');

            const filteredAttendance = attendance.filter(record => record.date >= fromDate && record.date <= toDate &&
                (selectedUser === 'all' || record.username === selectedUser));

            let table = '<div class="attendance-report">' +
                '<h2>Attendance Report</h2>' +
                '<table class="styled-table">' +
                '<thead><tr><th>Username</th><th>Date</th><th>Status</th><th>Grade</th></tr></thead><tbody>';

            filteredAttendance.forEach(record => {
                const userAttendance = attendance.filter(att => att.username === record.username && att.status === 'present').length;
                let grade;
                if (userAttendance >= 26) {
                    grade = 'A';
                } else if (userAttendance >= 20) {
                    grade = 'B';
                } else if (userAttendance >= 15) {
                    grade = 'C';
                } else {
                    grade = 'D';
                }

                table += `<tr>
                            <td>${record.username}</td>
                            <td>${record.date}</td>
                            <td>${record.status}</td>
                            <td>${grade}</td>
                          </tr>`;
            });

            table += '</tbody></table></div>';

            displayContent(table);
        });
    });


    document.getElementById('view-records').addEventListener('click', function () {
        const attendance = getData('attendance');
        const users = getData('users');

        let table = '<table><tr><th>Profile Picture</th><th>Username</th><th>Date</th><th>Status</th><th>Grade</th><th>Actions</th></tr>';
        attendance.forEach(record => {
            const user = users.find(user => user.username === record.username);
            const userAttendance = attendance.filter(att => att.username === record.username && att.status === 'present').length;
            let grade;
            if (userAttendance >= 26) {
                grade = 'A';
            } else if (userAttendance >= 20) {
                grade = 'B';
            } else if (userAttendance >= 15) {
                grade = 'C';
            } else {
                grade = 'D';
            }

            const profilePicture = user && user.profilePicture ? user.profilePicture : 'placeholder.jpg'; // Provide a placeholder image URL if profilePicture is undefined
            const profileImage = user && user.profilePicture ? `<img src="${profilePicture}" alt="Profile Picture" class="profile-picture">` : 'Not Found';

            table += `<tr><td>${profileImage}</td><td>${record.username}</td><td>${record.date}</td><td>${record.status}</td><td>${grade}</td><td><button class="color-button" onclick="editRecord('${record.username}', '${record.date}')">Edit</button> <button class="red-button" onclick="deleteRecord('${record.username}', '${record.date}')">Delete</button></td></tr>`;
        });
        table += '</table>';

        displayContent(table);
    });


    document.getElementById('generate-system-report').addEventListener('click', function () {
        displayContent('<div id="system-report-filters" class="styled-filters">' +
            '<h2>Generate System Report</h2>' +
            '<label for="system-from-date">From:</label>' +
            '<input type="date" id="system-from-date" name="system-from-date">' +
            '<label for="system-to-date">To:</label>' +
            '<input type="date" id="system-to-date" name="system-to-date">' +
            '<button id="generate-system" class="generate-btn">Generate System Report</button>' +
            '</div>');

        document.getElementById('generate-system').addEventListener('click', function () {
            const fromDate = new Date(document.getElementById('system-from-date').value);
            const toDate = new Date(document.getElementById('system-to-date').value);
            const attendance = getData('attendance');
            const leaves = getData('leaves');

            const filteredAttendance = attendance.filter(record => new Date(record.date) >= fromDate && new Date(record.date) <= toDate);
            const filteredLeaves = leaves.filter(record => new Date(record.date) >= fromDate && new Date(record.date) <= toDate);

            const totalDays = (toDate - fromDate) / (1000 * 60 * 60 * 24) + 1; // Total number of days in the date range

            let reportTable = '<div class="system-report">' +
                '<h2>System Report</h2>' +
                `<p>Report From ${fromDate.toISOString().split('T')[0]} To ${toDate.toISOString().split('T')[0]}</p>` +
                '<table class="styled-table">' +
                '<thead><tr><th>Username</th><th>Days Present</th><th>Days on Leave</th><th>Days Absent</th><th>Grade</th></tr></thead><tbody>';

            const users = [...new Set(filteredAttendance.map(record => record.username))];

            users.forEach(username => {
                const userAttendance = filteredAttendance.filter(att => att.username === username);
                const userPresentCount = userAttendance.length;
                const userLeaveCount = filteredLeaves.filter(leave => leave.username === username).length;
                const userAbsentCount = totalDays - userPresentCount - userLeaveCount;

                let grade;
                const grades = JSON.parse(localStorage.getItem('grades')) || { gradeA: 26, gradeB: 20, gradeC: 15, gradeD: 10 };
                if (userPresentCount >= grades.gradeA) {
                    grade = 'A';
                } else if (userPresentCount >= grades.gradeB) {
                    grade = 'B';
                } else if (userPresentCount >= grades.gradeC) {
                    grade = 'C';
                } else {
                    grade = 'D';
                }

                reportTable += `<tr>
                                  <td>${username}</td>
                                  <td>${userPresentCount}</td>
                                  <td>${userLeaveCount}</td>
                                  <td>${userAbsentCount}</td>
                                  <td>${grade}</td>
                                </tr>`;
            });

            reportTable += '</tbody></table></div>';

            displayContent(reportTable);
        });
    });



    document.getElementById('leave-approvals').addEventListener('click', function () {
        const leaves = getData('leaves');
        const users = getData('users');

        let table = '<table><tr><th>Profile Picture</th><th>Username</th><th>Date</th><th>Status</th><th>Actions</th></tr>';
        leaves.forEach(leave => {
            const user = users.find(user => user.username === leave.username);
            const profilePicture = user && user.profilePicture ? user.profilePicture : 'placeholder.jpg'; // Provide a placeholder image URL if profilePicture is undefined
            const profileImage = user && user.profilePicture ? `<img src="${profilePicture}" alt="Profile Picture" class="profile-picture">` : 'Not Found';

            table += `<tr><td>${profileImage}</td><td>${leave.username}</td><td>${leave.date}</td><td>${leave.status}</td><td><button class="color-button" onclick="approveLeave('${leave.username}', '${leave.date}')">Approve</button> <button class="red-button" onclick="rejectLeave('${leave.username}', '${leave.date}')">Reject</button></td></tr>`;
        });
        table += '</table>';

        displayContent(table);
    });


    document.getElementById('view-grading-system').addEventListener('click', function () {
        const grades = JSON.parse(localStorage.getItem('grades')) || { gradeA: 26, gradeB: 20, gradeC: 15, gradeD: 10 };

        displayContent('<div id="grade-settings" class="styled-filters">' +
            '<h2>Grading System</h2>' +
            `<label for="grade-A">Days for A grade:</label><input type="number" id="grade-A" name="grade-A" value="${grades.gradeA}">` +
            `<label for="grade-B">Days for B grade:</label><input type="number" id="grade-B" name="grade-B" value="${grades.gradeB}">` +
            `<label for="grade-C">Days for C grade:</label><input type="number" id="grade-C" name="grade-C" value="${grades.gradeC}">` +
            `<label for="grade-D">Days for D grade:</label><input type="number" id="grade-D" name="grade-D" value="${grades.gradeD}">` +
            '<button id="save-grade-settings" class="generate-btn">Save Settings</button>' +
            '</div>');

        document.getElementById('save-grade-settings').addEventListener('click', function () {
            const gradeA = document.getElementById('grade-A').value;
            const gradeB = document.getElementById('grade-B').value;
            const gradeC = document.getElementById('grade-C').value;
            const gradeD = document.getElementById('grade-D').value;

            const grades = { gradeA, gradeB, gradeC, gradeD };
            localStorage.setItem('grades', JSON.stringify(grades));

            alert('Grading system updated!');
        });
    });

    function displayContent(contentHtml) {
        dynamicContent.innerHTML = contentHtml;
    }
});

function editRecord(username, date) {
    const newStatus = prompt(`Enter new status for ${username} on ${date}:`);
    if (newStatus) {
        let attendance = getData('attendance');
        attendance = attendance.map(record => (record.username === username && record.date === date) ? { ...record, status: newStatus } : record);
        setData('attendance', attendance);
        alert('Record updated!');
        document.getElementById('view-records').click(); // Refresh the table
    }
}

function deleteRecord(username, date) {
    if (confirm(`Are you sure you want to delete the record of ${username} on ${date}?`)) {
        let attendance = getData('attendance');
        attendance = attendance.filter(record => !(record.username === username && record.date === date));
        setData('attendance', attendance);
        alert('Record deleted!');
        document.getElementById('view-records').click(); // Refresh the table
    }
}

function approveLeave(username, date) {
    updateLeaveStatus(username, date, 'Approved');
}

function rejectLeave(username, date) {
    updateLeaveStatus(username, date, 'Rejected');
}

function updateLeaveStatus(username, date, status) {
    let leaves = getData('leaves');
    leaves = leaves.map(leave => (leave.username === username && leave.date === date) ? { ...leave, status } : leave);
    setData('leaves', leaves);
    alert(`Leave request ${status}!`);
    document.getElementById('leave-approvals').click(); // Refresh the table
}
