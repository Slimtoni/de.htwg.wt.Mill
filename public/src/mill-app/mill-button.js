import {html, LitElement, property} from "https://unpkg.com/@polymer/lit-element@latest/lit-element.js?module";


class MillButton extends LitElement {
    @property() data = '';


    render() {
        return html`
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
        <a class="btn btn-primary" href="/start" role="button">${this.data}</a>
        `;
    }
}

customElements.define('mill-button', MillButton);