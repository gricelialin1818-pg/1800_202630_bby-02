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
      <a class="navbar-brand" href="main-goals-listed.html">GoalGetter</a>

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

          <li class="nav-item menu-divider">
            <a class="nav-link active" href="achievements.html">Achievements</a>
          </li>
          <hr>

          <li class="nav-item menu-divider">
            <a class="nav-link active" href="#">Settings</a>
          </li>
          <hr>

          <li class="nav-item menu-divider">
            <a class="nav-link active" href="#">Help</a>
          </li>
          <hr>

          <li class="nav-item menu-divider">
            <a class="nav-link active" href="#" id="signOutBtn">Sign Out</a>
          </li>
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
    const signOutBtn = this.querySelector('#signOutBtn');

    // Click → sign out, then logoutUser redirects to index.html
    signOutBtn.addEventListener('click', async (event) => {
      event.preventDefault();
      await logoutUser();
    });

    // Show Sign Out only when someone is logged in
    onAuthReady((user) => {
      signOutBtn.parentElement.style.display = user ? "" : "none";
    });
  }
}

customElements.define('site-navbar', SiteNavbar);
