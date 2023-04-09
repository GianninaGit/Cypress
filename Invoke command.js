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

    })
