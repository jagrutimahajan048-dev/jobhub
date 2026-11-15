
let jobs = [
    {id:1, title:"Java Developer", company:"TCS", category:"IT", location:"Bangalore"},
    {id:2, title:"System Engineer", company:"Infosys", category:"IT", location:"Pune"},
    {id:3, title:"Software Developer", company:"Wipro", category:"IT", location:"Hyderabad"},
    {id:4, title:"Relationship Manager", company:"HDFC Bank", category:"Banking", location:"Mumbai"},
    {id:5, title:"Marketing Executive", company:"Amazon", category:"Marketing", location:"Delhi"},
    {id:6, title:"Sales Executive", company:"Google", category:"Sales", location:"Pune"},
    {id:7, title:"Accountant", company:"Accenture", category:"Finance", location:"Mumbai"},
    {id:8, title:"Web Designer", company:"Microsoft", category:"Design", location:"Bangalore"}
];

// Display jobs
function displayJobs(list) {

    let output = "";

    list.forEach(job => {

        output += `
        <div class="job-card">
            <h3>${job.title}</h3>
            <p>Company: ${job.company}</p>
            <p>Category: ${job.category}</p>
            <p>📍 ${job.location || "India"}</p>
            <button onclick="applyJob(${job.id})">
                Apply Now
            </button>
        </div>
        `;

    });

    document.getElementById("jobList").innerHTML =
        output || "<p>No jobs found!</p>";
}

// Show all jobs
function showJobs() {
    displayJobs(jobs);
}

// Search jobs
function searchJobs() {

    let value = document.getElementById("search")
        .value.toLowerCase().trim();

    let result = jobs.filter(job =>
        job.title.toLowerCase().includes(value) ||
        job.company.toLowerCase().includes(value) ||
        job.category.toLowerCase().includes(value)
    );

    displayJobs(result);
}

// Category filter
function filterJobs(category) {

    let result = jobs.filter(job =>
        job.category === category
    );

    displayJobs(result);

    document.getElementById("jobs")
        .scrollIntoView({behavior:"smooth"});
}

// Apply for job
function applyJob(id) {

    let job = jobs.find(j => j.id === id);

    if (!job) return;

    let name = prompt("Enter your full name:");

    if (!name || !name.trim()) {
        alert("Please enter your name");
        return;
    }

    let applications =
        JSON.parse(localStorage.getItem("applications")) || [];

    applications.push({
        name:name,
        job:job.title,
        company:job.company
    });

    localStorage.setItem(
        "applications",
        JSON.stringify(applications)
    );

    alert("Application submitted successfully!");
}

// Register
function register() {

    let name = document.getElementById("regName").value.trim();
    let email = document.getElementById("regEmail").value.trim();
    let password = document.getElementById("regPassword").value;

    if (!name || !email || !password) {
        alert("Please fill all fields");
        return;
    }

    if (password.length < 6) {
        alert("Password must be at least 6 characters");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.some(u => u.email === email)) {
        alert("Email already registered");
        return;
    }

    users.push({name, email, password});

    localStorage.setItem("users", JSON.stringify(users));

    alert("Registration successful!");
}

// Login
function login() {

    let email = document.getElementById("loginEmail").value.trim();
    let password = document.getElementById("loginPassword").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    let user = users.find(u =>
        u.email === email && u.password === password
    );

    if (user) {
        alert("Welcome " + user.name);
    } else {
        alert("Invalid email or password");
    }
}

// Post a job
function postJob() {

    let title = document.getElementById("jobTitle").value.trim();
    let company = document.getElementById("jobCompany").value.trim();
    let category = document.getElementById("jobCategory").value;

    if (!title || !company) {
        alert("Please fill all fields");
        return;
    }

    let newJob = {
        id: Date.now(),
        title:title,
        company:company,
        category:category,
        location:"India"
    };

    jobs.push(newJob);

    alert("Job posted successfully!");

    showJobs();

    document.getElementById("jobTitle").value = "";
    document.getElementById("jobCompany").value = "";
}

// Initial display
showJobs();
