describe('CRUD Operations on Categories Page', () => {
    beforeEach(() => {
        cy.login('dima', '123456');
    });

    it('Adds a new category', () => {
        cy.visit('/categories');

        cy.get('input[name="name"]').type('Тестова категорія');
        cy.get('input[name="description"]').type('Опис тестової категорії');
        cy.get('button').contains('Додати категорію').click();

        cy.contains('Тестова категорія').should('exist');
        cy.contains('Опис тестової категорії').should('exist');
    });

    it('Edits an existing category', () => {
        cy.visit('/categories');

        cy.contains('Тестова категорія')
            .parent('tr')
            .find('button')
            .contains('Редагувати')
            .click();

        cy.get('input[name="new_name"]').clear().type('Редагована категорія');
        cy.get('input[name="new_description"]').clear().type('Опис редагованої категорії');
        cy.get('button').contains('Зберегти').click();

        cy.contains('Редагована категорія').should('exist');
        cy.contains('Опис редагованої категорії').should('exist');
    });

    it('Deletes a category', () => {
        cy.visit('/categories');

        cy.contains('Редагована категорія')
              .parent('tr')
              .find('button')
              .contains('Видалити')
              .click();

        cy.contains('Редагована категорія').should('not.exist');
    });
});
