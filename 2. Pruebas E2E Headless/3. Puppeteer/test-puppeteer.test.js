const timeout = 200000;

describe("Probar punto 3 con Puppeteer", () => {

    beforeAll(async () => {

        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');
        await page.goto(URL);

    });

    test("Titulo de la pagina", async () => {

        const title = await page.title();
        expect(title).toBe("Angular 6 User Registration and Login Example");

    }, timeout);

    test("Campos vacios", async () => {

        await page.click('button[class="btn btn-primary"]');
        expect(await page.$$eval('div[class="invalid-feedback"]', nodes => nodes.map(n => n.innerText))).toEqual(['First Name is required', 'Last Name is required', 'Username is required', 'Password is required']);

    }, timeout);

    test("Registro exitoso", async () => {

        var elementHandle = await page.$('input[formcontrolname=firstName]');
        await elementHandle.type('Nicolas', { delay: 10 });
        elementHandle = await page.$('input[formcontrolname=lastName]');
        await elementHandle.type('Lema', { delay: 10 });
        elementHandle = await page.$('input[formcontrolname=username]');
        await elementHandle.type('n.lema', { delay: 10 });
        elementHandle = await page.$('input[formcontrolname=password]');
        await elementHandle.type('PasswordSecreto', { delay: 10 });
        await elementHandle.press('Enter');

        await page.evaluate(async () => {
            await new Promise(function (resolve) {
                setTimeout(resolve, 1000)
            });
        });

        expect(await page.$eval('div[class="alert alert-success"]', e => e.textContent)).toEqual('Registration successful')


    }, timeout);

    test("Registro fallido por password corto", async () => {

        await page.goto(URL);
        //await page.waitForSelector('form');
        await page.type('input[formcontrolname=firstName]', 'Nicolas', { delay: 10 });
        await page.type('input[formcontrolname=lastName]', 'Lema', { delay: 10 });
        await page.type('input[formcontrolname=username]', 'n.lema', { delay: 10 });
        await page.type('input[formcontrolname=password]', '123', { delay: 10 });
        await page.click('button[class="btn btn-primary"]')

        expect(await page.$eval('div[class="invalid-feedback"]', e => e.textContent)).toEqual('Password must be at least 6 characters')


    }, timeout);

    test("Boton cancelar retorna al login", async () => {

        await page.goto(URL);
        await page.click('a[class="btn btn-link"]')

        expect(await page.$eval('h2', e => e.textContent)).toEqual('Login')


    }, timeout);


});
