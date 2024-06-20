const express = require('express'); // Importuje modul Express
const app = express(); // Vytvoří novou aplikaci Express
const path = require('path'); // Importuje modul Path pro práci s cestami
const bodyParser = require('body-parser'); // Importuje modul Body-Parser pro zpracování těla požadavků
const fs = require('fs'); // Importuje modul File System pro práci se soubory

// Nastavení EJS jako šablonovací engine
app.set('view engine', 'ejs'); // Nastaví EJS jako šablonovací engine
app.set('views', path.join(__dirname, 'views')); // Nastaví adresář pro šablony na 'views' v aktuálním adresáři

// Middleware pro statické soubory
app.use(express.static(path.join(__dirname, 'public'))); // Nastaví adresář pro statické soubory na 'public'
app.use(bodyParser.json()); // Nastaví middleware pro zpracování JSON těla požadavků

// Route pro úvodní stránku
app.get('/', (req, res) => {
    res.render('index'); // Vykreslí soubor index.ejs
});

// Route pro tabulku
app.get('/tabulka', (req, res) => {
    res.render('tabulka'); // Vykreslí soubor tabulka.ejs
});

// API endpoint pro ukládání skóre
app.post('/save-score', (req, res) => {
    const { nickname, score } = req.body; // Destrukturování přijatého JSON těla požadavku
    const responseFile = path.join(__dirname, 'public', 'responses.json'); // Nastaví cestu k souboru responses.json
    // Načte obsah souboru responses.json
    fs.readFile(responseFile, 'utf8', (err, data) => {
        if (err) { // Pokud nastane chyba při čtení souboru
            console.error(err); // Vypíše chybu do konzole
            res.status(500).send('Server error'); // Odešle chybu zpět klientovi
            return;
        }
        let highscores = JSON.parse(data); // Převede JSON data na objekt
        highscores.push({ id: Date.now(), nickname, score }); // Přidá nové skóre do pole
        highscores.sort((a, b) => b.score - a.score); // Seřadí pole podle skóre sestupně
        highscores = highscores.slice(0, 10); // Uchová pouze prvních 10 nejvyšších skóre
        // Zapíše aktualizované pole zpět do souboru responses.json
        fs.writeFile(responseFile, JSON.stringify(highscores, null, 2), (err) => {
            if (err) { // Pokud nastane chyba při zápisu do souboru
                console.error(err); // Vypíše chybu do konzole
                res.status(500).send('Server error'); // Odešle chybu zpět klientovi
                return;
            }
            res.status(200).send('Highscore bylo úspěšně uloženo do responses.json.'); // Odešle úspěšnou odpověď klientovi
        });
    });
});

// Spuštění serveru
const port = process.env.PORT || 3000; // Nastaví port na hodnotu z proměnného prostředí nebo na 3000
app.listen(port, () => {
    console.log(`Server běží na adrese http://localhost:${port}`); // Vypíše informaci o spuštění serveru do konzole
});
