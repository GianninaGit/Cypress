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
    it('assert property', () => {
                
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

    //Video 28: Lists & dropdowns
    it('lists and dropdowns', () => {
        cy.visit('/')
        //1
        // cy.get('nav nb-select').click()
        // cy.get('.options-list').contains('Dark').click()
        // cy.get('nav nb-select').should('contain', 'Dark')
        // cy.get('nb-layout-header nav').should('have.css', 'background-color', 'rgb(34, 43, 69)')

        //2 Loop por lista de elemenetos usando metodo each:
        cy.get('nav nb-select').then( dropdown => {
            cy.wrap(dropdown).click()
            cy.get('.options-list nb-option').each( (listItem, index) => {
                const itemText = listItem.text().trim()

                const colors = {
                    "Light": "rgb(255, 255, 255)",
                    "Dark": "rgb(34, 43, 69)", 
                    "Cosmic": "rgb(50, 50, 89)", 
                    "Corporate": "rgb(255, 255, 255)"
                }

                cy.wrap(listItem).click()
                cy.wrap(dropdown).should('contain', itemText)
                cy.get('nb-layout-header nav').should('have.css', 'background-color', colors[itemText])
                if (index < 3) {
                    cy.wrap(dropdown).click()
                }
            })
        })

    })
    //Video 29: Web tables
    it.only('Web tables', () => {
        cy.visit('/')
        cy.contains('Tables & Data').click()
        cy.contains('Smart Table').click()

        //1 Modificar elemento en una celda:
        cy.get('tbody').contains('tr', 'Larry').then( tableRow => {
            cy.wrap(tableRow).find('.nb-edit').click()
            cy.wrap(tableRow).find('[placeholder="Age"]').clear().type('25')
            cy.wrap(tableRow).find('.nb-checkmark').click()
            cy.wrap(tableRow).find('td').eq(6).should('contain', '25')
        })

        //2 Añadir fila:
        cy.get('thead').find('.nb-plus').click()
        cy.get('thead').find('tr').eq(2).then( tableRow => {
            cy.wrap(tableRow).find('[placeholder="First Name"]').type('Artem')
            cy.wrap(tableRow).find('[placeholder="Last Name"]').type('Bondar')
            cy.wrap(tableRow).find('.nb-checkmark').click()
        })

        //3 Chequear que la info añadida es correcta:
        cy.get('tbody tr').first().find('td').then( tableColumns => {
            cy.wrap(tableColumns).eq(2).should('contain', 'Artem')
            cy.wrap(tableColumns).eq(3).should('contain', 'Bondar')
        })
        
        //4 Filtrar por edad en la columna Age, agregar tiempo para dejar que cargue búsqueda:
        const age = [20, 30, 40, 200]

        cy.wrap(age).each( age => {
            cy.get('[placeholder="Age"]').clear().type(age)
            cy.wait(500)
            cy.get('tbody tr').each( tableRow => {
                if (age == 200){
                    cy.wrap(tableRow).should('contain', 'No data found')
                } else {
                    cy.wrap(tableRow).find('td').eq(6).should('contain', age)

                }
        })
        
        })


    })
})
