//testWithPageObjects.js


const { onDatePickerPage } = require("../support/page_objects/datePickerPage")
const { onFormLayoutsPage } = require("../support/page_objects/formLayoutsPage")
const { navigateTo } = require("../support/page_objects/navigationPage")
const { onSmartTablePage } = require("../support/page_objects/smartTablePage")


describe('Test with Page Objects', () => {

    beforeEach('open application', () => {
        cy.visit('/')
    })

    it('verify navigation across the pages', () => {
        navigateTo.formLayoutsPage()
        navigateTo.datepickerPage()
        navigateTo.smartTablePage()
        navigateTo.tooltipPage()
        navigateTo.toasterPage()
        

    })

    it(' should submit Inline and Basic form and select tomorrow date in the calendar', () => {
        navigateTo.formLayoutsPage()
        onFormLayoutsPage.submitInlineFormWithNameAndEmail('Artem', 'test@test.com')
        onFormLayoutsPage.submitBasicFormWithEmailAndPassword('test@test.com', 'password')
        /*navigateTo.datepickerPage()
        onDatePickerPage.selectCommonDatepickerDateFromToday(1)
        onDatePickerPage.selectDatepickerWithRangeFromToday(7,14)*/
        navigateTo.smartTablePage()
        onSmartTablePage.addNewRecordWithFirstAndLastName('Artem', 'Bondar')
        onSmartTablePage.updateAgeByFirstName('Artem', '35')
        onSmartTablePage.deleteRowByIndex(1)
    })
})

//support -> datePickerPage.js 


function selectDay(day) {
    let date = new Date() //esto obtiene el día actual del sistema
    date.setDate(date.getDate() + day) 
    //.getDate: éste método obtiene el día actual del mes, y le añade 3.
    let futureDay = date.getDate() 
    let futureMonth = date.toLocaleString('default', {month:'short'})
    let dateAssert = futureMonth+' '+futureDay+', '+date.getFullYear()
    cy.get('nb-calendar-navigation').invoke('attr', 'ng-reflect-date').then(dateAttribute => {
        if(!dateAttribute.includes(futureMonth)){
            cy.get('[data-name="chevron-right"]').click()
            selectDay(day)
        } else {
            cy.get('.date-cell').not('.bounding-month').contains(futureDay).click()
        }
    }) 
    return dateAssert
}

export class DatepickerPage{


    selectCommonDatepickerDateFromToday(dayFromToday){
        cy.contains('nb-card', 'Common Datepicker').find('input').then( input => {
            cy.wrap(input).click()
            let dateAssert = selectDay(dayFromToday)
            cy.wrap(input).invoke('prop', 'value').should('contain', dateAssert)
            cy.wrap(input).should('have.value', dateAssert)
        })
    }
    selectDatepickerWithRangeFromToday(firstDay, secondDay){
        cy.contains('nb-card', 'Datepicker With Range').find('input').then( input => {
            cy.wrap(input).click()
            let dateAssertFirst = selectDay(firstDay)
            let dateAssertSecond = selectDay(secondDay)
            const finalDate = dateAssertFirst+' - '+dateAssertSecond
            cy.wrap(input).invoke('prop', 'value').should('contain', dateAssert)
            cy.wrap(input).should('have.value', dateAssert)
        })
    }
}

export const onDatePickerPage = new DatepickerPage()

// fromLayoutPage.js


export class FormLayoutsPage {
    
    submitInlineFormWithNameAndEmail(name, email) {
        cy.contains('nb-card', 'Inline form').find('form').then (form => {
            cy.wrap(form).find('[placeholder="Jane Doe"]').type(name)
            cy.wrap(form).find('[placeholder="Email"]').type(email)
            cy.wrap(form).find('[type="checkbox"]').check({force: true})
            cy.wrap(form).submit()
        })
    }
    
    submitBasicFormWithEmailAndPassword(email, password) {
        cy.contains('nb-card', 'Basic form').find('form').then (form => {
            cy.wrap(form).find('[placeholder="Email"]').type(email)
            cy.wrap(form).find('[placeholder="Password"]').type(password)
            cy.wrap(form).find('[type="checkbox"]').check({force: true})
            cy.wrap(form).submit
        })
    }
}

export const onFormLayoutsPage = new FormLayoutsPage()

// navigationPage.js

function selectGroupMenuItem(groupName) {
    cy.contains('a', groupName).then( menu => {
        cy.wrap(menu).find('.expand-state g g').invoke('attr', 'data-name').then( attr => {
            if ( attr.includes('left')){
                cy.wrap(menu).click()
            }
        })
    })
}

export class NavigationPage {
    formLayoutsPage() {
        selectGroupMenuItem('Form')
        cy.contains('Form Layouts').click()
    }
    datepickerPage() {
        selectGroupMenuItem('Form')
        cy.contains('Datepicker').click
    }
    toasterPage(){
        selectGroupMenuItem('Modal & Overlays')
        cy.contains('Toastr').click()
    }
    smartTablePage(){
        selectGroupMenuItem('Tables & Data')
        cy.contains('Smart Table').click()
    }
    tooltipPage(){
        selectGroupMenuItem('Modal & Overlays')
        cy.contains('Tooltip').click()
    }
    
}

export const navigateTo = new NavigationPage()

// smartTablePage.js

export class smartTablePage{
    updateAgeByFirstName(name, age) {
         //1 Modificar elemento en una celda:
         cy.get('tbody').contains('tr', name).then( tableRow => {
            cy.wrap(tableRow).find('.nb-edit').click()
            cy.wrap(tableRow).find('[placeholder="Age"]').clear().type(age)
            cy.wrap(tableRow).find('.nb-checkmark').click()
            cy.wrap(tableRow).find('td').eq(6).should('contain', age)
        })
    }
    addNewRecordWithFirstAndLastName(firstName, lastName) {
        //2 Añadir fila:
        cy.get('thead').find('.nb-plus').click()
        cy.get('thead').find('tr').eq(2).then( tableRow => {
            cy.wrap(tableRow).find('[placeholder="First Name"]').type(firstName)
            cy.wrap(tableRow).find('[placeholder="Last Name"]').type(lastName)
            cy.wrap(tableRow).find('.nb-checkmark').click()
        })

        //3 Chequear que la info añadida es correcta:
        cy.get('tbody tr').first().find('td').then( tableColumns => {
            cy.wrap(tableColumns).eq(2).should('contain', firstName)
            cy.wrap(tableColumns).eq(3).should('contain', lastName)
        })
    }
    deleteRowByIndex(index) {
        const stub = cy.stub()
        cy.on('window:confirm', stub)
        cy.get('tbody tr').eq(index).find('.nb-trash').click().then(() => {
            expect(stub.getCall(0)).to.be.calledWith('Are you sure you want to delete?')
        })
    }
}

export const onSmartTablePage = new smartTablePage()
