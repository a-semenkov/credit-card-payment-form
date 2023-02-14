import 'babel-polyfill';
import './styles/styles.css';

import IMask from 'imask';
import View from './view.js';
import Model from './model.js';

class CreditCardApp {
  constructor(view, model) {
    this.view = view;
    this.model = model;

    this.defaultMasks = this.model.createInputMasks(IMask);
    this.numberMask = IMask(
      this.view.cardNumberInput,
      this.model.cardNumberMask
    );
    this.expiresMask = IMask(
      this.view.cardExpiresInput,
      this.model.cardExpiresMask
    );
    this.cvvMask = IMask(this.view.cardCVVInput, this.model.cardCvvMask);

    // Explicit binding
    this.view.cardNumberBlurBind(this.handleNumberBlur);
    this.view.cardHolderBlurBind(this.handleNameBlur);
    this.view.emailBlurBind(this.handleEmailBlur);
    this.view.cardExpiresBlurBind(this.handleExpiresBlur);
    this.view.cardCVVBlurBind(this.handleCVVBlur);

    this.view.cardNumberInputBind(this.handleNumberInput);
    this.view.emailInputBind(this.handleCommonInput);
    this.view.cardHolderInputBind(this.handleNameInput);
    this.view.cardExpiresInputBind(this.handleCommonInput);
    this.view.cardCVVInputBind(this.handleCommonInput);

    this.view.bindCVVFocus(this.handleCVVFocus);

    this.view.bindSubmit(this.handleSubmit);
  }

  get formValidatedStatus() {
    return this.model.checkFormValidity(
      this.view.formInputs,
      this.view.form,
      this.view.invalidClass
    );
  }

  handleNumberInput = (target, template) => {
    this.model.inputToCardTemplate(target, template);
    this.view.removeValidationClasses(target);

    this.number = this.model.validateCardNumber(
      this.view.cardNumberInput.value
    );

    this.view.cvvName = this.number?.card.code.name;
    this.view.cvvTemplatePlaceholder = this.number?.card.code.size;

    this.changeCardLogo(this.number?.card.type);
    this.view.setFontSizing(target.value.length);

    if (!this.number) return;

    this.model.createMaskTemplate(this.number.card);

    this.numberMask.updateOptions(this.model.cardNumberMask);
    this.cvvMask.updateOptions(this.model.cardCvvMask);
  };

  handleNameInput = (target, template) => {
    target.value = this.model.textToCaps(target.value);

    this.model.inputToCardTemplate(target, template);
    this.view.removeValidationClasses(target);
  };

  handleCommonInput = (target, template) => {
    this.view.removeValidationClasses(target);
    if (template) this.model.inputToCardTemplate(target, template);
  };

  handleNumberBlur = (target) => {
    if (this.number?.isValid) {
      this.view.setValidationClass(target, this.view.validClass);
    } else this.view.setValidationClass(target, this.view.invalidClass);

    this.updateSubmitBtnStatus();
  };

  handleNameBlur = (target) => {
    target.value = this.model.textTrim(target.value);

    if (
      this.model.validateRegexp(target.value, this.model.cardHolderNameRegexp)
    ) {
      this.view.setValidationClass(target, this.view.validClass);
    } else this.view.setValidationClass(target, this.view.invalidClass);

    this.updateSubmitBtnStatus();
  };

  handleEmailBlur = (target) => {
    if (
      this.model.validateRegexp(target.value, this.model.emailValidationRegexp)
    ) {
      this.view.setValidationClass(target, this.view.validClass);
    } else this.view.setValidationClass(target, this.view.invalidClass);

    this.updateSubmitBtnStatus();
  };

  handleExpiresBlur = (target) => {
    if (this.expiresMask.masked.isComplete)
      this.view.setValidationClass(target, this.view.validClass);
    else this.view.setValidationClass(target, this.view.invalidClass);

    this.updateSubmitBtnStatus();
  };

  handleCVVBlur = (target) => {
    this.view.flipTemplateCard();
    if (this.cvvMask.masked.isComplete)
      this.view.setValidationClass(target, this.view.validClass);
    else this.view.setValidationClass(target, this.view.invalidClass);

    this.updateSubmitBtnStatus();
  };

  handleCVVFocus = () => {
    this.view.flipTemplateCard();
  };

  handleSubmit = () => {
    if (this.formValidatedStatus) {
      console.log('Данные отправлены');
    }
  };

  updateSubmitBtnStatus() {
    this.view.submitButtonStatus = this.formValidatedStatus;
  }

  changeCardLogo(newLogoName) {
    if (this.view.cardLogo === newLogoName) return;

    if (newLogoName) this.view.getRandomTemplateGradient();

    this.view.cardLogo = newLogoName;
  }
}

const app = new CreditCardApp(new View('app'), new Model());
