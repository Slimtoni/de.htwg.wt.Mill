import {css, html, LitElement} from "https://unpkg.com/@polymer/lit-element@latest/lit-element.js?module";



class MillButton extends LitElement {

    static get styles() {
        return [css`
      .btn-primary {
            background-color: #e05435;
            border: #e05435;
       }
       
      .btn-primary:hover{
            background-color: #5CBBB7;
       }
    `];
    }

    static get properties() {
        return { data: { type: String } };
    }
    constructor(){
        super();
        this.data = '';
    }

    render() {
        return html`
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
        <a class="btn btn-primary" href="/start" role="button">${this.data}</a>
        `;
    }
}

customElements.define('mill-button', MillButton);