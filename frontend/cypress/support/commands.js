Cypress.Commands.add('login', (username, password) => {
  cy.request('POST', 'http://localhost:5000/api/auth/login', {
    username,
    password,
  }).then((response) => {
    expect(response.status).to.eq(200);
    // Сохранение токена в локальное хранилище
    window.localStorage.setItem('token', response.body.token);
  });
});
