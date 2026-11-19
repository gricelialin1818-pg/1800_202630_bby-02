class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
            <nav class="navbar fixed-bottom bg-body-tertiary" >
    <div class="container-fluid mx-auto" style="width: 950px">
      <a class="navbar-brand" href="main-goals-listed.html"><svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" fill="currentColor"
          class="bi bi-house-fill" viewBox="0 0 16 16">
          <path
            d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293z" />
          <path d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293z" />
        </svg></a>
      <a class="navbar-brand" href="add-goal-screen.html"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor"
          class="bi bi-plus-circle" viewBox="0 0 16 16">
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
          <path
            d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
        </svg></a>
      <a class="navbar-brand" href="social.html"><svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" fill="currentColor" class="bi bi-chat-heart-fill" viewBox="0 0 16 16">
  <path d="M8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6-.097 1.016-.417 2.13-.771 2.966-.079.186.074.394.273.362 2.256-.37 3.597-.938 4.18-1.234A9 9 0 0 0 8 15m0-9.007c1.664-1.711 5.825 1.283 0 5.132-5.825-3.85-1.664-6.843 0-5.132"/>
</svg></a>
    </div>
  </nav>

        `;
  }
}

customElements.define('site-footer', SiteFooter);
