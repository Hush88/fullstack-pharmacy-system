describe('Authentication Tests', () => {
    it('Logs in successfully with valid credentials', () => {
      cy.visit('/login');
      cy.get('input[name="username"]').type('dima');
      cy.get('input[name="password"]').type('123456');
      cy.get('button[type="submit"]').click();
  
      // Перевірити, що користувача перенаправлено на головну сторінку
      cy.url().should('include', '/');
    });
  
    it('Fails to login with invalid credentials', () => {
      cy.visit('/login');
      cy.get('input[name="username"]').type('wrong_user');
      cy.get('input[name="password"]').type('wrong_password');
      cy.get('button[type="submit"]').click();
  
      cy.on('window:alert', (alertText) => {
        // Проверяем текст alert
        expect(alertText).to.eq('Неправильні облікові дані');
      });
    });
  });
  