import GraphFactory from "./GraphFactory.js";

/**
 * Création de graphique via la librairie Chart.js
 */

class GraphController {

    constructor() {
        this.graphs = {}
        this.numberGraph = 0
    }

    createGraph(type, ctx, labels, data, title, name) {
        const graph = GraphFactory.create(type, ctx, labels, data, title);
        this.graphs[name] = graph;
        this.numberGraph ++
        graph.show()
    }

    updateGraph(name, newLabels, newData) {
        if (!this.graphs[name]) {
            throw new Error(`Le graphique ${name} n'existe pas`)
        }

        const graph = this.graphs[name]

        graph.data = newData
        graph.chart.data.datasets[0].data = newData
        graph.chart.data.labels = newLabels

        graph.chart.update()
    }
}

export default GraphController