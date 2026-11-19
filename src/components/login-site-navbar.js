// Menu before login
class LoginSiteNavbar extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
      <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
          <a class="navbar-brand" href="index.html">GoalGetter</a>
          <button class="navbar-toggler" type="button"
            data-bs-toggle="collapse" data-bs-target="#guestNavbar"
            aria-controls="guestNavbar" aria-expanded="false"
            aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="guestNavbar">
            <ul class="navbar-nav">
              <li class="nav-item">
                <a class="nav-link" href="index.html">Home</a>
              </li>
              <li class="nav-item menu-divider">
                <a class="nav-link" href="login.html">Login / Signup</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    `;
  }
}

customElements.define("login-site-navbar", LoginSiteNavbar);
