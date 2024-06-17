document.addEventListener('DOMContentLoaded', () => {
    fetch('/responses.json')
        .then(response => response.json())
        .then(highscores => {
            const highscoresTable = document.getElementById('highscoresTable');
            highscores.forEach(score => {
                const row = document.createElement('tr');
                const nicknameCell = document.createElement('td');
                const scoreCell = document.createElement('td');

                nicknameCell.textContent = score.nickname;
                scoreCell.textContent = score.score;

                row.appendChild(nicknameCell);
                row.appendChild(scoreCell);

                highscoresTable.appendChild(row);
            });
        })
        .catch(error => console.error('Chyba při načítání skóre:', error));
});
