/*
 * JobHub academic frontend demonstration.
 * No real authentication, user registration, or employer application submission.
 * Never enter personal or confidential information on this demo site.
 */

const jobs = [
    {id:1, company:"TCS", initials:"TCS", title:"Software Developer", category:"IT", location:"Indore", salary:"3 - 5 LPA", type:"Sample Full Time"},
    {id:2, company:"HCLTech", initials:"HCL", title:"Web Developer", category:"IT", location:"Pune", salary:"3 - 6 LPA", type:"Sample Full Time"},
    {id:3, company:"Infosys", initials:"INF", title:"Java Developer", category:"IT", location:"Bangalore", salary:"4 - 7 LPA", type:"Sample Full Time"},
    {id:4, company:"Wipro", initials:"WIP", title:"HR Executive", category:"HR", location:"Mumbai", salary:"3 - 4 LPA", type:"Sample Full Time"},
    {id:5, company:"Accenture", initials:"ACC", title:"Digital Marketing Executive", category:"Marketing", location:"Hyderabad", salary:"3 - 5 LPA", type:"Sample Full Time"},
    {id:6, company:"HDFC Bank", initials:"HDFC", title:"Finance Executive", category:"Finance", location:"Indore", salary:"3 - 5 LPA", type:"Sample Full Time"},
    {id:7, company:"Microsoft", initials:"MS", title:"IT Support Engineer", category:"IT", location:"Delhi", salary:"4 - 6 LPA", type:"Sample Full Time"},
    {id:8, company:"Google", initials:"G", title:"Graphic Designer", category:"Design", location:"Remote", salary:"3 - 5 LPA", type:"Sample Remote"},
    {id:9, company:"Flipkart", initials:"FK", title:"Sales Executive", category:"Sales", location:"Bhopal", salary:"2 - 4 LPA", type:"Sample Full Time"}
];

const SESSION_USER_KEY = "jobhubDemoUser";
const SESSION_APPS_KEY = "jobhubDemoApplications";

function getCurrentUser() {
    return sessionStorage.getItem(SESSION_USER_KEY) === "yes"
        ? {name: "Demo User"}
        : null;
}

function getApplications() {
    try {
        const value = JSON.parse(sessionStorage.getItem(SESSION_APPS_KEY) || "[]");
        return Array.isArray(value) ? value : [];
    } catch {
        return [];
    }
}

function displayJobs(list) {
    const container = document.getElementById("jobsContainer");
    const noJobs = document.getElementById("noJobs");
    if (!container || !noJobs) return;

    container.replaceChildren();

    if (list.length === 0) {
        noJobs.style.display = "block";
        return;
    }
    noJobs.style.display = "none";

    list.forEach(job => {
        const card = document.createElement("div");
        card.className = "job-card";

        const top = document.createElement("div");
        top.className = "job-top";

        const logo = document.createElement("div");
        logo.className = "company-logo";
        logo.textContent = job.initials;
        logo.setAttribute("aria-label", job.company + " sample listing");

        const companyInfo = document.createElement("div");
        const company = document.createElement("div");
        company.className = "company-name";
        company.textContent = job.company + " (sample)";
        const type = document.createElement("span");
        type.className = "job-type";
        type.textContent = job.type;
        companyInfo.append(company, type);
        top.append(logo, companyInfo);

        const title = document.createElement("h3");
        title.textContent = job.title;

        const info = document.createElement("div");
        info.className = "job-info";
        [job.location, job.salary, job.category].forEach(value => {
            const span = document.createElement("span");
            span.textContent = value;
            info.appendChild(span);
        });

        const apply = document.createElement("button");
        apply.className = "apply-btn";
        apply.type = "button";
        apply.textContent = "Try Demo Apply";
        apply.addEventListener("click", () => applyJob(job.id));

        card.append(top, title, info, apply);
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
    displayJobs(jobs.filter(job => job.category === category));
    document.getElementById("jobs").scrollIntoView({behavior:"smooth"});
}

function showAllJobs() {
    document.getElementById("searchInput").value = "";
    document.getElementById("locationInput").value = "";
    displayJobs(jobs);
}

function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = "flex";
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = "none";
}

function switchModal(closeId, openId) {
    closeModal(closeId);
    openModal(openId);
}

function enterDemo() {
    sessionStorage.setItem(SESSION_USER_KEY, "yes");
    closeModal("loginModal");
    closeModal("registerModal");
    updateNavigation();
    displayApplications();
    alert("Demo mode enabled. No account was created.");
}

function logoutUser() {
    sessionStorage.removeItem(SESSION_USER_KEY);
    updateNavigation();
    displayApplications();
}

function updateNavigation() {
    const user = getCurrentUser();
    const navButtons = document.getElementById("navButtons");
    const userArea = document.getElementById("userArea");
    const welcomeUser = document.getElementById("welcomeUser");
    if (!navButtons || !userArea || !welcomeUser) return;

    navButtons.style.display = user ? "none" : "flex";
    userArea.style.display = user ? "flex" : "none";
    welcomeUser.textContent = user ? "Demo User" : "";
}

function applyJob(id) {
    if (!getCurrentUser()) {
        alert("Select Login to enter the demo before trying this feature.");
        openModal("loginModal");
        return;
    }

    const job = jobs.find(item => item.id === id);
    if (!job) return;

    const applications = getApplications();
    if (applications.some(item => item.id === id)) {
        alert("You have already tried this sample application.");
        return;
    }

    applications.push({id: job.id, title: job.title, company: job.company});
    sessionStorage.setItem(SESSION_APPS_KEY, JSON.stringify(applications));
    alert("Demo action completed. No application was sent to any employer.");
    displayApplications();
}

function displayApplications() {
    const list = document.getElementById("applicationsList");
    if (!list) return;
    list.replaceChildren();

    if (!getCurrentUser()) {
        const message = document.createElement("p");
        message.textContent = "Enter demo mode to view sample application activity.";
        list.appendChild(message);
        return;
    }

    const applications = getApplications();
    if (applications.length === 0) {
        const message = document.createElement("p");
        message.textContent = "No demo applications tried yet.";
        list.appendChild(message);
        return;
    }

    applications.forEach(item => {
        const card = document.createElement("div");
        card.className = "application-item";
        const title = document.createElement("h3");
        title.textContent = item.title;
        const company = document.createElement("p");
        company.textContent = item.company + " — sample listing";
        const status = document.createElement("p");
        status.textContent = "Demo action only — not sent to an employer";
        card.append(title, company, status);
        list.appendChild(card);
    });
}

function toggleMenu() {
    document.getElementById("navLinks").classList.toggle("show");
}

document.querySelectorAll(".modal").forEach(modal => {
    modal.addEventListener("click", event => {
        if (event.target === modal) closeModal(modal.id);
    });
});

displayJobs(jobs);
updateNavigation();
displayApplications();
