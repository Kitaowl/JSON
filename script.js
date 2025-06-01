// Pobieranie elementów DOM
const input = document.querySelector("#jsonInput"); // Pole input do wczytywania plików
const button = document.querySelector("#generateBtn"); // Przycisk generowania
const container = document.querySelector("#content"); // Kontener na wygenerowaną zawartość
const versionSelect = document.querySelector("#versionSelect"); // Select do wyboru wersji

let jsonData = []; // Tablica na przechowanie wczytanych danych JSON

// Obsługa zdarzenia zmiany pliku w inputcie
input.addEventListener("change", function (event) {
  // Pobranie pierwszego (i jedynego) pliku z listy
  const file = event.target.files[0];
  if (!file) return; // Jeśli nie ma pliku, przerwij funkcję

  // Utworzenie FileReader do odczytu zawartości pliku
  const reader = new FileReader();

  // Funkcja wywoływana po załadowaniu pliku
  reader.onload = function (e) {
    try {
      // Parsowanie zawartości pliku (stringa) do obiektu JavaScript
      jsonData = JSON.parse(e.target.result);

      // Wyciągnięcie unikalnych wersji z danych:
      // 1. Mapujemy tablicę do tablicy wersji
      // 2. Filtrujemy, aby usunąć undefined
      // 3. Używamy Set, aby wyeliminować duplikaty
      // 4. Rozprzestrzeniamy Set z powrotem do tablicy
      const versions = [
        ...new Set(
          jsonData.map((item) => item.version).filter((v) => v !== undefined)
        ),
      ];

      // Jeśli nie znaleziono żadnych wersji
      if (versions.length === 0) {
        alert("Brak wersji w pliku JSON.");
        return;
      }

      // Przygotowanie selecta z opcjami:
      // 1. Najpierw czyścimy zawartość selecta
      // 2. Dodajemy domyślną opcję
      versionSelect.innerHTML = '<option value="">Wybierz wersję</option>';
      
      // Dodawanie opcji dla każdej wersji
      versions.forEach((ver) => {
        const option = document.createElement("option");
        option.value = ver; // Wartość opcji to numer wersji
        option.textContent = "Wersja " + ver; // Tekst widoczny dla użytkownika
        versionSelect.appendChild(option);
      });

      // Aktywowanie elementów interfejsu po wczytaniu danych
      versionSelect.disabled = false;
      button.disabled = false;
    } catch (error) {
      // Obsługa błędów parsowania JSON
      alert("Nieprawidłowy plik JSON.");
      console.error(error);
    }
  };

  // Rozpoczęcie odczytu pliku jako tekst
  reader.readAsText(file);
});

// Obsługa kliknięcia przycisku generowania
button.addEventListener("click", function () {
  // Pobranie wybranej wersji i konwersja na liczbę
  const selectedVersion = parseInt(versionSelect.value);
  
  // Walidacja wyboru wersji
  if (!selectedVersion) {
    alert("Wybierz wersję.");
    return;
  }

  // Filtrowanie danych - tylko elementy z wybranej wersji
  const elements = jsonData.filter((item) => item.version === selectedVersion);
  
  // Generowanie strony na podstawie przefiltrowanych elementów
  generujStrone(elements);
});

/**
 * Funkcja generująca elementy HTML na stronie na podstawie przekazanych danych
 * @param {Array} elements - Tablica obiektów reprezentujących elementy do wygenerowania
 */
function generujStrone(elements) {
  // Czyszczenie kontenera przed generowaniem nowej zawartości
  container.innerHTML = "";

  // Iteracja przez wszystkie elementy do wygenerowania
  elements.forEach((element) => {
    // Pominięcie elementu jeśli nie ma typu
    if (!element.type) return;

    // Tworzenie elementu DOM określonego typu (np. div, a, p)
    const el = document.createElement(element.type);

    // Ustawianie właściwości elementu na podstawie danych:
    
    // Obsługa tekstu/contentu (różne nazwy mogą być używane w JSON)
    if (element.text) el.textContent = element.text;
    if (element.content) el.textContent = element.content;
    
    // Obsługa atrybutu href dla linków
    if (element.href) el.href = element.href;
    
    // Obsługa klas CSS
    if (element.class) el.className = element.class;

    // Dodawanie stworzonego elementu do kontenera
    container.appendChild(el);
  });
}
