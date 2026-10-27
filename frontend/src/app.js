//definie comment frontend parle avec backend .
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
//C’est l’adresse du serveur. Exemple : request("/students") devient : http://localhost:5000/api/students
//Donc frontend sait où envoyer les requêtes. Sans ça → impossible de récupérer les données.
const API_KEY = import.meta.env.VITE_API_KEY || "school-secret-key";
//Defines: backend URL and secret API key : envoyer dans header de chaque requête pour authentification. (x-api-key
let students = [];
let courses = [];
let average = 0;
let activeView = "dashboard";//mémoire application
//Stores application data in memory.(all students, all courses, average grade, and the currently visible page )
//Ça représente l’état actuel de l’application.(tous les étudiants,tous les cours, la note moyenne et la page actuellement visible)


// The elements object holds references to various DOM elements that are used throughout the application,
// such as navigation links, page title, different views, counts, tables, forms, and buttons. 
// This allows for easy access and manipulation of these elements in the code.
// raccourcis vers HTML.Au lieu d’écrire 100 fois : document.querySelector("#studentsTable") 
// on fait juste : elements.studentsTable
const elements = {
  navLinks: document.querySelectorAll("[data-view]"),
  pageTitle: document.querySelector("#pageTitle"),// ex: Finds: <h1 id="pageTitle"></h1> and stores it.
  dashboardView: document.querySelector("#dashboardView"),
  studentsView: document.querySelector("#studentsView"),
  coursesView: document.querySelector("#coursesView"),
  studentsCount: document.querySelector("#studentsCount"),
  coursesCount: document.querySelector("#coursesCount"),
  averageValue: document.querySelector("#averageValue"),
  dashboardAverage: document.querySelector("#dashboardAverage"),
  dashboardStudents: document.querySelector("#dashboardStudents"),
  dashboardCourses: document.querySelector("#dashboardCourses"),
  dashboardFields: document.querySelector("#dashboardFields"),
  fieldDistribution: document.querySelector("#fieldDistribution"),
  recentStudents: document.querySelector("#recentStudents"),
  courseOverview: document.querySelector("#courseOverview"),
  fieldFilter: document.querySelector("#fieldFilter"),
  alertBox: document.querySelector("#alertBox"),
  studentsTable: document.querySelector("#studentsTable"),
  coursesTable: document.querySelector("#coursesTable"),
  studentForm: document.querySelector("#studentForm"),
  courseForm: document.querySelector("#courseForm"),
  studentSubmitBtn: document.querySelector("#studentSubmitBtn"),
  courseSubmitBtn: document.querySelector("#courseSubmitBtn"),
  studentFormTitle: document.querySelector("#studentFormTitle"),
  courseFormTitle: document.querySelector("#courseFormTitle"),
  cancelStudentEdit: document.querySelector("#cancelStudentEdit"),
  cancelCourseEdit: document.querySelector("#cancelCourseEdit"),
  exportCsvBtn: document.querySelector("#exportCsvBtn")
};
//This is a reusable function for API requests. It takes a path and options, 
// makes a fetch request to the backend API, and handles the response.
const request = async (path, options = {}) => {
  const response = await fetch(`${API_URL}${path}`, {
    //Send request ex: request("/students") will call http://localhost:5000/api/students 
    // then Waits for request to finish.
    ...options,
    //Adds extra options like:method headers body
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    }
  });

  const payload = await response.json();
//Convert response to JSON
  if (!response.ok) {
    throw new Error(payload.message || "Request failed");
  }
// If the response is not successful, it throws an error with the message from the payload or a default message.
  return payload;
// If the response is successful, it returns the parsed JSON payload.
};

