/// <reference types="cypress" />

describe('Our first suite', () => {
  
        it.only('Invoke command', () => {
        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()

        //1
        cy.get ('[for="exampleInputEmail1"]').should ('contain', 'Email address')

        //2
        cy.get ('[for="exampleInputEmail1"]').then (label =>{
            expect(label.text()).to.equal('Email address')
        })
          
         //3a
        cy.get ('[for="exampleInputEmail1"]').invoke('text'). then(text => {
            expect(text).to.equal('Email address')
        })

        //3b
        cy.contains('nb-card', 'Basic form')
            .find('nb-checkbox')
            .click()
            // no-> .find('span')
            .find('.custom-checkbox')
            .invoke('attr', 'class')
            // .should('contain', "checked") -> Funciona! Otra forma es:
            .then(classValue => {
                expect(classValue).to.contain('checked')
            })

          

    })
