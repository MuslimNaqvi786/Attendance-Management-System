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

// User Registration
document.getElementById('user-register-form')?.addEventListener('submit', function (event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;

    let users = getData('users');
    users.push({ username, password, email });
    setData('users', users);

    alert('Registration successful!');
    window.location.href = 'login.html';
});

// User Login
document.getElementById('user-login-form')?.addEventListener('submit', function (event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    let users = getData('users');
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        window.location.href = 'dashboard.html';
    } else {
        alert('Invalid username or password');
    }
});

// User Dashboard
if (window.location.pathname.endsWith('dashboard.html') && localStorage.getItem('loggedInUser')) {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    document.getElementById('username').textContent = user.username;

    //Nav-links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function () {
            document.querySelectorAll('.nav-link').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Set profile picture in navbar
    if (user.profilePicture) {
        document.getElementById('nav-profile-img').src = user.profilePicture;
    }

    const dynamicContent = document.getElementById('dynamic-content');

    function displayContent(contentHtml) {
        dynamicContent.innerHTML = contentHtml;
    }

    document.getElementById('nav-mark-attendance').addEventListener('click', function () {
        displayContent('<button id="mark-attendance">Mark Attendance</button>');

        document.getElementById('mark-attendance').addEventListener('click', function () {
            const date = new Date().toISOString().split('T')[0];

            let attendance = getData('attendance');
            const userAttendance = attendance.find(record => record.username === user.username && record.date === date);

            const popup = document.createElement('div');
            popup.classList.add('popup');

            if (!userAttendance) {
                attendance.push({ username: user.username, date, status: 'present' });
                setData('attendance', attendance);
                popup.textContent = 'Attendance marked!';
                popup.classList.add('success');
            } else {
                popup.textContent = 'Attendance already marked for today';
                popup.classList.add('error');
            }

            document.body.appendChild(popup);
            popup.style.display = 'block';

            setTimeout(() => {
                popup.style.display = 'none';
                document.body.removeChild(popup);
            }, 1000);
        });

    });

    document.getElementById('nav-view-attendance').addEventListener('click', function () {
        const attendance = getData('attendance');
        const userAttendance = attendance.filter(record => record.username === user.username);

        let tableContent = `
            <div class="attendance-records">
                <h2>Attendance Records</h2>
                <table class="styled-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${userAttendance.map(record => `
                            <tr>
                                <td>${record.date}</td>
                                <td>${record.status}</td>
                            </tr>`).join('')}
                    </tbody>
                </table>
            </div>
        `;

        displayContent(tableContent);
    });


    document.getElementById('nav-mark-leave').addEventListener('click', function () {
        displayContent('<div class="styled-filters">' +
            '<form id="leave-request-form">' +
            '<label for="leave-date">Leave Date:</label>' +
            '<input type="date" id="leave-date" name="leave-date" required>' +
            '<button type="submit" class="generate-btn">Send Leave Request</button>' +
            '</form>' +
            '<div id="leave-details">' +
            '<h2>Leave Details</h2>' +
            '</div>' +
            '</div>');


        document.getElementById('leave-request-form').addEventListener('submit', function (event) {
            event.preventDefault();
            const leaveDate = document.getElementById('leave-date').value;

            let leaves = getData('leaves');
            leaves.push({ username: user.username, date: leaveDate, status: 'pending' });
            setData('leaves', leaves);

            alert('Leave request sent!');
            document.getElementById('nav-mark-leave').click(); // Refresh the section to update the leave details table
        });

        const leaves = getData('leaves').filter(leave => leave.username === user.username);
        if (leaves.length > 0) {
            let leaveTable = '<table class="styled-table">' +
                '<thead><tr><th>Date</th><th>Status</th></tr></thead><tbody>';
            leaves.forEach(leave => {
                leaveTable += `<tr>
                                <td data-label="Date">${leave.date}</td>
                                <td data-label="Status">${leave.status}</td>
                              </tr>`;
            });
            leaveTable += '</tbody></table>';

            document.getElementById('leave-details').innerHTML += leaveTable;
        } else {
            document.getElementById('leave-details').innerHTML += '<p>No leave requests found.</p>';
        }
    });


    document.getElementById('nav-profile-picture').addEventListener('click', function () {
        function updateProfileSection() {
            displayContent('<div class="profile-upload-container">' +
                '<label class="custom-file-upload">' +
                '<input type="file" id="profile-picture" accept="image/*">' +
                'Choose File' +
                '</label>' +
                (user.profilePicture ? `<img src="${user.profilePicture}" alt="Profile Picture" class="profile-picture">` : '') +
                '</div>');

            document.getElementById('profile-picture').addEventListener('change', function (event) {
                const file = event.target.files[0];
                const reader = new FileReader();

                reader.onload = function (e) {
                    user.profilePicture = e.target.result;
                    localStorage.setItem('loggedInUser', JSON.stringify(user));
                    let users = getData('users');
                    users = users.map(u => u.username === user.username ? user : u);
                    setData('users', users);
                    alert('Profile picture updated');
                    document.getElementById('nav-profile-img').src = user.profilePicture;
                    updateProfileSection();
                };

                reader.readAsDataURL(file);
            });
        }

        updateProfileSection();
    });

}



