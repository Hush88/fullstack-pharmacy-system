describe('CRUD Operations on Products Page', () => {
  beforeEach(() => {
    cy.login('dima', '123456');
  });

  it('Adds a new product', () => {
    cy.visit('/products');

    cy.get('input[name="name"]').type('Тестовий продукт');
    cy.get('input[name="price"]').type('100');
    cy.get('input[name="quantity"]').type('10');
    cy.get('select[name="categoryId"]').select('Категорія 1');
    cy.get('button').contains('Додати товар').click();

    cy.contains('Тестовий продукт').should('be.visible');
  });

  it('Edits an existing product', () => {
    cy.visit('/products');
    cy.contains('Тестовий продукт')
      .parent('tr')
      .find('button')
      .contains('Редагувати')
      .click();

    cy.get('input[name="new_name"]').clear().type('Оновлений продукт');
    cy.get('button').contains('Зберегти').click();

    cy.contains('Оновлений продукт').should('be.visible');
  });

  it('Deletes a product', () => {
    cy.visit('/products');
    cy.contains('Оновлений продукт')
      .parent('tr')
      .find('button')
      .contains('Видалити')
      .click();

    cy.contains('Оновлений продукт').should('not.exist');
  });
});
