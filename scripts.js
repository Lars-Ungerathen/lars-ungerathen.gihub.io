document.addEventListener("DOMContentLoaded", function() {
    fetch('data.csv')
        .then(response => response.text())
        .then(data => {
            const rows = data.split('\n');
            const tableBody = document.querySelector('#scoreTable tbody');
            const dataRows = rows
                .filter(row => row.trim() !== '') // Ignore empty lines
                .map(row => {
                    const cols = row.split(',');
                    return { game: cols[0], score: parseInt(cols[1], 10) };
                });

            // Sort rows by score in descending order
            dataRows.sort((a, b) => b.score - a.score);

            // Populate the table
            dataRows.forEach((row, index) => {
                const tr = document.createElement('tr');
                const placementTd = document.createElement('td');
                if (index === 0) {
                    placementTd.textContent = '🥇';
                } else if (index === 1) {
                    placementTd.textContent = '🥈';
                } else if (index === 2) {
                    placementTd.textContent = '🥉';
                } else {
                    placementTd.textContent = index + 1;
                }
                tr.appendChild(placementTd);

                const gameTd = document.createElement('td');
                gameTd.textContent = row.game;
                tr.appendChild(gameTd);

                const scoreTd = document.createElement('td');
                const normalizedScore = Math.round((row.score / 35) * 5);
                for (let i = 0; i < 5; i++) {
                    const img = document.createElement('img');
                    img.src = i < normalizedScore ? 'assets/duck.png' : 'assets/duck_outline.png';
                    img.alt = i < normalizedScore ? 'Duck' : 'Duck Outline';
                    if (i >= normalizedScore) {
                        img.classList.add('duck-outline');
                    }
                    img.style.height = '20px'; // Adjust the size as needed
                    scoreTd.appendChild(img);
                }
                const scoreText = document.createTextNode(` ${row.score}/35`);
                scoreTd.appendChild(scoreText);
                tr.appendChild(scoreTd);

                tableBody.appendChild(tr);
            });
        });
});

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const tableBody = document.querySelector('#scoreTable tbody');

    searchInput.addEventListener('input', () => {
        const filter = searchInput.value.toLowerCase();
        const rows = tableBody.getElementsByTagName('tr');

        Array.from(rows).forEach(row => {
            const gameCell = row.getElementsByTagName('td')[1];
            if (gameCell) {
                const gameText = gameCell.textContent || gameCell.innerText;
                row.style.display = gameText.toLowerCase().includes(filter) ? '' : 'none';
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    themeToggle.addEventListener('change', () => {
        body.classList.toggle('dark-mode');
    });
});
