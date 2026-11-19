const jobs = [
    {id:1, company:"TCS", logo:"https://commons.wikimedia.org/wiki/Special:FilePath/Tcs-logo-1.svg", title:"Software Developer", category:"IT", location:"Indore", salary:"3 - 5 LPA", type:"Full Time"},
    {id:2, company:"HCLTech", logo:"https://commons.wikimedia.org/wiki/Special:FilePath/HCLTech-new-logo.svg", title:"Web Developer", category:"IT", location:"Pune", salary:"3 - 6 LPA", type:"Full Time"},
    {id:3, company:"Infosys", logo:"https://commons.wikimedia.org/wiki/Special:FilePath/Infosys_logo.svg", title:"Java Developer", category:"IT", location:"Bangalore", salary:"4 - 7 LPA", type:"Full Time"},
    {id:4, company:"Wipro", logo:"https://www.google.com/s2/favicons?domain=wipro.com&sz=128", title:"HR Executive", category:"HR", location:"Mumbai", salary:"3 - 4 LPA", type:"Full Time"},
    {id:5, company:"Accenture", logo:"https://www.google.com/s2/favicons?domain=accenture.com&sz=128", title:"Digital Marketing Executive", category:"Marketing", location:"Hyderabad", salary:"3 - 5 LPA", type:"Full Time"},
    {id:6, company:"HDFC Bank", logo:"https://commons.wikimedia.org/wiki/Special:FilePath/HDFC%20Bank%20Logo.svg", title:"Finance Executive", category:"Finance", location:"Indore", salary:"3 - 5 LPA", type:"Full Time"},
    {id:7, company:"Microsoft", logo:"https://www.google.com/s2/favicons?domain=microsoft.com&sz=128", title:"IT Support Engineer", category:"IT", location:"Delhi", salary:"4 - 6 LPA", type:"Full Time"},
    {id:8, company:"Google", logo:"https://www.google.com/s2/favicons?domain=google.com&sz=128", title:"Graphic Designer", category:"Design", location:"Remote", salary:"3 - 5 LPA", type:"Remote"},
    {id:9, company:"Flipkart", logo:"https://commons.wikimedia.org/wiki/Special:FilePath/Flipkart%20logo%20%282026%29.svg", title:"Sales Executive", category:"Sales", location:"Bhopal", salary:"2 - 4 LPA", type:"Full Time"}
];  

function getUsers() {
    return JSON.parse(localStorage.getItem("jobhubUsers") || "[]");
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem("jobhubUser") || "null");
}

function displayJobs(list) {
    const container = document.getElementById("jobsContainer");
    const noJobs = document.getElementById("noJobs");

    container.innerHTML = "";

    if (list.length === 0) {
        noJobs.style.display = "block";
        return;
    }

    noJobs.style.display = "none";

    list.forEach(job => {
        const card = document.createElement("div");
        card.className = "job-card";

        card.innerHTML = `
            <div class="job-top">
                <div class="company-logo">
                    <img src="${job.logo}" alt="${job.company}"
                    onerror="this.style.display='none';this.parentElement.innerHTML='<i class=\\'fa-solid fa-building\\'></i>'">
                </div>
                <div>
                    <div class="company-name">${job.company}</div>
                    <span class="job-type">${job.type}</span>
                </div>
            </div>
            <h3>${job.title}</h3>
            <div class="job-info">
                <span><i class="fa-solid fa-location-dot"></i> ${job.location}</span>
                <span><i class="fa-solid fa-wallet"></i> ${job.salary}</span>
                <span><i class="fa-solid fa-briefcase"></i> ${job.category}</span>
            </div>
            <button class="apply-btn" onclick="applyJob(${job.id})">
                Apply Now <i class="fa-solid fa-arrow-right"></i>
            </button>
        `;
        container.appendChild(card);
    });
}

function searchJobs() {
    const keyword = document.getElementById("searchInput").value.toLowerCase().trim();
    const location = document.getElementById("locationInput").value.toLowerCase().trim();

    const result = jobs.filter(job =>
        (job.title.toLowerCase().includes(keyword) ||
         job.company.toLowerCase().includes(keyword) ||
         job.category.toLowerCase().includes(keyword)) &&
        job.location.toLowerCase().includes(location)
    );

    displayJobs(result);
    document.getElementById("jobs").scrollIntoView({behavior:"smooth"});
}

