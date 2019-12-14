import {css, html, LitElement} from "https://unpkg.com/@polymer/lit-element@latest/lit-element.js?module";


class MillBox extends LitElement {

    static get styles() {
        return [css`
      .box {
            background-color: #efecef;
            padding: 1em;
            margin-bottom: 10px;
            margin-top: 10px;
            border-radius: 10px;
            border: 1px solid

       }
    `];
    }
    static get properties() {
        return {data: {type: String}};
    }

    constructor() {
        super();
        this.data = '';
    }

    render() {
        return html`
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
        <div class="box">
                    <p>${this.data}</p>
                 
        </div>
        `;
    }
}

customElements.define('mill-box', MillBox);