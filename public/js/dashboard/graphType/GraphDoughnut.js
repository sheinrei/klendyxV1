import GraphBase from "./GraphBase.js";


class GraphDoughnut extends GraphBase {
  show() {

    this.valideData()

    this.chart = new Chart(this.ctx, {
      type: "doughnut",
      data: {
        labels: this.label,
        datasets: [{
          label: this.title,
          data: this.data,
          borderWidth: 1,
          borderColor: this.getTheme().borderColor,
          backgroundColor: this.getTheme().primary
        }]
      },
    });
  }
}

export default GraphDoughnut