import {LitElement, html, css, customElement, property} from 'lit-element';

@customElements('mill-button')
export class MillButton extends LitElement {
    @property() data = '';


    render(){
        return html`
        <a class="btn btn-primary" href="/start" role="button">${this.data}</a>
        `;
    }
}

customElements.define('mill-button', MillButton);