import GraphBase from "./GraphBase.js"



class GraphBar extends GraphBase{

    
    show() {
        this.valideData()

        new Chart(this.ctx, {
            type: "bar",
            data: {
                labels : this.label,
                datasets: [{
                    label: this.title,
                    data: this.data,
                    borderWidth: 1,
                    borderColor : this.getTheme().borderColor,
                    backgroundColor : this.getTheme().primary
                }],
            },
            options: this.setOptions()
        })
    }
}

export default GraphBar