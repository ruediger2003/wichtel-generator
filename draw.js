const fs = require('fs');
const path = require('path');

// Pfad zur JSON-Datei
const dataPath = path.join(process.cwd(), 'data', 'names.json');

// Helper-Funktion, um die Namen aus der Datei zu lesen
const readNames = () => {
  const fileData = fs.readFileSync(dataPath);
  return JSON.parse(fileData);
};

// Helper-Funktion, um die Datei zu aktualisieren
const writeNames = (names) => {
  fs.writeFileSync(dataPath, JSON.stringify(names, null, 2));
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    let names = readNames();

    // Alle Namen abrufen, die noch nicht gezogen wurden
    const remainingNames = names.filter((n) => !n.is_drawn);

    if (remainingNames.length === 0) {
      return res.status(400).json({ error: 'Alle Namen wurden bereits gezogen!' });
    }

    // Einen zufälligen Namen ziehen
    const randomIndex = Math.floor(Math.random() * remainingNames.length);
    const drawnName = remainingNames[randomIndex];

    // Den Namen als gezogen markieren
    names = names.map((n) =>
      n.name === drawnName.name ? { ...n, is_drawn: true } : n
    );

    // Die aktualisierte Liste zurückschreiben
    writeNames(names);

    res.json({ drawnName: drawnName.name });
  } else {
    res.status(405).json({ error: 'Nur POST-Anfragen erlaubt.' });
  }
}
