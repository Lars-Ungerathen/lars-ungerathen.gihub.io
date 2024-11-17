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

            for(let i = 0; i <= ds[0].data.length + 20; i++) {
                labels.push(i);
            }

            const data = {
                labels: labels,
                datasets: ds
            };

            let imgLars = new Image();
            imgLars.src = '../assets/Icon_Gelber_Shy_Guy.png';

            let imgNils = new Image();
            imgNils.src = '../assets/Icon_Blauer_Shy_Guy.png';

            let imgAlina = new Image();
            imgAlina.src = '../assets/Icon_Oranger_Yoshi.png';

            let imgJulia = new Image();
            imgJulia.src = '../assets/Icon_Blauer_Yoshi.png';

            let imgPapi = new Image();
            imgPapi.src = '../assets/Icon_Yoshi.png';

            const config = {
                type: 'line',
                data: data,
                options: {
                    plugins: {
                        annotation: {
                            annotations: {
                                labelNils: {
                                    type: 'label',
                                    drawTime: 'afterDraw',
                                    content: imgNils,
                                    width: 25,
                                    height: 25,
                                    xValue: ds.find(dataset => dataset.label === "Nils").data.length - 1,
                                    yValue: ds.find(dataset => dataset.label === "Nils").data[ds.find(dataset => dataset.label === "Nils").data.length - 1],
                                    xAdjust: 30,
                                    yAdjust: 0,
                                    callout: {
                                        display: true,
                                        position: 'left'
                                    }
                                },
                                labelLars: {
                                    type: 'label',
                                    drawTime: 'afterDraw',
                                    content: imgLars,
                                    width: 25,
                                    height: 25,
                                    xValue: ds.find(dataset => dataset.label === "Lars").data.length - 1,
                                    yValue: ds.find(dataset => dataset.label === "Lars").data[ds.find(dataset => dataset.label === "Lars").data.length - 1],
                                    xAdjust: 30,
                                    yAdjust: 0,
                                    callout: {
                                        display: true,
                                        position: 'left'
                                    }
                                },
                                labelAlina: {
                                    type: 'label',
                                    drawTime: 'afterDraw',
                                    content: imgAlina,
                                    width: 25,
                                    height: 25,
                                    xValue: ds.find(dataset => dataset.label === "Alina").data.length - 1,
                                    yValue: ds.find(dataset => dataset.label === "Alina").data[ds.find(dataset => dataset.label === "Alina").data.length - 1],
                                    xAdjust: 30,
                                    yAdjust: 0,
                                    callout: {
                                        display: true,
                                        position: 'left'
                                    }
                                },
                                labelJulia: {
                                    type: 'label',
                                    drawTime: 'afterDraw',
                                    content: imgJulia,
                                    width: 25,
                                    height: 25,
                                    xValue: ds.find(dataset => dataset.label === "Julia").data.length - 1,
                                    yValue: ds.find(dataset => dataset.label === "Julia").data[ds.find(dataset => dataset.label === "Julia").data.length - 1],
                                    xAdjust: 30,
                                    yAdjust: 0,
                                    callout: {
                                        display: true,
                                        position: 'left'
                                    }
                                },
                                labelPapi: {
                                    type: 'label',
                                    drawTime: 'afterDraw',
                                    content: imgPapi,
                                    width: 25,
                                    height: 25,
                                    xValue: ds.find(dataset => dataset.label === "Papi").data.length - 1,
                                    yValue: ds.find(dataset => dataset.label === "Papi").data[ds.find(dataset => dataset.label === "Papi").data.length - 1],
                                    xAdjust: 30,
                                    yAdjust: 0,
                                    callout: {
                                        display: true,
                                        position: 'left'
                                    }
                                }
                            }
                        }
                    }
                }
            };

            new Chart(ctx, config);
        });
});