const showError = (message) => {
  elements.alertBox.className = "alert alert-danger";
  elements.alertBox.textContent = message;
};
// The showError function displays an error message in the alert box (showError("Student not found"))
const clearError = () => {
  elements.alertBox.className = "alert d-none";
  elements.alertBox.textContent = "";
};
// The clearError function hides the alert box and clears its content.
const parseGrades = (value) =>
  // The parseGrades function takes a string input (e.g., "85, 90, 78"), 
  // splits it by commas or whitespace, trims each grade, filters out empty values, 
  // converts them to numbers, and returns an array of valid numeric grades.
  //exemple: "12, 15, 18" => [12, 15, 18]
  value
    .split(/[,\s]+/)
    .map((grade) => grade.trim())
    .filter(Boolean)
    .map(Number)
    .filter((grade) => Number.isFinite(grade));

const studentAverage = (grades) => {
// The studentAverage function calculates the average of an array of grades. 
// If there are no grades, it returns "0.00". 
// Otherwise, it sums the grades and divides by the number of grades, 
// returning the result as a string with two decimal places.
  if (!grades.length) return "0.00";
  const total = grades.reduce((sum, grade) => sum + grade, 0);
  return (total / grades.length).toFixed(2);
};

const loadData = async () => {
// The loadData function is responsible for fetching the students, courses, and average grade data from 
// the backend API.
  clearError();
  const field = elements.fieldFilter.value;
//On lit quelle filière est sélectionnée dans le menu déroulant.
  const query = field ? `?field=${encodeURIComponent(field)}` : "";
//On construit la fin de l'URL : Si une filière est choisie → ?field=Informatique 
// Si rien n'est choisi → chaîne vide "" //encodeURIComponent transforme les espaces et caractères spéciaux
// pour qu'ils soient valides dans une URL.
  try {
    const [studentsResponse, coursesResponse, averageResponse] = await Promise.all([
      //charge en parallèle : students courses stats
      //Promise.all est plus rapide. Au lieu de : await students await courses await stats ça fait tout en même temps.
      request(`/students${query}`),
      request(`/courses${query}`),
      request(`/stats/average${query}`)
    ]);
  
    students = studentsResponse.data;
    courses = coursesResponse.data;
    average = averageResponse.average;
    //Met à jour state.(ma mémoire de l’application) avec les nouvelles données reçues du backend.
    //backend -> state -> UI
    render();
  } catch (error) {
    showError(error.message);
  }
};

const render = () => {
  //Après chargement données : on met à jour interface.
  elements.studentsCount.textContent = students.length;
  elements.coursesCount.textContent = courses.length;
  elements.averageValue.textContent = average;

  renderFieldOptions();
  renderDashboard();
  renderStudents();
  renderCourses();
};



//dashboard : affiche les chiffres clés (nombre students, nombre courses, moyenne) 
// et la distribution des filières (barres de progression)




const renderDashboard = () => {
  elements.dashboardAverage.textContent = average;
  elements.dashboardStudents.textContent = `${students.length} active`;
  elements.dashboardCourses.textContent = `${courses.length} active`;
//Construit dashboard. Affiche : nombre students nombre courses moyenne distribution par field .
  const studentsByField = students.reduce((counts, student) => {
    counts[student.field] = (counts[student.field] || 0) + 1;
    return counts;
  }, {});
//sert à compter combien d’étudiants par domaine, ex: { "Computer Science": 10, "Mathematics": 5 }
  
// Affiche le nombre de filières différentes dans le dashboard
elements.dashboardFields.textContent = Object.keys(studentsByField).length;

// Au minimum 1 pour éviter une division par zéro plus bas
const totalStudents = Math.max(students.length, 1);

// Si des filières existent → génère les barres de progression, sinon → message vide
elements.fieldDistribution.innerHTML = Object.entries(studentsByField).length
  ? Object.entries(studentsByField).map(([field, count]) => {
        // Calcule le % de cette filière par rapport au total
        const width = Math.round((count / totalStudents) * 100);
        // Retourne le HTML d'une barre pour cette filière
        return `
          <div class="distribution-item">
            <div class="d-flex justify-content-between">
              <span>${field}</span>
              <strong>${count}</strong>
            </div>
            <div class="progress">
              <div class="progress-bar" style="width: ${width}%"></div>
            </div>
          </div>
        `;
      })
      .join("") // Colle tous les blocs HTML en une seule chaîne
  : `<p class="empty-text">No fields yet.</p>`;

// Transforme tableau students → HTML (4 derniers, du plus récent au plus ancien)
elements.recentStudents.innerHTML = students.length
  ? students
      .slice(-4)   // Prend les 4 derniers étudiants
      .reverse()   // Inverse l'ordre : le plus récent en premier
      .map(
        (student) => `
          <div class="mini-item">
            <div>
              <strong>${student.name}</strong>
              <span>${student.field}</span>
            </div>
            <em>${studentAverage(student.grades)} avg</em>
          </div>
        `
      )
      .join("")
  : `<p class="empty-text">No students yet.</p>`;

// Affiche les 4 premiers cours, sinon message vide
elements.courseOverview.innerHTML = courses.length
  ? courses
      .slice(0, 4) // Prend uniquement les 4 premiers cours
      .map(
        (course) => `
          <div class="mini-item">
            <div>
              <strong>${course.title}</strong>
              <span>${course.instructor}</span>
            </div>
            <em>${course.duration}</em>
          </div>
        `
      )
      .join("")
  : `<p class="empty-text">No courses yet.</p>`;
};



