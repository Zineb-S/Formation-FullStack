const CONTACTS_KEY = "contacts";

function getContacts() {
  return JSON.parse(localStorage.getItem(CONTACTS_KEY)) || [];
}

function saveContacts(contacts) {
  localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
}

function addContact(name, email, phone) {
  const contacts = getContacts();
  const newContact = {
    id: Date.now(),
    name,
    email,
    phone
  };
  contacts.push(newContact);
  saveContacts(contacts);
}

function renderContacts(contacts = getContacts(), highlightQuery = "") {
  const tbody = document.querySelector("#contactTable tbody");
  tbody.innerHTML = "";

  contacts.forEach(contact => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${highlight(contact.name, highlightQuery)}</td>
      <td>${highlight(contact.email, highlightQuery)}</td>
      <td>${contact.phone || ""}</td>
      <td>
        <button class="editBtn" data-id="${contact.id}">Modifier</button>
        <button class="deleteBtn" data-id="${contact.id}">Supprimer</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function deleteContact(id) {
  let contacts = getContacts();
  contacts = contacts.filter(c => c.id !== id);
  saveContacts(contacts);
  renderContacts();
}

function updateContact(id, newData) {
  let contacts = getContacts();
  contacts = contacts.map(c =>
    c.id === id ? { ...c, ...newData } : c
  );
  saveContacts(contacts);
  renderContacts();
}
// Handle add contact
document.getElementById("contactForm").addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();

  if (name && email) {
    addContact(name, email, phone);
    e.target.reset();
    renderContacts();
  }
});
// Handle edit/delete
document.querySelector("#contactTable tbody").addEventListener("click", e => {
  const id = Number(e.target.dataset.id);
  if (e.target.classList.contains("deleteBtn")) {
    deleteContact(id);
  }
  if (e.target.classList.contains("editBtn")) {
    const newName = prompt("Entrer le nouveau nom:");
    const newPhone = prompt("Entrer le nouveau téléphone:");
    if (newName || newPhone) {
      updateContact(id, {
        name: newName || undefined,
        phone: newPhone || undefined
      });
    }
  }
});
// Highlight search matches
function highlight(text, query) {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
}
// Search contacts
function searchContacts(q) {
  const contacts = getContacts();
  return contacts.filter(c =>
    c.name.toLowerCase().includes(q.toLowerCase()) ||
    c.email.toLowerCase().includes(q.toLowerCase())
  );
}
document.getElementById("searchBox").addEventListener("input", e => {
  const q = e.target.value.trim();
  const contacts = q ? searchContacts(q) : getContacts();
  renderContacts(contacts, q);
});

// Export contacts
function exportContacts() {
  const data = JSON.stringify(getContacts(), null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "contacts.json";
  a.click();
}
document.getElementById("exportBtn").addEventListener("click", exportContacts);

// Import contacts
document.getElementById("importFile").addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const importedContacts = JSON.parse(reader.result);
      if (Array.isArray(importedContacts)) {
        saveContacts(importedContacts);
        renderContacts();
      } else {
        alert("Fichier invalide : format attendu JSON tableau");
      }
    } catch (err) {
      alert("Erreur lors de l'import du fichier !");
    }
  };
  reader.readAsText(file);
});

// Initial render
renderContacts();
