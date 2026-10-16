import { logoutUser, onAuthReady } from '/src/authentication.js';   // Our function to log out the user

class SiteNavbar extends HTMLElement {
    constructor() {
        super();
        this.renderNavbar();
        this.renderAuthControls();
    }

    renderNavbar() {
        this.innerHTML = `
            <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">GoalGetter</a>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav" style="text-align: center">
          <hr>
          <li class="nav-item">
            <a class="nav-link active" href="#">Profile</a>
          </li>
          <hr>

          <li class="nav-item">
            <a class="nav-link active" href="#">Achievements</a>
          </li>
          <hr>

          <li class="nav-item">
            <a class="nav-link active" href="#">Settings</a>
          </li>
          <hr>

          <li class="nav-item">
            <a class="nav-link active" href="#">Help</a>
          </li>
          <hr>
        </ul>
      </div>
    </div>
  </nav>
        `;
    }

    /**
    * Displays Log in or Log out button in the navbar based on Firebase authentication status.
    * Updates automatically when the user's login status changes.
    * Uses callbacks to detect auth changes and handle the Log out button click.
    */
    renderAuthControls() {
        const authControls = this.querySelector('#authControls'); // Find #authControls inside this navbar

        // Invisible placeholder prevents layout shifting while Firebase checks login status
        authControls.innerHTML = `<div class="btn btn-outline-light" style="visibility: hidden; min-width: 80px;">Log out</div>`;

        // Pass a callback that runs when Firebase reports the login status
        onAuthReady(function (user) { // Receives the user object (or null)

            if (user) { // User is logged in
                authControls.innerHTML = `<button class="btn btn-outline-light" id="signOutBtn" type="button" style="min-width: 80px;">Log out</button>`;

                const signOutBtn = authControls.querySelector('#signOutBtn');
                signOutBtn.addEventListener('click', logoutUser); // Callback: runs when Log out is clicked

            } else { // User is NOT logged in, and gets redirected to login page if user clicks the login button
                authControls.innerHTML = `<a class="btn btn-outline-light" id="loginBtn" href="/login.html" style="min-width: 80px;">Log in</a>`;
            }
        });
    }
}

customElements.define('site-navbar', SiteNavbar);