//etudiant //




// Reconstruit le menu déroulant des filières (sans doublons, trié)
const renderFieldOptions = () => {
  // Sauvegarde la filière sélectionnée avant de reconstruire le menu
  const selected = elements.fieldFilter.value;
  // Fusionne les filières des étudiants et des cours, supprime doublons et valeurs vides, trie
  const fields = [...new Set([...students.map((student) => student.field), ...courses.map((course) => course.field)])]
    .filter(Boolean)
    .sort();

  // Remet l'option par défaut
  elements.fieldFilter.innerHTML = `<option value="">All fields</option>`;

  // Ajoute une <option> pour chaque filière
  fields.forEach((field) => {
    const option = document.createElement("option");
    option.value = field;
    option.textContent = field;
    option.selected = field === selected; // Reselectionne la filière précédente si elle existe encore
    elements.fieldFilter.appendChild(option);
  });
};

// Génère les lignes du tableau des étudiants
const renderStudents = () => {
  // Si aucun étudiant → affiche un message sur toute la ligne
  if (!students.length) {
    elements.studentsTable.innerHTML = `<tr><td colspan="5" class="text-center py-5 text-muted">No students found.</td></tr>`;
    return; // Arrête la fonction ici
  }

  // Sinon, une ligne <tr> par étudiant avec ses données et boutons Edit/Del
  elements.studentsTable.innerHTML = students
    .map(
      (student) => `
        <tr>
          <td>
            <strong class="row-title">${student.name}</strong>
          </td>
          <td>${student.age}</td>
          <td><span class="tag tag-blue">${student.field}</span></td>
          <td><span class="tag tag-green">${studentAverage(student.grades)}</span></td>
          <td>
            <!-- data-edit-student / data-delete-student : identifient l'étudiant ciblé au clic -->
            <button class="action-button" data-edit-student="${student.id}" type="button">Edit</button>
            <button class="action-button text-danger" data-delete-student="${student.id}" type="button">Del</button>
          </td>
        </tr>
      `
    )
    .join("");
};




// Cours //





// Génère les lignes du tableau des cours (même logique que renderStudents)
const renderCourses = () => {
  // Si aucun cours → message vide
  if (!courses.length) {
    elements.coursesTable.innerHTML = `<tr><td colspan="5" class="text-center py-5 text-muted">No courses found.</td></tr>`;
    return;
  }

  // Une ligne <tr> par cours avec ses données et boutons Edit/Del
  elements.coursesTable.innerHTML = courses
    .map(
      (course) => `
        <tr>
          <td>
            <strong class="row-title">${course.title}</strong>
          </td>
          <td>${course.instructor}</td>
          <td><span class="tag tag-blue">${course.field}</span></td>
          <td><span class="tag tag-orange">${course.duration}</span></td>
          <td>
            <button class="action-button" data-edit-course="${course.id}" type="button">Edit</button>
            <button class="action-button text-danger" data-delete-course="${course.id}" type="button">Del</button>
          </td>
        </tr>
      `
    )
    .join("");
};



