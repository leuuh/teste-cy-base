/// <reference types="cypress" />

describe('Funcionalidade: Administrar Reservas de livros', () => {

  beforeEach(() => {
    cy.loginAdmin(Cypress.env('ADMIN_EMAIL'), Cypress.env('ADMIN_SENHA'))
    cy.setCookie('jwt_education_shown', 'true')
    //cy.loginToken(Cypress.env('TOKEN_COMUM'))
  });

  it('Deve exibir as reservas via intercept', () => {
    cy.fixture('reservas').then((dadosReserva) => {
      cy.intercept('GET', 'api/reservations*', {
        statusCode: 200,
        body: dadosReserva
      }).as('listarReservas')

      cy.visit('dashboard.html')
      cy.wait('@listarReservas')

    })
  });

  it.only('Deve simular erro ao tentar exibir as reservas via intercept', () => {
    cy.fixture('reservas').then((dadosReserva) => {
      cy.intercept('GET', 'api/reservations*', {
        statusCode: 400,
        body: dadosReserva
      }).as('listarReservasErro')
      cy.loginErro(Cypress.env('ADMIN_EMAIL'), Cypress.env('ADMIN_SENHA'))
      cy.visit('dashboard.html')
      cy.wait('@listarReservasErro')
      cy.get('#alert-container').should('contain', 'Erro ao carregar informações')

    })
  });

});