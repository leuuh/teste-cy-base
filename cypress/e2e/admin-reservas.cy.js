/// <reference types="cypress" />

describe('Funcionalidade: Administrar Reservas de livros', () => {

  context('Login via UI (abordagem tradicional)', () => {

    beforeEach(() => {
      cy.loginAdmin(Cypress.env('ADMIN_EMAIL'), Cypress.env('ADMIN_SENHA'))
      cy.setCookie('jwt_education_shown', 'true')
    })

    it('Deve exibir as reservas via intercept', () => {
      cy.fixture('reservas').then((dadosReserva) => {
        cy.intercept('GET', 'api/reservations*', {
          statusCode: 200,
          body: dadosReserva
        }).as('listarReservas')

        cy.visit('dashboard.html')
        cy.wait('@listarReservas')
      })
    })

    it('Deve simular erro ao tentar exibir as reservas via intercept', () => {
      cy.fixture('reservas').then((dadosReserva) => {
        cy.intercept('GET', 'api/reservations*', {
          statusCode: 400,
          body: dadosReserva
        }).as('listarReservasErro')

        cy.visit('dashboard.html')
        cy.wait('@listarReservasErro')
        cy.get('#alert-container').should('contain', 'Erro ao carregar informações')
      })
    })

  })

  context('App Actions — Login Admin via API (sem UI de login)', () => {

    beforeEach(() => {
      /**
       * App Actions: configura o estado da aplicação diretamente
       * via API, sem passar pela tela de login. Mais rápido e isolado.
       */
      cy.loginAdminApp(Cypress.env('ADMIN_EMAIL'), Cypress.env('ADMIN_SENHA'))
      cy.setCookie('jwt_education_shown', 'true')
    })

    it('Deve exibir as reservas corretamente com dados mockados via App Actions', () => {
      cy.fixture('reservas').then((dadosReserva) => {
        cy.intercept('GET', 'api/reservations*', {
          statusCode: 200,
          body: dadosReserva
        }).as('listarReservasAppActions')

        cy.visit('dashboard.html')
        cy.wait('@listarReservasAppActions')

        // Valida que os dados da fixture aparecem na tela
        cy.contains('A Arte da Guerra do chizunshur').should('be.visible')
        cy.contains('Sun Tzu').should('be.visible')
      })
    })

    it('Deve validar as estatísticas das reservas via App Actions', () => {
      cy.fixture('reservas').then((dadosReserva) => {
        cy.intercept('GET', 'api/reservations*', {
          statusCode: 200,
          body: dadosReserva
        }).as('estatisticasReservas')

        cy.visit('dashboard.html')
        cy.wait('@estatisticasReservas').then((interception) => {
          // Valida que o payload retornado bate com a fixture
          expect(interception.response.statusCode).to.equal(200)
          expect(interception.response.body.statistics.active).to.equal(1)
          expect(interception.response.body.pagination.total).to.equal(1)
        })
      })
    })

    it('Deve simular erro 400 nas reservas e exibir alerta — via App Actions', () => {
      cy.intercept('GET', 'api/reservations*', {
        statusCode: 400,
        body: { message: 'Requisição inválida' }
      }).as('erroReservasAppActions')

      cy.visit('dashboard.html')
      cy.wait('@erroReservasAppActions')
      cy.get('#alert-container').should('contain', 'Erro ao carregar informações')
    })

    it('Deve simular erro 500 (servidor) nas reservas — via App Actions', () => {
      cy.intercept('GET', 'api/reservations*', {
        statusCode: 500,
        body: { message: 'Erro interno do servidor' }
      }).as('erroServidorReservas')

      cy.visit('dashboard.html')
      cy.wait('@erroServidorReservas')
      cy.get('#alert-container').should('be.visible')
    })

    it('Deve verificar que o token admin está configurado no localStorage — via App Actions', () => {
      cy.visit('dashboard.html')

      cy.window().then((win) => {
        const token = win.localStorage.getItem('authToken')
        const isAdmin = win.localStorage.getItem('isAdmin')

        expect(token).to.not.be.null
        expect(token).to.not.equal('')
        expect(isAdmin).to.equal('true')
      })
    })

  })

})