// Change la page affichée : dashboard, students ou courses
const switchView = (view) => {
  activeView = view; // Mémorise la vue active
  const titles = {
    dashboard: "Dashboard",
    students: "Students Management",
    courses: "Courses Management"
  };

  // Met à jour le titre de la page
  elements.pageTitle.textContent = titles[view];
  // Cache les 3 sections, affiche uniquement celle demandée ("d-none" = invisible)
  elements.dashboardView.classList.toggle("d-none", view !== "dashboard");
  elements.studentsView.classList.toggle("d-none", view !== "students");
  elements.coursesView.classList.toggle("d-none", view !== "courses");

  // Met en surbrillance le lien actif dans la navigation
  elements.navLinks.forEach((link) => {
    link.classList.toggle("active", link.dataset.view === view);
  });
};

// Vide le formulaire étudiant et le remet en mode "Ajouter"
const resetStudentForm = () => {
  elements.studentForm.reset();                             // Vide tous les champs
  document.querySelector("#studentId").value = "";          // Efface l'ID caché (utilisé en mode édition)
  elements.studentFormTitle.textContent = "Add student";
  elements.studentSubmitBtn.textContent = "Create student";
  elements.cancelStudentEdit.classList.add("d-none");       // Cache le bouton Annuler
};

// Vide le formulaire cours et le remet en mode "Ajouter" (même logique)
const resetCourseForm = () => {
  elements.courseForm.reset();
  document.querySelector("#courseId").value = "";
  elements.courseFormTitle.textContent = "Add course";
  elements.courseSubmitBtn.textContent = "Create course";
  elements.cancelCourseEdit.classList.add("d-none");
};

// Clic sur un lien de navigation → change de page
elements.navLinks.forEach((link) => {
  link.addEventListener("click", () => switchView(link.dataset.view));
});

// Changement de filière dans le menu → recharge les données filtrées
elements.fieldFilter.addEventListener("change", loadData);

// Clic sur Export CSV → redirige vers l'URL d'export (le serveur envoie un fichier .csv)
elements.exportCsvBtn.addEventListener("click", () => {
  const field = elements.fieldFilter.value;
  // Ajoute ?field=... à l'URL si une filière est sélectionnée
  const query = field ? `?field=${encodeURIComponent(field)}` : "";
  window.location.href = `${API_URL}/students/export${query}`;
});

// Soumission du formulaire étudiant : crée (POST) ou modifie (PUT) selon si un ID est présent
elements.studentForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // Empêche le rechargement de la page
  clearError();           // Efface les anciens messages d'erreur

  // Vide = création | Rempli = modification
  const id = document.querySelector("#studentId").value;
  const student = {
    name: document.querySelector("#studentName").value,
    age: Number(document.querySelector("#studentAge").value),   // Texte → nombre
    field: document.querySelector("#studentField").value,
    grades: parseGrades(document.querySelector("#studentGrades").value) // "12, 15" → [12, 15]
  };

  try {
    if (id) {
      // ID présent → mise à jour (PUT)
      await request(`/students/${id}`, {
        method: "PUT",
        headers: { "x-api-key": API_KEY },
        body: JSON.stringify(student) // Convertit l'objet JS en JSON pour l'envoyer
      });
    } else {
      // Pas d'ID → création (POST)
      await request("/students", {
        method: "POST",
        headers: { "x-api-key": API_KEY },
        body: JSON.stringify(student)
      });
    }

    resetStudentForm();              // Remet le formulaire à zéro
    elements.fieldFilter.value = ""; // Réinitialise le filtre
    await loadData();                // Recharge l'affichage
  } catch (error) {
    showError(error.message); // Affiche l'erreur si la requête échoue
  }
});

