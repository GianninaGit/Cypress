/// <reference types='cypress' />

describe('Our first suite', () => {
it.only('radio button', () => {
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
})
