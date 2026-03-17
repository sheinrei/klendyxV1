

/**
 * Classe de base pour la construction d'un graph
 * @class
 */

class GraphBase {

    /**
     * @param {Array<string>} label - Label positionné sur l'axe X
     * @param {Array<number>} data - Valeurs correpondant
     * @param {string} title - Titre de la data
     * @param {HTMLCanvasElement} ctx - Canvas input pour le graph
     */

    constructor(label, data, title, ctx) {
        this.label = label
        this.data = data
        this.title = title
        this.ctx = ctx
        this.css = getComputedStyle(document.documentElement)
        this.chart = null

        if (this.label.length !== this.data.length) {
            throw new Error(`Le nombre de label n'est pas égal au nombre de data => label : ${this.label.length} Data : ${this.data.length}`)
        }
    }

    valideData() {
        if (!Array.isArray(this.label)) {
            console.log(this.label)
            throw new Error(`Erreur de typage, label n'est pas un array : typeOf(label) : ${typeof (this.label)}`)
        }
        if (!Array.isArray(this.data)) {
            throw new Error(`Erreur de typage, data n'est pas un array : typeOf(data) : ${typeof (this.data)}`)
        }
        if (this.label.length !== this.data.length) {
            throw new Error(`Le nombre de label n'est pas égal au nombre de data => label : ${this.label.length} Data : ${this.data.length}`)
        }
    }

    getTheme() {
        return {
            primary: this.css.getPropertyValue("--primary-color").trim(),
            borderColor: this.css.getPropertyValue("--border-color").trim(),
        }
    }

    getAnimation() {
        return {
            duration: 700,
            easing: "EaseOutQuart",
            delay: (ctx) => ctx.dataIndex * 80
        }
    }



    destroyGraph() {
        this.chart?.destroy()
    }
}

export default GraphBase