// Soumission du formulaire cours : crée (POST) ou modifie (PUT) (même logique que étudiant)
elements.courseForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearError();

  // Vide = création | Rempli = modification
  const id = document.querySelector("#courseId").value;
  const course = {
    title: document.querySelector("#courseTitle").value,
    instructor: document.querySelector("#courseInstructor").value,
    field: document.querySelector("#courseField").value,
    duration: document.querySelector("#courseDuration").value
  };

  try {
    if (id) {
      // ID présent → mise à jour (PUT)
      await request(`/courses/${id}`, {
        method: "PUT",
        headers: { "x-api-key": API_KEY },
        body: JSON.stringify(course)
      });
    } else {
      // Pas d'ID → création (POST)
      await request("/courses", {
        method: "POST",
        headers: { "x-api-key": API_KEY },
        body: JSON.stringify(course)
      });
    }

    resetCourseForm();
    elements.fieldFilter.value = "";
    await loadData();
  } catch (error) {
    showError(error.message);
  }
});

// Clic sur Annuler → remet le formulaire en mode "Ajouter" sans rien envoyer
elements.cancelStudentEdit.addEventListener("click", resetStudentForm);
elements.cancelCourseEdit.addEventListener("click", resetCourseForm);

// Écoute tous les clics sur la page pour gérer Edit et Delete (étudiants et cours)
document.addEventListener("click", async (event) => {
  // Lit l'attribut data-* du bouton cliqué pour savoir quelle action faire
  const studentEditId = event.target.dataset.editStudent;
  const studentDeleteId = event.target.dataset.deleteStudent;
  const courseEditId = event.target.dataset.editCourse;
  const courseDeleteId = event.target.dataset.deleteCourse;

  // Clic sur Edit étudiant → pré-remplit le formulaire avec ses données
  if (studentEditId) {
    // Cherche l'étudiant dans le tableau local par son ID
    const student = students.find((item) => item.id === Number(studentEditId));
    document.querySelector("#studentId").value = student.id;
    document.querySelector("#studentName").value = student.name;
    document.querySelector("#studentAge").value = student.age;
    document.querySelector("#studentField").value = student.field;
    document.querySelector("#studentGrades").value = student.grades.join(", "); // [12, 15] → "12, 15"
    // Passe le formulaire en mode "Modifier"
    elements.studentFormTitle.textContent = "Edit student";
    elements.studentSubmitBtn.textContent = "Save changes";
    elements.cancelStudentEdit.classList.remove("d-none"); // Affiche le bouton Annuler
  }

  // Clic sur Edit cours → pré-remplit le formulaire avec ses données (même logique)
  if (courseEditId) {
    const course = courses.find((item) => item.id === Number(courseEditId));
    document.querySelector("#courseId").value = course.id;
    document.querySelector("#courseTitle").value = course.title;
    document.querySelector("#courseInstructor").value = course.instructor;
    document.querySelector("#courseField").value = course.field;
    document.querySelector("#courseDuration").value = course.duration;
    // Passe le formulaire en mode "Modifier"
    elements.courseFormTitle.textContent = "Edit course";
    elements.courseSubmitBtn.textContent = "Save changes";
    elements.cancelCourseEdit.classList.remove("d-none");
  }

  try {
    // Clic sur Delete étudiant → supprime via l'API puis recharge l'affichage
    if (studentDeleteId) {
      await request(`/students/${studentDeleteId}`, {
        method: "DELETE",
        headers: { "x-api-key": API_KEY }
      });
      await loadData();
    }

    // Clic sur Delete cours → supprime via l'API puis recharge l'affichage
    if (courseDeleteId) {
      await request(`/courses/${courseDeleteId}`, {
        method: "DELETE",
        headers: { "x-api-key": API_KEY }
      });
      await loadData();
    }
  } catch (error) {
    showError(error.message);
  }
});

// Lance l'application au chargement de la page
loadData();