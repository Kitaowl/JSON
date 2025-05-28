const input = document.querySelector("#jsonInput");
const button = document.querySelector("#generateBtn");
const container = document.querySelector("#content");
const versionSelect = document.querySelector("#versionSelect");

let jsonData = [];

// Wczytania pliku JSON
input.addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function (e) {
    try {
      // Parsowanie JSON
      jsonData = JSON.parse(e.target.result);

      // Wyciągnięcie unikalnych wersji
      const versions = [
        ...new Set(
          jsonData.map((item) => item.version).filter((v) => v !== undefined)
        ),
      ];

      // Jeśli nie ma wersji
      if (versions.length === 0) {
        alert("Brak wersji w pliku JSON.");
        return;
      }

      // Wypełnienie selecta wersjami
      versionSelect.innerHTML = '<option value="">Wybierz wersję</option>';
      versions.forEach((ver) => {
        const option = document.createElement("option");
        option.value = ver;
        option.textContent = "Wersja " + ver;
        versionSelect.appendChild(option);
      });

      versionSelect.disabled = false;
      button.disabled = false;
    } catch (error) {
      alert("Nieprawidłowy plik JSON.");
      console.error(error);
    }
  };

  reader.readAsText(file);
});

// Generowanie strony po kliknięciu
button.addEventListener("click", function () {
  const selectedVersion = parseInt(versionSelect.value);
  if (!selectedVersion) {
    alert("Wybierz wersję.");
    return;
  }

  // Filtrowanie danych według wersji
  const elements = jsonData.filter((item) => item.version === selectedVersion);
  generujStrone(elements);
});

// Funkcja do dynamicznego tworzenia elementów HTML na stronie
function generujStrone(elements) {
  container.innerHTML = "";

  elements.forEach((element) => {
    if (!element.type) return;

    const el = document.createElement(element.type);

    // Obsługuje zarówno "text", jak i "content"
    if (element.text) el.textContent = element.text;
    if (element.content) el.textContent = element.content;
    if (element.href) el.href = element.href;
    if (element.class) el.className = element.class;

    container.appendChild(el);
  });
}
