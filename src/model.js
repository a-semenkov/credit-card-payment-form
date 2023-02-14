import Valid from 'card-validator';

export default class Model {
  constructor() {
    this.emailValidationRegexp =
      /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    this.cardHolderNameRegexp = /^[a-z -]+$/i;
  }

  createInputMasks(maskObject) {
    this.cardNumberMask = { mask: '0000 0000 0000 0000' };
    this.cardExpiresMask = {
      mask: Date,
      pattern: 'm/`Y',
      blocks: {
        m: {
          mask: maskObject.MaskedRange,
          from: 1,
          to: 12,
          maxLength: 2,
          autofix: true,
        },
        Y: {
          mask: maskObject.MaskedRange,
          from: 22,
          to: 99,
          autofix: true,
        },
      },
      // date -> str convertion
      format: function (date) {
        let month = date.getMonth() + 1;
        const year = date.getFullYear().toString().slice(-2);

        if (month < 10) month = '0' + month;

        return [month, year].join('/');
      },
      // str -> date convertion
      parse: function (str) {
        const parsedDate = str.split('/');

        const year = String('20' + parsedDate[1]);
        const month = String(parsedDate[0] - 1);

        return new Date(year, month);
      },

      min: new Date(),
      max: new Date(2045, 0, 1),
      autofix: true,
      lazy: true,
    };

    this.cardCvvMask = { mask: '000' };
  }

  validateCardNumber(value) {
    const numberValidation = Valid.number(value);

    if (!numberValidation.isPotentiallyValid) return;

    if (numberValidation.card) {
      return Valid.number(value);
    }
  }

  inputToCardTemplate(inputEl, templateEl) {
    if (inputEl.value === '') {
      templateEl.textContent = templateEl.dataset.default;
    } else templateEl.textContent = inputEl.value;
  }

  textToCaps(input) {
    return input.toUpperCase();
  }

  textTrim(input) {
    return input.trim();
  }

  validateRegexp(value, regexp) {
    if (regexp.test(value)) return true;
    return false;
  }

  checkFormValidity(formInputs, form, invalidClass) {
    let result = true;
    if (!form.checkValidity()) {
      result = false;
      return;
    }

    formInputs.forEach((element) => {
      if (element.classList.contains(invalidClass)) {
        result = false;
        return;
      }
    });
    return result;
  }

  createMaskTemplate(cardObject) {
    const numberMaxLength = cardObject.lengths[cardObject.lengths.length - 1];

    const cardNumber = [...Array(numberMaxLength).fill('0')];
    const cardCvv = [...Array(cardObject.code.size).fill('0')].join('');

    cardObject.gaps.forEach((e, i) => {
      cardNumber.splice(e + i, 0, ' ');
    });

    this.cardNumberMask.mask = cardNumber.join('');
    this.cardCvvMask.mask = cardCvv;
  }
}
