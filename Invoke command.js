/// <reference types="cypress" />

describe('Our first suite', () => {
  
        it('Invoke command', () => {
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

        //3b Checkear si está checkeado
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
        //3c Checkear fecha texto ingresado:


    })

    it.only('Assert property', () => {
        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Datepicker').click()
        cy.contains('nb-card', 'Common Datepicker').find('input').then( input => {
            cy.wrap(input).click()
            cy.get('nb-calendar-day-picker'). contains('18').click()
            cy.wrap(input).invoke('prop', 'value').should('contain', 'Apr 18, 2023')
        })
    })


