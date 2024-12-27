describe('CRUD Operations on Users Page', () => {
  beforeEach(() => {
    cy.login('dima', '123456');
  });

  it('Adds a new user', () => {
    cy.visit('/users');

    cy.get('input[name="name"]').type('Тестовий юзер');
    cy.get('input[name="password"]').type('123456');
    cy.get('input[name="role"]').type('manager');
    cy.get('button').contains('Додати користувача').click();

    cy.contains('Тестовий юзер').should('exist');
  });

  it('Edits an existing user', () => {
    cy.visit('/users');

    cy.contains('Тестовий юзер')
      .parent('tr')
      .find('button')
      .contains('Редагувати')
      .click();

    cy.get('input[name="new_name"]').clear().type("Нове ім'я");
    cy.get('button').contains('Зберегти').click();

    cy.contains("Нове ім'я").should('exist');
  });

  it('Deletes a category', () => {
    cy.visit('/users');

    cy.contains("Нове ім'я")
      .parent('tr')
      .find('button')
      .contains('Видалити')
      .click();

    cy.contains("Нове ім'я").should('not.exist');
  });
});
