/// <reference types="cypress" />

describe('Login no hub de leitura', () => {

  beforeEach(() => {
    cy.visit('login.html')
    //cy.setCookie('jwt_education_shown', 'true') 
  });

  it('Deve fazer login com sucesso com usuário comum - usando comando customizado', () => {
    cy.login(Cypress.env('USER_EMAIL'), Cypress.env('USER_SENHA'))
  })

  it('Deve fazer login com sucesso com usuário admin - usando comando customizado', () => {
    cy.login(Cypress.env('ADMIN_EMAIL'), Cypress.env('ADMIN_SENHA'), false)

  })

  it('Deve fazer login com sucesso com usuário comum - usando intercept', () => {
    cy.intercept('POST', 'api/login',
      {
        statusCode: 200,
        body: {
          token: 'token123'
        }
      }).as('loginMock')

    cy.login(Cypress.env('USER_EMAIL'), Cypress.env('USER_SENHA'))
    cy.wait('@loginMock')
    cy.get('h4').should('contain', 'Olá')
  })

  it('Deve fazer login com sucesso com usuario comum usando comando customizado - via API', () => {
    cy.loginApp(Cypress.env('USER_EMAIL'), Cypress.env('USER_SENHA'))
  });

  it('Deve fazer login com sucesso com usuario comum usando comando customizado - setando token', () => { // em ambiente controlado e sera mais rapido
    cy.loginToken(Cypress.env('TOKEN_COMUM'))
  })

  it('Deve simular um erro do servidor - usando intercept', () => {
    cy.intercept('POST', 'api/login', {
      statusCode: 500
    }).as('erroServer')
    cy.loginErro(Cypress.env('USER_EMAIL'), Cypress.env('USER_SENHA'))
    cy.wait('@erroServer')
    cy.get('#alert-container').should('contain', 'Erro de conexão. Tente novamente.')
  });

  it('Deve simular um erro do cliente - usando intercept', () => {
    cy.intercept('POST', 'api/login', {
      statusCode: 400, body: { erro: 'erro do cliente' }
    }).as('erroClient')
    cy.login(Cypress.env('USER_EMAIL'), Cypress.env('USER_SENHA'), false)
    cy.wait('@erroClient')
    cy.get('#alert-container').should('contain', 'Erro ao fazer login')
  });

})