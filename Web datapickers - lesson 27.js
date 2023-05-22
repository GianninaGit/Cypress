/// <reference types='cypress' />

const { ElementSchemaRegistry } = require("@angular/compiler")
const { DH_UNABLE_TO_CHECK_GENERATOR } = require("constants")

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

    it('assert property', () => {
        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Datepicker').click()
        
    
        cy.contains('nb-card', 'Common Datepicker').find('input').then( input => {
            cy.wrap(input).click()
            cy.get('nb-calendar-day-picker'). contains('18').click()
            cy.wrap(input).invoke('prop', 'value').should('contain', 'Apr 18, 2023')
        })
    })

    it('radio button', () => {
        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()

        cy.contains('nb-card', 'Using the Grid').find('[type="radio"]').then(radioButton => {
            cy.wrap(radioButton)
                .first() //es lo mismo que buscar por index .eq(0) Marco opción 1.
                .check({force:true})
                .should('be.checked')

            cy.wrap(radioButton)
                .eq(1) //busco por index (quiero ver el 2do botón) Marco opción 2.
                .check({force:true})
            
            cy.wrap(radioButton)
                .first() //reviso que el Botón 1 esté desmarcado (porque marqué el 2do).
                .should('not.be.checked')

            cy.wrap(radioButton)
                .eq(2) //reviso botón "Disabled".
                .should('be.disabled')
        
        })
    })
    it('check boxes', () => {
        cy.visit('/')
        cy.contains('Modal & Overlays').click()
        cy.contains('Toastr').click()

        cy.get('[type="checkbox"]').check({force:true}) //busco el input. Check marca lo unchecked pero no desmarca.
        cy.get('[type="checkbox"]').eq(0).click({force:true}) //Click desmarca lo que esté checked.

        //CHECK METHOD: Sólo usar con types INPUT de CHECKBOX Y RADIO BUTTONS. Solo check, no uncheck -> usar .click()


    })

    //video 27: Datepicker
    it.only('assert property', () => {
                
        function selectDay(day) {
            let date = new Date() //esto obtiene el día actual del sistema
            date.setDate(date.getDate() + day) 
            //.getDate: éste método obtiene el día actual del mes, y le añade 3.
            let futureDay = date.getDate() 
            let futureMonth = date.toLocaleString('en-us', {month:'short'})
            let dateAssert = futureMonth+ ' '+futureDay+', '+date.getFullYear()
            cy.get('nb-calendar-navigation').invoke('attr', 'ng-reflect-date').then(dateAttribute => {
                if(!dateAttribute.includes(futureMonth)){
                    cy.get('[data-name="chevron-right"]').click()
                    selectDay(day)
                } else {
                    cy.get('nb-calendar-day-picker [class="day-cell ng-star-inserted"]').contains(futureDay).click()
                }
            }) 
            return dateAssert
        }
        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Datepicker').click()

        cy.contains('nb-card', 'Common Datepicker').find('input').then( input => {
            cy.wrap(input).click()
            let dateAssert = selectDay(1)
            cy.wrap(input).invoke('prop', 'value').should('contain', dateAssert)
        })

        //en-us en lugar de default para que obtenga bien el formato del mes, sino da mal el mes.
        cy.contains('nb-card', 'Common Datepicker').find('input').then( input => {
            cy.wrap(input).click()
           
        
        })

    })
    
})
