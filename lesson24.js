// Carpeta: cypress.config.ts

const { defineConfig } = require('cypress')

module.exports = defineConfig({
  viewportHeight: 1080,
  viewportWidth: 1920,
  e2e: {
    baseUrl: 'http://localhost:4200',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
    excludeSpecPattern: ['**/1-getting-started/*', '**/2-advanced-examples/*'],
  },
})

// Carpeta. firstTest.spec.js

/// <reference types="cypress" />

const { copyFile } = require("fs")
const { start } = require("repl")

describe('Our first suite', () => {
    it('first test', () => {

        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()

        //Find element by TAG NAME:
        cy.get('input')
        //Find element by ID:
        cy.get('#inputEmail1')
        //Find element by CLASS NAME, va cualquier valor:
        cy.get('.input-full-width')
        //Find element by ATTRIBUTE NAME:
        cy.get('[placeholder]')
        //Find element by ATTRIBUTE NAME AND VALUE:
        cy.get('[type="email"]')
        //Find element by CLASS VALUE, van la clase y todos los valores:
        cy.get('[class="input-full-width size-medium shape-rectangle"]')
        //Find element by TAG NAME & ATTRIBUTE WITH VALUE:
        cy.get('input[placeholder="Email"]')
        //Find element by 2 DIFFERENTS ATTRIBUTES, se pueden agregar la cant. que se quiera, y pueden o no tener valor:
        cy.get('[placeholder="Email"][fullwidth]')
        //Find element by:
        //tag name
        //Attribute with value
        //ID
        //Class name
        cy.get('input[data-cy="imputEmail1"]#inputEmail1.input-full-width')
        //Find element by my own locator (recomended):
        cy.get('[data-cy="imputEmail1"]')

    })

// Solo quiero ejecutar este test, asi que le añado .only:
    it('second test', () => {
        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()
// Creo un locator priopio para buscar
        cy.get('[data-cy="SignInButton"]')
// Busco elemento por texto. Problema: donde encuentra un match, no revisa el resto:
        cy.contains('Sign in')
// Si quiero un elemento que está en una posición distinta a la primera, usar dos parámetros:
        cy.contains('[status="warning"]', 'Sign in')
// Si quiero un elemento que no tiene un identificador único, buscar en la sección:
        cy.get('#inputEmail3')
            .parents('form')
            .find('button')
            .should('contain', 'Sign in')
// Quiero partir desde el check de "remember me":
            .parents('form')
            .find('nb-checkbox')
            .click()
// Quiero buscar un elemento dentro de un sector, 
// ese sector tiene un título, pero el título está 
// separado del body, entonces voy al padre nb-card
// que contiene al titulo y al body
        cy.contains('nb-card', 'Horizontal form').find('[type="email"]')
    })

   it.only('then and wrap methods', () => {
         cy.visit('/')
         cy.contains('Forms').click()
         cy.contains('Form Layouts').click()
        
        // cy.contains('nb-card', 'Using the Grid').find('[for="inputEmail1"]').should("contain", "Email")
        // cy.contains('nb-card', 'Using the Grid').find('[for="inputPassword2"]').should("contain", "Password")
        // cy.contains('nb-card', 'Basic form').find('[for="exampleInputEmail1"]').should("contain", "Email address")
        // cy.contains('nb-card', 'Basic form').find('[for="exampleInputPassword1"]').should("contain", "Password")

        //selenium:
        // const firstForm = cy.contains('nb-card', 'Using the Grid')
        // firstForm.find('[for="inputEmail1"]').should("contain", "Email")
        // firstForm.find('[for="inputPassword2"]').should("contain", "Password")

        //cypress:
        cy.contains ('nb-card', 'Using the Grid').then( firstForm => {
            const password1Label = firstForm.find('[for="inputPassword2"]').text()
            expect(password1Label).to.equal('Password')

            cy.contains ('nb-card', 'Basic form').then( secondForm => {
                const password2Label = secondForm.find('[for="exampleInputPassword1"]').text()
                expect(password2Label).to.equal('Password')

            cy.wrap(secondForm).find('[for="exampleInputPassword1"]').should('contain', 'Password')
            })
        })

    })

