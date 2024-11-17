document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('multiLineChart').getContext('2d');

    const navToDuckCard = document.getElementById('navToDuckCard');
    navToDuckCard.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    fetch('../data/scores.txt')
        .then(response => response.text())
        .then(scores => {
            const players = scores.split('\n').slice(1); // Skip the header row

            let ds = [];
            let labels = [];
            const colorMap = {
                "Nils": "rgba(44,85,175, 1)",
                "Lars": "rgba(244,214,71, 1)",
                "Alina": "rgba(223,154,54, 1)",
                "Julia": "rgba(57,67,134, 1)",
                "Papi": "rgba(120,202,86, 1)",
            }

            players.filter(row => row.trim() !== '') // Skip empty rows
                .forEach(player => {
                    player = player.replace("[", "").replace("]", ""); // clean up the string
                    const playerData = player.split(' ');
                    const name = playerData[0];
                    ds.push({
                        label: name,
                        data: playerData.slice(1).map(score => parseInt(score)),
                        borderColor: colorMap[name],
                        borderWidth: 1,
                        fill: false,
                        pointRadius: 0
                    });
                })

            for(let i = 0; i <= ds[0].data.length; i++) {
                labels.push(i);
            }

            const data = {
                labels: labels,
                datasets: ds
            };

            const imgLabelPlugin = {
                id: 'image_label_plugin',
                afterDatasetsDraw: (chart) => {
                    console.log("image_label_plugin")
                    const ctx = chart.ctx;
                    chart.data.datasets.forEach((dataset, i) => {
                        const meta = chart.getDatasetMeta(i);
                        const lastPoint = meta.data[meta.data.length - 1];
                        const label = dataset.label;
                        ctx.save();
                        ctx.font = '12px Arial';
                        ctx.fillStyle = dataset.borderColor;
                        ctx.fillText(label, lastPoint.x + 5, lastPoint.y - 5);
                        ctx.restore();
                    });
                },
                defaults: {
                    color: 'lightGreen'
                }
            }


            const options = {
                scales: {
                    x: {
                        beginAtZero: true
                    }
                }
            }

            new Chart(ctx, {
                type: 'line',
                data: data,
                plugins: [imgLabelPlugin],
                options: options
            });
        });
});
