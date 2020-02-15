describe('Autenticación en Los estudiantes', function() {
    //login fallido
    it('Login fallido', function() {
      cy.visit('https://losestudiantes.co')
      cy.contains('Cerrar').click()
      cy.contains('Ingresar').click()
      cy.get('.cajaLogIn').find('input[name="correo"]').click().type("wrongemail@example.com")
      cy.get('.cajaLogIn').find('input[name="password"]').click().type("1234")
      cy.get('.cajaLogIn').contains('Ingresar').click()
      cy.contains('El correo y la contraseña que ingresaste no figuran en la base de datos. Intenta de nuevo por favor.')
    })

    //login correcto
    it('Login correcto', function() {
        cy.visit('https://losestudiantes.co')
        cy.contains('Cerrar').click()
        cy.contains('Ingresar').click()
        cy.get('.cajaLogIn').find('input[name="correo"]').click().type("vargaspintoadriana@gmail.com")
        cy.get('.cajaLogIn').find('input[name="password"]').click().type("Avargas1392*")
        cy.get('.cajaLogIn').contains('Ingresar').click()
        cy.get('.botonIngresar').should('not.be.visible')
    })
})

//Se crea cuenta manualmente
describe('Registro en Los estudiantes', function() {
    it('Falla registro', function() {
        cy.visit('https://losestudiantes.co')
        cy.contains('Cerrar').click()
        cy.contains('Ingresar').click()
        cy.get('.cajaSignUp > .loginForm').find('input[name="nombre"]').click().type("Adriana")
        cy.get('.cajaSignUp > .loginForm').find('input[name="apellido"]').click().type("Vargas")
        cy.get('.cajaSignUp > .loginForm').find('input[name="correo"]').click().type("varca.software@gmail.com")
        cy.get('.no_bold').click()
        cy.get('div.jsx-527058112 > .form-group > .has-success > .form-control').select('16')
        cy.get('.cajaSignUp > .loginForm').find('input[name="password"]').click().type("Avargas1392*")
        cy.get('label.jsx-520551651').click()
        cy.get('.cajaSignUp > .loginForm > .logInButton').click()
        cy.get('.sweet-alert').contains('Ocurrió un error activando tu cuenta')
    })
})

//Profesores
describe('Búsqueda y selección de profesores', function() {
    it('Búsqueda de profesores', function() {
        cy.visit('https://losestudiantes.co')
        cy.contains('Cerrar').click()
        cy.contains('Ingresar').click()
        cy.get('.cajaLogIn').find('input[name="correo"]').click().type("varca.software@gmail.com")
        cy.get('.cajaLogIn').find('input[name="password"]').click().type("Avargas1392*")
        cy.get('.cajaLogIn').contains('Ingresar').click()
        cy.get('.botonIngresar').should('not.be.visible')
        cy.get('.Select-placeholder').click().type("gloria cortes")
        cy.get('.Select-option-group-label').should('contain', 'profesores')
        cy.get('#react-select-required_error_checksum--option-0').should('contain', 'Gloria Cristina Cortes Buitrago - Ingeniería de Sistemas')
        cy.get('#react-select-required_error_checksum--option-0').click()
        cy.url().should('eq', 'https://losestudiantes.co/universidad-de-los-andes/ingenieria-de-sistemas/profesores/gloria-cristina-cortes-buitrago')
    })

    //Dirigirse a la página de un profesor
    it('Ir a la página de un profesor', function() {
        cy.visit('https://losestudiantes.co')
        cy.contains('Cerrar').click()
        cy.contains('Ingresar').click()
        cy.get('.cajaLogIn').find('input[name="correo"]').click().type("varca.software@gmail.com")
        cy.get('.cajaLogIn').find('input[name="password"]').click().type("Avargas1392*")
        cy.get('.cajaLogIn').contains('Ingresar').click()
        cy.get('.botonIngresar').should('not.be.visible')
        cy.get('div.jsx-1590631759.btn-group').should('contain', 'Alfabético').click()
        cy.get('div.jsx-633353764.profesor').contains('Alejandro Hernandez Arboleda').click()
    })

    //Filtro por materia
    it('Filtro por materia', function() {
        cy.visit('https://losestudiantes.co')
        cy.contains('Cerrar').click()
        cy.contains('Ingresar').click()
        cy.get('.cajaLogIn').find('input[name="correo"]').click().type("varca.software@gmail.com")
        cy.get('.cajaLogIn').find('input[name="password"]').click().type("Avargas1392*")
        cy.get('.cajaLogIn').contains('Ingresar').click()
        cy.get('.botonIngresar').should('not.be.visible')
        cy.get('.Select-placeholder').click().type("gloria cortes")
        cy.get('.Select-option-group-label').should('contain', 'profesores')
        cy.get('#react-select-required_error_checksum--option-0').should('contain', 'Gloria Cristina Cortes Buitrago - Ingeniería de Sistemas')
        cy.get('#react-select-required_error_checksum--option-0').click()
        cy.url().should('eq', 'https://losestudiantes.co/universidad-de-los-andes/ingenieria-de-sistemas/profesores/gloria-cristina-cortes-buitrago')
        cy.get('.jsx-1802368871 [type="checkbox"]').check()
        cy.get('div.jsx-1802368871').find('input[name="id:ISIS1204"]').click()
        cy.get('div.jsx-1802368871').find('input[name="id:MISO4101"]').click()
    })
})