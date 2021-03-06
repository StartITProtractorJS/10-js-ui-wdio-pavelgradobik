export class DeliveryDetails {
  private get root(): WebdriverIO.Element {
    return $('div#collapse-shipping-address').parentElement();
  }

  selectExistingOrNewAdressCheckbox(checkOption: string) {
    const addressCheckbox = this.root.$(
      `input[name="shipping_address"][value="${checkOption}"]`
    );
    expect(addressCheckbox).toBeVisible({
      message: 'Checkbox did not available',
    });
    addressCheckbox.click();
  }

  bilingExistedNewCheckbox(selectCheckbox: string) {
    const selectDeliveryCheckbox = this.root.$(
      `input[value="${selectCheckbox}"]`
    );
    expect(selectDeliveryCheckbox).toBeVisible({
      message: 'Checkbox did not available',
    });
    selectDeliveryCheckbox.click();
  }

  continueButton() {
    const cButton = this.root.$('input#button-shipping-address');
    expect(cButton).toBeVisible({
      message: 'continue button did not available',
    });
    cButton.click();
  }

  continueButtonGuest(){
    const cgButton = this.root.$('input#button-guest-shipping');
    expect(cgButton).toBeVisible({
      message: 'continue for guest button did not available',
    });
    cgButton.click();
    
  }

  fillDeliveryAddress(data: IDeliveryAdress) {
    this.root.$('#input-shipping-firstname').setValue(data.firstName);
    this.root.$('#input-shipping-lastname').setValue(data.lastName);
    this.root.$('#input-shipping-company').setValue(data.company);
    this.root.$('#input-shipping-address-1').setValue(data.address1);
    this.root.$('#input-shipping-city').setValue(data.city);
    this.root.$('#input-shipping-postcode').setValue(data.postCode);
    this.root.$('#input-shipping-country').selectByVisibleText(data.country);
    this.root.$('#input-shipping-zone').selectByVisibleText(data.region);
  }
}