function filterCategory(category) {
    const result = jobs.filter(job => job.category === category);
    displayJobs(result);
    document.getElementById("jobs").scrollIntoView({behavior:"smooth"});
}

function showAllJobs() {
    document.getElementById("searchInput").value = "";
    document.getElementById("locationInput").value = "";
    displayJobs(jobs);
}

function openModal(id) {
    document.getElementById(id).style.display = "flex";
}

function closeModal(id) {
    document.getElementById(id).style.display = "none";
}

function switchModal(closeId, openId) {
    closeModal(closeId);
    openModal(openId);
}

function registerUser(event) {
    event.preventDefault();

    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim().toLowerCase();
    const password = document.getElementById("registerPassword").value;

    if (!name || !email || password.length < 6) {
        alert("Please enter valid details. Password must have at least 6 characters.");
        return;
    }

    const users = getUsers();

    if (users.some(user => user.email === email)) {
        alert("This email is already registered. Please login.");
        return;
    }

    users.push({name, email, password});
    localStorage.setItem("jobhubUsers", JSON.stringify(users));

    localStorage.setItem("jobhubUser", JSON.stringify({name, email}));

    document.getElementById("registerForm").reset();
    closeModal("registerModal");

    updateNavigation();
    displayApplications();

    alert("Registration successful! Welcome " + name);
}

function loginUser(event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;

    const user = getUsers().find(item =>
        item.email === email && item.password === password
    );

    if (!user) {
        alert("Invalid email or password. Please register first.");
        return;
    }

    localStorage.setItem("jobhubUser", JSON.stringify({
        name: user.name,
        email: user.email
    }));

    document.getElementById("loginForm").reset();
    closeModal("loginModal");

    updateNavigation();
    displayApplications();

    alert("Login successful! Welcome " + user.name);
}

function logoutUser() {
    localStorage.removeItem("jobhubUser");
    updateNavigation();
    displayApplications();
    alert("You have logged out.");
}

function updateNavigation() {
    const user = getCurrentUser();

    document.getElementById("navButtons").style.display = user ? "none" : "flex";
    document.getElementById("userArea").style.display = user ? "flex" : "none";

    document.getElementById("welcomeUser").textContent =
        user ? "Hi, " + user.name : "";
}

function applyJob(id) {
    const user = getCurrentUser();

    if (!user) {
        alert("Please login before applying.");
        openModal("loginModal");
        return;
    }

    const job = jobs.find(item => item.id === id);
    let applications = JSON.parse(localStorage.getItem("jobhubApplications") || "[]");

    const alreadyApplied = applications.some(item =>
        item.id === id && item.email === user.email
    );

    if (alreadyApplied) {
        alert("You have already applied for this job.");
        return;
    }

    applications.push({
        id: job.id,
        title: job.title,
        company: job.company,
        email: user.email
    });

    localStorage.setItem("jobhubApplications", JSON.stringify(applications));

    alert("Application submitted successfully!");
    displayApplications();
}

function displayApplications() {
    const list = document.getElementById("applicationsList");
    const user = getCurrentUser();

    list.innerHTML = "";

    if (!user) {
        list.innerHTML = "<p>Please login to see your applications.</p>";
        return;
    }

    const applications = JSON.parse(localStorage.getItem("jobhubApplications") || "[]");
    const userApplications = applications.filter(item => item.email === user.email);

    if (userApplications.length === 0) {
        list.innerHTML = "<p>You have not applied for any jobs yet.</p>";
        return;
    }

    userApplications.forEach(item => {
        list.innerHTML += `
            <div class="application-item">
                <h3>${item.title}</h3>
                <p><i class="fa-solid fa-building"></i> ${item.company}</p>
                <p><i class="fa-solid fa-circle-check"></i> Application Submitted</p>
            </div>
        `;
    });
}

function toggleMenu() {
    document.getElementById("navLinks").classList.toggle("show");
}

// Form event listeners
document.getElementById("registerForm").addEventListener("submit", registerUser);
document.getElementById("loginForm").addEventListener("submit", loginUser);

// Close modal when clicking outside the form box
document.querySelectorAll(".modal").forEach(modal => {
    modal.addEventListener("click", function(event) {
        if (event.target === modal) {
            closeModal(modal.id);
        }
    });
});

// Initial website setup
displayJobs(jobs);
updateNavigation();
displayApplications();