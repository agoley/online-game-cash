import { OnlineGameCashPage } from './app.po';

describe('online-game-cash App', () => {
  let page: OnlineGameCashPage;

  beforeEach(() => {
    page = new OnlineGameCashPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
