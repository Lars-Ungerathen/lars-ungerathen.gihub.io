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
                scoreTd.textContent = `${row.score}/35`;
                tr.appendChild(scoreTd);

                tableBody.appendChild(tr);
            });
        });
});
