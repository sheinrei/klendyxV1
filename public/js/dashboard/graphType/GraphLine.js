import GraphBase from "./GraphBase.js"


class GraphLine extends GraphBase {


    show() {
        this.valideData()

        this.chart = new Chart(this.ctx, {
            type: "line",
            data: {
                labels: this.label,
                datasets: [{
                    label: this.title,
                    data: this.data,
                    borderWidth: 4,
                    borderColor: this.getTheme().borderColor,
                    fill: false,
                    backgroundColor: this.getTheme().primary, //if fill = true
                    tension: 0.4,

                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointBackgroundColor: '#4f46e5',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                }]
            },
            options: this.setOptions()
        });
    }
}

export default GraphLine