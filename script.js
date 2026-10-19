// Wait until the HTML page is loaded
document.addEventListener("DOMContentLoaded", function () {

    // 1. Dark and Light Theme
    const themeToggle = document.getElementById("themeToggle");

    // Load the saved theme
    const savedTheme = localStorage.getItem("portfolioTheme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        themeToggle.textContent = "☀ Light";
    }

    // Change the theme when the button is clicked
    themeToggle.addEventListener("click", function () {

        document.body.classList.toggle("dark-mode");

        if (document.body.classList.contains("dark-mode")) {
            localStorage.setItem("portfolioTheme", "dark");
            themeToggle.textContent = "☀ Light";
        } else {
            localStorage.setItem("portfolioTheme", "light");
            themeToggle.textContent = "☾ Theme";
        }

    });


    // 2. Change Profile Photo
    const photoInput = document.getElementById("photoInput");
    const profileImage = document.getElementById("profileImage");

    // Display a previously saved photo
    const savedPhoto = localStorage.getItem("portfolioPhoto");

    if (savedPhoto) {
        profileImage.src = savedPhoto;
    }

    // Select a new photo from the computer
    photoInput.addEventListener("change", function () {

        const file = photoInput.files[0];

        if (!file) {
            return;
        }

        // Check whether the selected file is an image
        if (!file.type.startsWith("image/")) {
            alert("Please select an image file.");
            photoInput.value = "";
            return;
        }

        // Limit the photo size to 2 MB
        if (file.size > 2 * 1024 * 1024) {
            alert("Please choose an image smaller than 2 MB.");
            photoInput.value = "";
            return;
        }

        const reader = new FileReader();

        reader.onload = function (event) {
            profileImage.src = event.target.result;

            // Save the photo in the browser
            localStorage.setItem(
                "portfolioPhoto",
                event.target.result
            );
        };

        reader.readAsDataURL(file);

    });


    // 3. Filter Projects by Category
    const filterButtons = document.querySelectorAll(".filter-btn");
    const projectItems = document.querySelectorAll(".project-item");

    filterButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            // Remove the active class from all buttons
            filterButtons.forEach(function (btn) {
                btn.classList.remove("active");
            });

            // Highlight the selected button
            button.classList.add("active");

            const selectedCategory = button.getAttribute("data-filter");

            // Show or hide projects
            projectItems.forEach(function (project) {

                const projectCategory =
                    project.getAttribute("data-category");

                if (
                    selectedCategory === "all" ||
                    selectedCategory === projectCategory
                ) {
                    project.classList.remove("hidden");
                } else {
                    project.classList.add("hidden");
                }

            });

        });

    });


    // 4. Student Life Journal
    const journalForm = document.getElementById("journalForm");
    const journalTitle = document.getElementById("journalTitle");
    const journalText = document.getElementById("journalText");
    const journalEntries = document.getElementById("journalEntries");

    // Load journal entries saved in the browser
    let entries = [];

    try {
        entries = JSON.parse(
            localStorage.getItem("portfolioJournal")
        ) || [];

        if (!Array.isArray(entries)) {
            entries = [];
        }
    } catch (error) {
        entries = [];
    }

    // Display all saved journal entries
    function displayEntries() {

        journalEntries.innerHTML = "";

        if (entries.length === 0) {
            journalEntries.innerHTML =
                "<p class='small-note'>No journal entries yet. " +
                "Write your first note above!</p>";
            return;
        }

        entries.forEach(function (entry) {

            const entryBox = document.createElement("div");
            entryBox.className = "journal-entry";

            const title = document.createElement("h4");
            title.textContent = entry.title;

            const date = document.createElement("div");
            date.className = "journal-date";
            date.textContent = entry.date;

            const content = document.createElement("p");
            content.textContent = entry.text;

            const deleteButton = document.createElement("button");
            deleteButton.className = "delete-entry";
            deleteButton.textContent = "Delete Entry";

            // Delete this journal entry
            deleteButton.addEventListener("click", function () {

                entries = entries.filter(function (item) {
                    return item.id !== entry.id;
                });

                localStorage.setItem(
                    "portfolioJournal",
                    JSON.stringify(entries)
                );

                displayEntries();

            });

            entryBox.appendChild(title);
            entryBox.appendChild(date);
            entryBox.appendChild(content);
            entryBox.appendChild(deleteButton);

            journalEntries.appendChild(entryBox);

        });

    }

    // Save a new journal entry
    journalForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const title = journalTitle.value.trim();
        const text = journalText.value.trim();

        if (title === "" || text === "") {
            alert("Please fill in both fields.");
            return;
        }

        const newEntry = {
            id: Date.now(),
            title: title,
            text: text,
            date: new Date().toLocaleDateString()
        };

        entries.unshift(newEntry);

        localStorage.setItem(
            "portfolioJournal",
            JSON.stringify(entries)
        );

        journalForm.reset();

        displayEntries();

    });

    // Show saved entries when the page opens
    displayEntries();

});
