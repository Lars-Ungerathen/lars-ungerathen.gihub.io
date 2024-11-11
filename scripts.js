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
                    const cols = row.split('|');
                    return {
                        game: cols[0],
                        summary: cols[1],
                        setup: parseInt(cols[2], 10),
                        expandability: parseInt(cols[3], 10),
                        complexity: parseInt(cols[4], 10),
                        material: parseInt(cols[5], 10),
                        space: parseInt(cols[6], 10),
                        players: parseInt(cols[7], 10),
                        duration: parseInt(cols[8], 10),
                        anlFun: parseInt(cols[9], 10)
                    };
                });

            dataRows.forEach(row => {
                row.score = row.setup + row.expandability + row.complexity + row.material + row.space + row.players + row.duration;
            });

            // Sort rows by score in descending order
            dataRows.sort((a, b) => b.score - a.score);

            // Populate the table
            dataRows.forEach((row, index) => {
                const tr = document.createElement('tr');
                tr.dataset.totalScore = row.score;
                tr.dataset.summary = row.summary;
                tr.dataset.setup = String(row.setup);
                tr.dataset.expandability = String(row.expandability);
                tr.dataset.complexity = String(row.complexity);
                tr.dataset.material = String(row.material);
                tr.dataset.space = String(row.space);
                tr.dataset.players = String(row.players);
                tr.dataset.duration = String(row.duration);
                tr.dataset.anlFun = String(row.anlFun);

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

// Filtering
document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('#scoreTable tbody');
    const searchInput = document.getElementById('searchInput');
    const minDuckInput = document.getElementById('minDuckInput');
    const maxDuckInput = document.getElementById('maxDuckInput');
    const resetButton = document.getElementById('resetButton');
    const toggleFilterButton = document.getElementById('toggleFilterButton');
    const filterContainer = document.getElementById('filterContainer');

    const filterTable = () => {
        const searchText = searchInput.value.toLowerCase();
        const minFilterValue = parseInt(minDuckInput.value, 10) || 0;
        const maxFilterValue = parseInt(maxDuckInput.value, 10) || 5;
        const rows = tableBody.querySelectorAll('tr');

        rows.forEach(row => {
            const gameName = row.cells[1].textContent.toLowerCase();
            const totalScore = parseInt(row.dataset.totalScore, 10);
            const normalizedScore = Math.round((totalScore / 35) * 5);

            const matchesSearch = gameName.includes(searchText);
            const matchesFilter = normalizedScore >= minFilterValue && normalizedScore <= maxFilterValue;

            if (matchesSearch && matchesFilter) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    };

    searchInput.addEventListener('input', filterTable);
    minDuckInput.addEventListener('input', filterTable);
    maxDuckInput.addEventListener('input', filterTable);
    resetButton.addEventListener('click', () => {
        searchInput.value = '';
        minDuckInput.value = '0';
        maxDuckInput.value = '5';
        filterTable();
    });

    toggleFilterButton.addEventListener('click', () => {
        // also check for empty string to handle the case when the display property is not set
        filterContainer.style.display = filterContainer.style.display === 'none' || filterContainer.style.display === "" ? 'flex' : 'none';
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
    const popupFunScoreTitle = document.getElementById('popupFunScoreTitle');

    tableBody.addEventListener('click', (event) => {
        const row = event.target.closest('tr');
        if (row) {
            const gameName = row.cells[1].textContent;
            const totalScore = parseInt(row.dataset.totalScore, 10);
            const summary = row.dataset.summary;
            const anlFunScore = parseInt(row.dataset.anlFun, 10);

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
                img.style.height = '20px';
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
                    img.style.height = '20px';
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
            // Create goose icons for Alina & Lars Fun Score
            const createGooseIcons = (score) => {
                const container = document.createElement('span');
                for (let i = 0; i < 5; i++) {
                    const img = document.createElement('img');
                    img.src = i < score ? 'assets/goose.png' : 'assets/goose_outline.png';
                    img.alt = i < score ? 'Goose' : 'Goose Outline';
                    if (i >= score) {
                        img.classList.add('goose-outline');
                    }
                    img.style.height = '30px';
                    container.appendChild(img);
                }
                return container;
            };

            // Append goose icons next to the Fun Score title
            popupFunScoreTitle.innerHTML = 'Alina & Lars Fun Score: ';
            popupFunScoreTitle.appendChild(createGooseIcons(anlFunScore));

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
