/// <reference types="cypress" />
import '@testing-library/cypress'

declare global {
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface Chainable {
      // login(email: string, password: string): Chainable<void>
    }
  }
}
