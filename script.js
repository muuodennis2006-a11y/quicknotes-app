const form = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const notesList = document.querySelector("#notes-list");
const noteCount = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");
const searchInput = document.querySelector("#search-input");
const clearAllBtn = document.querySelector("#clear-all-btn");

let notes = [];


function render(notesToRender = notes) {
    notesList.textContent = "";

    if (notesToRender.length === 0 && searchInput.value.trim() !== "") {
        const message = document.createElement("li");
        message.textContent = "No notes match your search.";
        notesList.appendChild(message);
        return;
    }

    notesToRender.forEach(function (note) {
        const li = document.createElement("li");

        li.classList.add(
            "note-card",
            `category-${note.category}`
        );

        const text = document.createElement("p");
        text.textContent = note.text;

        const category = document.createElement("span");
        category.classList.add("note-category");
        category.textContent = note.category;

        const date = document.createElement("p");
        date.classList.add("note-date");
        date.textContent = note.createdAt;

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-btn");
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function () {
            notes = notes.filter(function (item) {
                return item.id !== note.id;
            });

            saveNotes();
            render();
        });

        li.appendChild(text);
        li.appendChild(category);
        li.appendChild(date);
        li.appendChild(deleteButton);

        notesList.appendChild(li);
    });

    updateCount();
}


function updateCount() {
    if (notes.length === 0) {
        noteCount.textContent = "You have no notes yet.";
    } else if (notes.length === 1) {
        noteCount.textContent = "You have 1 note.";
    } else {
        noteCount.textContent = `You have ${notes.length} notes.`;
    }
}


form.addEventListener("submit", function (event) {
    event.preventDefault();

    const text = noteInput.value.trim();
    const category = noteCategory.value;

    if (text === "") {
        errorMessage.textContent = "Please type a note first.";
        return;
    }

    if (text.length > 200) {
        errorMessage.textContent =
            "Notes must be 200 characters or fewer.";
        return;
    }

    const note = {
        id: Date.now(),
        text: text,
        category: category,
        createdAt: new Date().toLocaleString()
    };

    notes.push(note);

    errorMessage.textContent = "";

    noteInput.value = "";

    saveNotes();
    render();
});


function saveNotes() {
    localStorage.setItem("quicknotes", JSON.stringify(notes));
}


function loadNotes() {
    const savedNotes = localStorage.getItem("quicknotes");

    if (savedNotes) {
        notes = JSON.parse(savedNotes);
    }

    render();
}


searchInput.addEventListener("input", function () {
    const searchTerm = searchInput.value.trim().toLowerCase();

    const filteredNotes = notes.filter(function (note) {
        return note.text.toLowerCase().includes(searchTerm);
    });

    render(filteredNotes);
});


clearAllBtn.addEventListener("click", function () {
    if (confirm("Delete all notes?")) {
        notes = [];

        saveNotes();
        render();
    }
});

loadNotes();