// Use http://93.126.97.71:10082/mp3-players to simplify these tests. Mp3 players does not have custom params on details page.

// bonus points:
// - use preconditions
// - use dataprovider
describe("Items", function () {
  // You must be logged in to use wishlist

  const emailAdress = `${Math.random().toString(36).substring(3)}@mail.mail`;
  const password = Math.random().toString(36).substring(3);

  type ProdList = {
    name: string;
    link: string;
  };

  function logIn(mail: string, password: string) {
    const emailInput = $("#input-email");
    const passwordInput = $("#input-password");
    const loginButton = $('[value="Login"]');

    emailInput.setValue(mail);
    passwordInput.setValue(password);
    loginButton.click();
  }

  const productsToWishList: Array<ProdList> = [
    { name: "iPod Classic", link: "ipod-classic" },
    { name: "iPod Nano", link: "ipod-nano" },
    { name: "iPod Shuffle", link: "ipod-shuffle" },
    { name: "iPod Touch", link: "ipod-touch" },
  ];

  before(function () {
    //#region register/login page locators
    const firstNameInput = $("#input-firstname");
    const lastNameInput = $("#input-lastname");
    const emailInput = $("#input-email");
    const telephoneInput = $("#input-telephone");
    const passwordInput = $("#input-password");
    const confirmPasswordInput = $("#input-confirm");
    const privacyPolicyCheckbox = $('[name="agree"]');
    const continueButton = $('[value="Continue"]');
    //#endregion

    //#region registration
    browser.url("/index.php?route=account/register");
    // browser; // there is a browser alert pop-up, so this needed.
    firstNameInput.setValue(Math.random().toString(36).substring(3));
    lastNameInput.setValue(Math.random().toString(36).substring(3));
    emailInput.setValue(emailAdress);
    telephoneInput.setValue(`+${Math.random().toString().slice(2, 11)}`);
    passwordInput.setValue(password);
    confirmPasswordInput.setValue(password);
    privacyPolicyCheckbox.click();
    continueButton.click();
    
    //#endregion
  });

  afterEach(function () {
    browser.deleteCookies();
  });

  productsToWishList.map((product) => {
    it("can be added to wishlist", function () {
      //#region locators
      const addToWishListButton = $('[data-original-title="Add to Wish List"]');
      const wishListLink = $("#wishlist-total");
      let selectProduct = $(`h4>a[href*=${product.link}]`);
      let productInWishListTable = $(`img[title="${product.name}"]`);
      let wishListMessageLink = $(`a[href*=${product.link}]`);
      const removeButton = $('[data-original-title="Remove"]');
      const emptyWishlist = $("#content p");
      // const myAccountButton = $('[title="My Account"]');
      // const logoutButton = $('a=Logout');
      //#endregion

      //#region test
      browser.url("/index.php?route=account/login");
      logIn(emailAdress, password);

      browser.url("/mp3-players");
      browser.pause(500);

      selectProduct.click();
      browser.pause(500);
      addToWishListButton.click();

      expect(wishListMessageLink).toBeDisplayed();

      wishListLink.click();
      browser.pause(200);

      expect(productInWishListTable).toBeDisplayed();
      expect(emptyWishlist).not.toBeDisplayed();

      removeButton.click();
      // myAccountButton.click();
      // logoutButton.click();
      //#endregion
    });
  });

  productsToWishList.map((product) => {
    it("can be selected for comparison by registered user", function () {
      //#region locarors
      let addProductRocomparetButton = $(
        `//div[h4/a[text()="${product.name}"]]/following-sibling::div/button[@data-original-title="Compare this Product"]`
      ); //the most easy way
      let compareProductMessageLink = $(`a[href*=${product.link}]`);
      const productCompareLink = $("a=product comparison");
      const productAtCompareTable = $("a > strong");
      const productImageAtcompareTable = $(`img[title="${product.name}"]`);
      const removeFromCompareButton = $("a=Remove");
      //#endregion

      //#region test
      browser.url("/index.php?route=account/login");
      logIn(emailAdress, password);

      browser.url("http://93.126.97.71:10082/mp3-players");
      browser.pause(1200);

      addProductRocomparetButton.click();
      browser.pause(400);
      productCompareLink.click();
      browser.pause(500);

      expect(productAtCompareTable.getText()).toEqual(product.name);
      expect(productImageAtcompareTable).toBeDisplayed();

      removeFromCompareButton.click();

      //#endregion
    });
  });

  productsToWishList.map((product) => {
    it("can be selected for comparison by guest", function () {
      //#region locarors
      let compateproductButton = $(
        `//div[h4/a[text()="${product.name}"]]/following-sibling::div/button[@data-original-title="Compare this Product"]`
      ); //the most easy way
      let compareProductMessageLink = $(`a[href*=${product.link}]`);
      const productCompareLink = $("i ~ a[href*=compare]");
      const productAtCompareTable = $("a > strong");
      const productImageAtcompareTable = $(`img[title="${product.name}"]`);
      const removeFromCompareButton = $("a=Remove");
      const myAccountButton = $('[title="My Account"]');
      const loginButton = $("a=Login");
      //#endregion

      //#region test

      browser.url("http://93.126.97.71:10082/mp3-players");
      browser.pause(1000);

      myAccountButton.click();
      browser.pause(100);
      expect(loginButton).toBeDisplayed();
      myAccountButton.click();

      compateproductButton.click();
      productCompareLink.click();
      browser.pause(500);
      expect(compareProductMessageLink).toBeDisplayed();

      browser.pause(300);

      expect(productAtCompareTable.getText()).toEqual(product.name);
      expect(productImageAtcompareTable).toBeDisplayed();

      removeFromCompareButton.click();
      //#endregion
    });
  });

  productsToWishList.map((product) => {
    it("can be added to cart by guest", function () {
      //#region locators
      const addToCartButton = $("#button-cart");
      let selectProduct = $(`h4>a[href*=${product.link}]`);
      const shoppingCartDropdown = $("#cart");
      const shoppingCartLink = $('[title="Shopping Cart"]');
      const productImageAtCartDropDown = $(`img[title="${product.name}"]`);
      let productLinkFromCartDropDown = $(`a=${product.name}`);
      const shoppingCartTitle = $("#content h1");
      const removeFromCartButton = $('[data-original-title="Remove"]');
      const myAccountButton = $('[title="My Account"]');
      const loginButton = $("a=Login");
      //#endregion

      //#region test
      browser.url("http://93.126.97.71:10082/mp3-players");
      browser.pause(1000);
      myAccountButton.click();
      browser.pause(100);
      expect(loginButton).toBeDisplayed();
      myAccountButton.click();

      selectProduct.click();
      browser.pause(500);
      addToCartButton.click();
      browser.pause(200);

      shoppingCartDropdown.click();
      expect(productImageAtCartDropDown).toBeDisplayed();
      expect(productLinkFromCartDropDown).toBeDisplayed();

      shoppingCartLink.click();
      browser.pause(1000);

      expect(shoppingCartTitle).toBeDisplayed();
      expect(shoppingCartTitle).toHaveTextContaining("Shopping Cart");
      expect(productLinkFromCartDropDown).toExist();

      removeFromCartButton.click();
      //#endregion
    });
  });

  productsToWishList.map((product) => {
    it("can be added to cart by registered user", function () {
      //#region locators
      const addToCartButton = $("#button-cart");
      let selectProduct = $(`h4>a[href*=${product.link}]`);
      const shoppingCartDropdown = $("#cart");
      const shoppingCartLink = $('[title="Shopping Cart"]');
      const productImageAtCartDropDown = $(`img[title="${product.name}"]`);
      let productLinkFromCartDropDown = $(`a=${product.name}`);
      const shoppingCartTitle = $("#content h1");
      const removeFromCartButton = $('[data-original-title="Remove"]');
      const myAccountButton = $('[title="My Account"]');
      const logoutButton = $("a=Logout");
      //#endregion

      //#region test
      browser.url("/index.php?route=account/login");
      logIn(emailAdress, password);

      browser.url("http://93.126.97.71:10082/mp3-players");
      browser.pause(1200);
      myAccountButton.click();
      expect(logoutButton).toBeDisplayed();

      selectProduct.click();
      browser.pause(500);
      addToCartButton.click();
      browser.pause(200);

      shoppingCartDropdown.click();
      expect(productImageAtCartDropDown).toBeDisplayed();
      expect(productLinkFromCartDropDown).toBeDisplayed();

      shoppingCartLink.click();
      browser.pause(1000);

      expect(shoppingCartTitle).toBeDisplayed();
      expect(shoppingCartTitle).toHaveTextContaining("Shopping Cart");
      expect(productLinkFromCartDropDown).toExist();
      expect(productImageAtCartDropDown).toExist();

      removeFromCartButton.click();
      //#endregion
    });
  });
});
