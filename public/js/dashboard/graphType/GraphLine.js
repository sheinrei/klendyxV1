import GraphBase from "./GraphBase.js"


class GraphLine extends GraphBase {

    
    show() {
        
        const maxWidth = window.innerWidth
        
        this.valideData()

        this.chart = new Chart(this.ctx, {
            type: "line",
            data: {
                labels: this.label,
                datasets: [{
                    label: this.title,
                    data: this.data,
                    borderWidth: 3,
                    borderColor: this.getTheme().borderColor,
                    fill: false,
                    backgroundColor: this.getTheme().primary, //if fill = true
                    tension: 0.2,

                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointBackgroundColor: '#4f46e5',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                }]
            },
            options: {
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 10,
                        ticks: {
                            stepSize: 1,
                            callback: function (value) {
                                return value + "h";
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: "black",
                            font: {
                                size: maxWidth < 500 ? 12 : 16,
                                weight: "bold",
                                family: "Jura"
                            }
                        }
                    }
                },
                animation: {
                    duration: this.getAnimation().duration,
                    easing: this.getAnimation().easing,
                },
                responsive: true,
                maintainAspectRatio: false,
            }
        });
    }
}

export default GraphLine