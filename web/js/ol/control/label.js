import Control from "ol/control/control";

class label extends Control {
    constructor() {
        let span = document.createElement("span");
        span.className = "uk-label uk-position-small uk-position-top-right";
        span.innerHTML = "";

        super({ element: span });

        this.span = span;
    }
    setContent(content) {
        this.span.innerHTML = content;
    }
}
export default label;
