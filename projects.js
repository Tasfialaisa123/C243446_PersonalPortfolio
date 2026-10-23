const projectForm = document.getElementById("projectForm");
const projectList = document.getElementById("projectList");
const projectCount = document.getElementById("projectCount");
const emptyMessage = document.getElementById("emptyMessage");

const projectName = document.getElementById("projectName");
const projectDescription = document.getElementById("projectDescription");
const projectTech = document.getElementById("projectTech");
const projectLink = document.getElementById("projectLink");

const saveProjectBtn = document.getElementById("saveProjectBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const formHeading = document.getElementById("formHeading");

// Starter projects are shown the first time the page is opened.
const starterProjects = [
    {
        id: 1,
        name: "Dice Game",
        description: "A simple C game for practising programming logic, conditions, and random numbers.",
        tech: "C, Code::Blocks",
        link: ""
    },
    {
        id: 2,
        name: "BSRM Employee Management System",
        description: "An employee management system project focused on employee information and management.",
        tech: "Python, Django, SQLite",
        link: ""
    },
    {
        id: 3,
        name: "Inventory Management System",
        description: "An inventory system for managing products and practising database operations.",
        tech: "Python, Tkinter, SQLite",
        link: ""
    },
    {
        id: 4,
        name: "Hostel Management System",
        description: "A project created to practise data structures and organise hostel-related information.",
        tech: "C++, Qt",
        link: ""
    }
];

const storageKey = "tasfiaPortfolioProjects";

let projects = [];
let editingId = null;

// Load saved projects, or add starter projects for a first-time visitor.
try {
    const savedProjects = localStorage.getItem(storageKey);

    if (savedProjects === null) {
        projects = starterProjects;
        saveProjects();
    } else {
        const parsedProjects = JSON.parse(savedProjects);
        projects = Array.isArray(parsedProjects) ? parsedProjects : starterProjects;
    }
} catch (error) {
    projects = starterProjects;
}

displayProjects();

function saveProjects() {
    try {
        localStorage.setItem(storageKey, JSON.stringify(projects));
    } catch (error) {
        alert("Your browser could not save the projects. Check your browser storage.");
    }
}

function displayProjects() {
    projectList.replaceChildren();

    projectCount.textContent =
        projects.length + (projects.length === 1 ? " project" : " projects");

    emptyMessage.hidden = projects.length !== 0;

    projects.forEach(function(project, index) {
        const column = document.createElement("div");
        column.className = "col-md-6";

        const card = document.createElement("div");
        card.className = "saved-project";

        const number = document.createElement("p");
        number.className = "project-number";
        number.textContent = "PROJECT " + String(index + 1).padStart(2, "0");

        const title = document.createElement("h3");
        title.textContent = project.name;

        const description = document.createElement("p");
        description.textContent = project.description;

        const techArea = document.createElement("div");
        const techList = project.tech.split(",");

        techList.forEach(function(tech) {
            const tag = document.createElement("span");
            tag.className = "technology-tag";
            tag.textContent = tech.trim();
            techArea.appendChild(tag);
        });

        card.appendChild(number);
        card.appendChild(title);
        card.appendChild(description);
        card.appendChild(techArea);

        if (project.link) {
            const link = document.createElement("a");
            link.href = project.link;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.className = "btn btn-sm btn-outline-primary mt-3";
            link.textContent = "View Project ↗";
            card.appendChild(link);
        }

        const actions = document.createElement("div");
        actions.className = "project-actions";

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.className = "btn btn-sm btn-outline-secondary";
        editButton.textContent = "Edit";
        editButton.addEventListener("click", function() {
            editProject(project.id);
        });

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "btn btn-sm btn-outline-danger";
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", function() {
            deleteProject(project.id);
        });

        actions.appendChild(editButton);
        actions.appendChild(deleteButton);
        card.appendChild(actions);

        column.appendChild(card);
        projectList.appendChild(column);
    });
}

projectForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = projectName.value.trim();
    const description = projectDescription.value.trim();
    const tech = projectTech.value.trim();
    const link = projectLink.value.trim();

    if (!name || !description || !tech) {
        alert("Please fill in the project name, description, and technologies.");
        return;
    }

    if (link) {
        try {
            const checkedLink = new URL(link);

            if (checkedLink.protocol !== "https:" &&
                checkedLink.protocol !== "http:") {
                alert("Please enter a valid HTTP or HTTPS project link.");
                return;
            }
        } catch (error) {
            alert("Please enter a valid project link.");
            return;
        }
    }

    if (editingId !== null) {
        projects = projects.map(function(project) {
            if (project.id === editingId) {
                return {
                    id: project.id,
                    name: name,
                    description: description,
                    tech: tech,
                    link: link
                };
            }

            return project;
        });
    } else {
        const newProject = {
            id: Date.now(),
            name: name,
            description: description,
            tech: tech,
            link: link
        };

        projects.push(newProject);
    }

    saveProjects();
    displayProjects();
    resetForm();
});

function editProject(id) {
    const project = projects.find(function(item) {
        return item.id === id;
    });

    if (!project) {
        return;
    }

    editingId = id;

    projectName.value = project.name;
    projectDescription.value = project.description;
    projectTech.value = project.tech;
    projectLink.value = project.link || "";

    saveProjectBtn.textContent = "Update Project";
    cancelEditBtn.hidden = false;
    formHeading.textContent = "EDIT PROJECT";

    projectForm.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

function deleteProject(id) {
    const confirmed = confirm("Are you sure you want to delete this project?");

    if (!confirmed) {
        return;
    }

    projects = projects.filter(function(project) {
        return project.id !== id;
    });

    saveProjects();
    displayProjects();

    if (editingId === id) {
        resetForm();
    }
}

function resetForm() {
    projectForm.reset();
    editingId = null;

    saveProjectBtn.textContent = "Add Project";
    cancelEditBtn.hidden = true;
    formHeading.textContent = "ADD A PROJECT";
}

cancelEditBtn.addEventListener("click", resetForm);
