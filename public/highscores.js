const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

// Nastavení EJS jako šablonovací engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware pro statické soubory
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

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
    const { nickname, score } = req.body;
    const responseFile = path.join(__dirname, 'public', 'responses.json');
    fs.readFile(responseFile, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Server error');
            return;
        }
        let highscores = JSON.parse(data);
        highscores.push({ id: Date.now(), nickname, score });
        highscores.sort((a, b) => b.score - a.score);
        highscores = highscores.slice(0, 10); // Uchování pouze prvních 10 nejvyšších skóre
        fs.writeFile(responseFile, JSON.stringify(highscores, null, 2), (err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Server error');
                return;
            }
            res.status(200).send('Highscore bylo úspěšně uloženo do responses.json.');
        });
    });
});

// Spuštění serveru
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server běží na adrese http://localhost:${port}`);
});
