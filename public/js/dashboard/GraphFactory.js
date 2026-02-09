

import GraphBar from "./graphType/GraphBar.js";
import GraphLine from "./graphType/GraphLine.js"
import GraphDoughnut from "./graphType/GraphDoughnut.js"

class GraphFactory {

    static create(type, ctx, labels, data, title) {
        switch (type) {
            case 'bar':
                return new GraphBar(labels, data, title, ctx);
            case 'line':
                return new GraphLine(labels, data, title, ctx);
            case 'doughnut':
                return new GraphDoughnut(labels, data, title, ctx);
            default:
                throw new Error('Type de graph inconnu');
        }
    }
    
}

export default GraphFactory