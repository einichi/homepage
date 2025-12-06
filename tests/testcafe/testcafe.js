import { Selector, ClientFunction } from 'testcafe'

fixture('test nav and page content').page('http://127.0.0.1:3000')

const getLocationPart = ClientFunction((locationPart) => {
  return window.location[locationPart]
})

test('main page load', async (t) => {
  await t.expect(Selector('p').withText('Ricky Burgin').exists).ok()
})

test('navigation', async (t) => {
  await t
    .expect(Selector('a').withText('Work').exists)
    .ok()
    .click(Selector('a').withText('Work'))
    .expect(Selector('h3').withText('Work History').exists)
    .ok()
    .expect(Selector('a').withText('Contact').exists)
    .click(Selector('a').withText('Contact'))
    .expect(Selector('h3').withText('Contact Ricky').exists)
    .ok()
})

test('main page job history button', async (t) => {
  await t
    .expect(Selector('button').withText('Job History').exists)
    .ok()
    .click(Selector('button').withText('Job History'))
    .expect(Selector('h3').withText('Work History').exists)
    .ok()
})

test('main page github button', async (t) => {
  await t
    .expect(Selector('button').withText('@einichi').exists)
    .ok()
    .click(Selector('button').withText('@einichi'))
    .expect(getLocationPart('host'))
    .eql('github.com')
    .expect(Selector('h1').withText('einichi').exists)
    .ok()
})

test('main page linkedin button', async (t) => {
  await t
    .expect(Selector('button').withText('@rickyburgin').exists)
    .ok()
    .click(Selector('button').withText('@rickyburgin'))
    .expect(getLocationPart('host'))
    .eql('www.linkedin.com')
    .expect(Selector('h1').withText('Ricky B').exists)
    .ok()
})

test('work page hire me button', async (t) => {
  await t
    .click(Selector('a').withText('Work'))
    .click(Selector('button').withText('Hire me!'))
    .expect(Selector('h3').withText('Contact Ricky').exists)
    .ok()
})

test('contact page - general contact', async (t) => {
  await t
    .click(Selector('button').withText('Hire me!'))
    .expect(Selector('h3').withText('Contact Ricky').exists)
    .ok()
    .typeText(Selector('#sender'), 'Test by Testcafe')
    .typeText(Selector('#email'), 'test@testcafe')
    .typeText(Selector('#message'), 'This is an automated test by Testcafe')
    .click(Selector('#submit'))
    .expect(Selector('#submit').innerText.eql('Sent!'))
})
