// Data loading and table population
document.addEventListener("DOMContentLoaded", function() {
    fetch('data.csv')
        .then(response => response.text())
        .then(data => {
            const rows = data.split('\n').slice(1); // Skip the header row
            const tableBody = document.querySelector('#scoreTable tbody');
            const dataRows = rows
                .filter(row => row.trim() !== '') // Ignore empty lines
                .map(row => {
                    const cols = row.split(',');
                    return {
                        game: cols[0],
                        score: parseInt(cols[1], 10),
                        summary: cols[2],
                        setup: parseInt(cols[3], 10),
                        expandability: parseInt(cols[4], 10),
                        complexity: parseInt(cols[5], 10),
                        material: parseInt(cols[6], 10),
                        space: parseInt(cols[7], 10),
                        players: parseInt(cols[8], 10),
                        duration: parseInt(cols[9], 10)
                    };
                });

            // Sort rows by score in descending order
            dataRows.sort((a, b) => b.score - a.score);

            // Populate the table
            dataRows.forEach((row, index) => {
                const tr = document.createElement('tr');
                tr.dataset.totalScore = row.score;
                tr.dataset.summary = row.summary;
                tr.dataset.setup = row.setup;
                tr.dataset.expandability = row.expandability;
                tr.dataset.complexity = row.complexity;
                tr.dataset.material = row.material;
                tr.dataset.space = row.space;
                tr.dataset.players = row.players;
                tr.dataset.duration = row.duration;

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


//  Search functionality
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

// Dark mode
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    themeToggle.addEventListener('change', () => {
        body.classList.toggle('dark-mode');
    });
});

// Popup
document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('#scoreTable tbody');
    const popupCard = document.getElementById('popupCard');
    const popupTitle = document.getElementById('popupTitle');
    const popupDetails = document.getElementById('popupDetails');
    const closeBtn = document.querySelector('.close-btn');

    const popupSetup = document.getElementById('popupSetup');
    const popupExpandability = document.getElementById('popupExpandability');
    const popupComplexity = document.getElementById('popupComplexity');
    const popupMaterial = document.getElementById('popupMaterial');
    const popupSpace = document.getElementById('popupSpace');
    const popupPlayers = document.getElementById('popupPlayers');
    const popupDuration = document.getElementById('popupDuration');

    tableBody.addEventListener('click', (event) => {
        const row = event.target.closest('tr');
        if (row) {
            const gameName = row.cells[1].textContent;
            const totalScore = parseInt(row.dataset.totalScore, 10);
            const summary = row.dataset.summary;

            popupTitle.textContent = gameName;
            popupDetails.innerHTML = ''; // Clear previous content

            // Create duck icons for total score
            const normalizedScore = Math.round((totalScore / 35) * 5);
            for (let i = 0; i < 5; i++) {
                const img = document.createElement('img');
                img.src = i < normalizedScore ? 'assets/duck.png' : 'assets/duck_outline.png';
                img.alt = i < normalizedScore ? 'Duck' : 'Duck Outline';
                if (i >= normalizedScore) {
                    img.classList.add('duck-outline');
                }
                img.style.height = '20px'; // Adjust the size as needed
                popupDetails.appendChild(img);
            }
            const scoreText = document.createTextNode(` ${totalScore}/35`);
            popupDetails.appendChild(scoreText);

            // Add summary below the duck score
            const summaryText = document.createElement('p');
            summaryText.textContent = summary;
            popupDetails.appendChild(summaryText);

            // Function to create duck icons for a given score
            const createDuckIcons = (score) => {
                const container = document.createElement('span');
                for (let i = 0; i < 5; i++) {
                    const img = document.createElement('img');
                    img.src = i < score ? 'assets/duck.png' : 'assets/duck_outline.png';
                    img.alt = i < score ? 'Duck' : 'Duck Outline';
                    if (i >= score) {
                        img.classList.add('duck-outline');
                    }
                    img.style.height = '20px'; // Adjust the size as needed
                    container.appendChild(img);
                }
                return container;
            };

            // Use the scores from data attributes and create duck icons
            popupSetup.innerHTML = 'Aufbau: ';
            popupSetup.appendChild(createDuckIcons(parseInt(row.dataset.setup, 10)));

            popupExpandability.innerHTML = 'Erweiterbarkeit: ';
            popupExpandability.appendChild(createDuckIcons(parseInt(row.dataset.expandability, 10)));

            popupComplexity.innerHTML = 'Komplexität: ';
            popupComplexity.appendChild(createDuckIcons(parseInt(row.dataset.complexity, 10)));

            popupMaterial.innerHTML = 'Material: ';
            popupMaterial.appendChild(createDuckIcons(parseInt(row.dataset.material, 10)));

            popupSpace.innerHTML = 'Platzbedarf: ';
            popupSpace.appendChild(createDuckIcons(parseInt(row.dataset.space, 10)));

            popupPlayers.innerHTML = 'Spieleranzahl: ';
            popupPlayers.appendChild(createDuckIcons(parseInt(row.dataset.players, 10)));

            popupDuration.innerHTML = 'Spieldauer: ';
            popupDuration.appendChild(createDuckIcons(parseInt(row.dataset.duration, 10)));

            popupCard.style.display = 'block';
        }
    });

    closeBtn.addEventListener('click', () => {
        popupCard.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === popupCard) {
            popupCard.style.display = 'none';
        }
    });
});
