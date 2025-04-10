import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <header>
      <h1>Willkommen auf meiner persönlichen Website</h1>
    </header>
    <main>
      <section>
        <h2>Über mich</h2>
        <p>Hier kannst du Informationen über dich hinzufügen.</p>
      </section>
      <section>
        <h2>Projekte</h2>
        <p>Hier kannst du deine Projekte vorstellen.</p>
      </section>
    </main>
    <footer>
      <p>&copy; {{currentYear}} - Erstellt mit Angular</p>
    </footer>
  `,
  styles: [`
    :host {
      font-family: Arial, sans-serif;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      display: block;
    }
    header, footer {
      text-align: center;
      padding: 20px 0;
    }
    section {
      margin: 40px 0;
    }
  `]
})
export class AppComponent {
  currentYear = new Date().getFullYear();
}