// assets/js/main.js
// Light client-side JS for demo. Loads projects via API.
fetch('api/get_projects.php')
  .then(r => r.json())
  .then(data => {
    console.log('Projects', data);
    // you can render into UI if desired
  })
  .catch(e => console.error(e));
function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem("token", data.token);
            window.location.href = "index.html";
        } else {
            document.getElementById("msg").innerText = "Invalid Login!";
        }
    });
  }
  app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    const sql = "SELECT * FROM users WHERE username=? AND password=?";
    db.query(sql, [username, password], (err, result) => {
        if (err) return res.json({ success: false });

        if (result.length > 0) {
            res.json({ success: true, token: "auth123" });
        } else {
            res.json({ success: false });
        }
    });
});
// Fetch all drivers
function loadDrivers() {
    fetch("/api/drivers")
    .then(res => res.json())
    .then(data => {
        if (document.getElementById("driverSelect")) {
            let select = document.getElementById("driverSelect");
            data.forEach(d => {
                let opt = document.createElement("option");
                opt.value = d.id;
                opt.innerHTML = d.name;
                select.appendChild(opt);
            });
        }

        if (document.getElementById("driverTable")) {
            let table = document.getElementById("driverTable");
            data.forEach(d => {
                table.innerHTML += `<tr><td>${d.id}</td><td>${d.name}</td><td>${d.phone}</td><td>${d.vehicle}</td></tr>`;
            });
        }
    });
}

// Add Driver
function addDriver() {
    fetch("/api/drivers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: document.getElementById("name").value,
            phone: document.getElementById("phone").value,
            vehicle: document.getElementById("vehicle").value
        })
    }).then(() => location.reload());
}

// Mark Attendance
function markAttendance() {
    fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            driverId: document.getElementById("driverSelect").value
        })
    }).then(() => alert("Attendance Marked"));
}

// Load attendance
function loadAttendance() {
    fetch("/api/attendance")
    .then(res => res.json())
    .then(data => {
        let table = document.getElementById("attendanceTable");
        data.forEach(a => {
            table.innerHTML += `<tr><td>${a.id}</td><td>${a.driverName}</td><td>${a.date}</td></tr>`;
        });
    });
}

window.onload = () => {
    if (document.getElementById("driverTable") || document.getElementById("driverSelect")) {
        loadDrivers();
    }
    if (document.getElementById("attendanceTable")) {
        loadAttendance();
    }
};
