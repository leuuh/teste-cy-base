// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('login', (email, senha, sucesso = true) => {
    cy.get('#email').type(email)
    cy.get('#password').type(senha)
    cy.get('#login-btn').click()
    if (sucesso) {
        cy.url().should('include', 'dashboard')
    }


})

Cypress.Commands.add('loginAdmin', (email, senha, sucesso = true) => {
    cy.visit('login.html')
    cy.get('#email').type(email)
    cy.get('#password').type(senha)
    cy.get('#login-btn').click()
    if (sucesso) {
        cy.url().should('include', 'admin-dashboard')
    }
})

Cypress.Commands.add('loginErro', (email, senha) => {
    cy.visit('login.html')
    cy.get('#email').type(email)
    cy.get('#password').type(senha)
    cy.get('#login-btn').click()
})

Cypress.Commands.add('loginApp', (email, senha) => {
    cy.request({
        method: 'POST',
        url: 'api/login',
        body: {
            "email": email,
            "password": senha
        }
    }).then((response) => {
        expect(response.status).to.equal(200)
        //Criar o estado da aplicação 
        window.localStorage.setItem('authToken', response.body.token)
        window.localStorage.setItem('isAdmin', false) //localStorageopcional daqui pra baixo, dependendo da necessidade do teste
        window.localStorage.setItem('userId', '1') //ou response.body.userId
        window.localStorage.setItem('userName', 'Leonardo')

        cy.visit('dashboard.html')
        cy.get('h4').should('contain', 'Olá')
    })
})

Cypress.Commands.add('loginToken', (token) => {
    window.localStorage.setItem('authToken', token)
    cy.visit('dashboard.html')
    cy.get('h4').should('contain', 'Olá')
})

/**
 * AppActions — Login Admin via API (sem passar pela UI de login)
 * Realiza POST na API, obtém o token e configura o estado da
 * aplicação diretamente no localStorage, pulando a tela de login.
 * Isso torna os testes mais rápidos, isolados e confiáveis.
 */
Cypress.Commands.add('loginAdminApp', (email, senha) => {
    cy.request({
        method: 'POST',
        url: 'api/login',
        body: {
            email: email,
            password: senha
        }
    }).then((response) => {
        expect(response.status).to.equal(200)

        // Configura o estado da aplicação (App Actions)
        window.localStorage.setItem('authToken', response.body.token)
        window.localStorage.setItem('isAdmin', true)
        window.localStorage.setItem('userId', response.body.userId || '2')
        window.localStorage.setItem('userName', response.body.userName || 'Admin')
    })
})