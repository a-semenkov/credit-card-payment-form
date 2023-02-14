import { el, mount } from 'redom';

export default class View {
  constructor(appId) {
    this._app = document.getElementById(appId);
    this.createForm();
    this.formInputs = [];
    this.cardCVVLabel = this.form['cardCVV']['labels'][0];
    this.submitBtn = this.form['submitBtn'];

    this.createCardTemplate();
    this._initEventListeners();
    this.cacheSvgLogos(
      require.context('./assets/img/card-logo', false, /\.svg$/)
    );
    console.log(this.cache);
  }

  get app() {
    return this._app;
  }

  get validClass() {
    return 'is-valid';
  }

  get invalidClass() {
    return 'is-invalid';
  }

  set cvvName(name) {
    this.cardCVVLabel.textContent = name || 'CVC/CVV';
  }

  set cvvTemplatePlaceholder(value) {
    if (value > 0)
      this.cardCVVTemplate.textContent = Array(value).fill('0').join('');
    else
      this.cardCVVTemplate.textContent = this.cardCVVTemplate.dataset.default;
  }

  set submitButtonStatus(condition) {
    this.submitBtn.disabled = !condition;
  }

  set templateBackgroundColor(value) {
    this.templateFront.style.background = value;
    this.templateBack.style.background = value;
  }

  set cardLogo(cardName) {
    this.currentLogo = cardName;

    if (!cardName) {
      this.cardLogoTemplate.style.backgroundImage = '';
    } else {
      const regexp = new RegExp(`/${cardName}\.svg$`);

      for (let [key, value] of Object.entries(this.cache)) {
        if (regexp.test(key)) {
          this.cardLogoTemplate.style.backgroundImage = `url(${value})`;
        }
      }
    }
  }

  get cardLogo() {
    return this.currentLogo;
  }

  cacheSvgLogos(reqDir) {
    this.cache = {};
    reqDir.keys().forEach((key) => {
      this.cache[key] = reqDir(key);
    });
  }

  setFontSizing(value) {
    let size;

    switch (value) {
      case 19:
        size = 20;
        break;
      case 20:
        size = 18;
        break;
      case 21:
        size = 17;
        break;
      case 22:
        size = 16;
        break;
      default:
        size = 20;
        break;
    }

    this.cardNumberTemplate.style.fontSize = size + 'px';
  }

  getRandomTemplateGradient() {
    const direction = Math.round(Math.random() * 360);
    const randomRGB = [
      ...Array.from({ length: 6 }, () => Math.round(Math.random() * 255)),
    ];

    this.templateBackgroundColor = `linear-gradient(${direction}deg, rgb(${randomRGB[0]},${randomRGB[1]},${randomRGB[2]}),
     rgb(${randomRGB[3]},${randomRGB[4]},${randomRGB[5]}))`;
  }

  createForm() {
    this.formWrapper = el('.card-wrapper', (this.form = el('form.row g-3')));

    this.createFormInputs();

    mount(this.app, this.formWrapper);
  }

  createFormInputs() {
    this.form.insertAdjacentHTML(
      'afterbegin',
      `
        <form class="row g-3">
          <div class="col-md-12 form-floating">
            <input class="form-control" type="text" id="card-number-input" placeholder="Номер карты" name = "cardNumber" required>
            <label for="card-number-input">Введите номер карты</label>
          </div>
          <div class="col-md-12 form-floating">
            <input class="form-control" type="text" id="card-holder-input" placeholder="Имя владельца" name="cardHolder" maxlength="30" required>
            <label for="card-number-input">Введите имя владельца карты</label>
          </div>
          <div class="col-md-12 form-floating">
            <input class="form-control" type="text" id="user-email" placeholder="E-mail" name="email" required>
            <label for="user-email">Введите E-mail для отправки чека</label>
          </div>
          <div class="col-md-6 form-floating">
            <input class="form-control" id="card-expires" placeholder="Срок действия" name="cardExpires" required>
            <label for="card-expires">ММ/ГГ</label>
          </div>
          <div class="col-md-6 form-floating">
            <input class="form-control" type="text" id="card-CVV-input" placeholder="CVV" name="cardCVV" required>
            <label for="card-CVV-input">CVC/CVV</label>
          </div>
          <div class = "col-md-12">
            <button class="btn btn-primary" type="Submit" name="submitBtn" disabled="true">Оплатить</button>
          </div>
        </form>
      `
    );
  }

  createCardTemplate() {
    this.templateCard = el(
      '.card-template',
      el(
        '.card-template__inner',
        (this.templateFront = el(
          '.card-template__front',
          (this.cardLogoTemplate = el('.card-template__logo')),
          el('.card-template__chip'),
          el(
            '.card-template__number-inner',
            el('.card-template__number-text label', 'CARD NUMBER'),
            (this.cardNumberTemplate = el(
              '.card-template__number-num',
              { 'data-default': '0123 4567 8910 1112' },
              '0123 4567 8910 1112'
            ))
          ),
          el(
            '.card-template__holder',
            el('.card-template__holder-text label', 'CARDHOLDER NAME'),
            (this.cardHolderTemplate = el(
              '.card-template__holder-name',
              { 'data-default': 'JOHN DOE' },
              'JOHN DOE'
            ))
          ),
          el(
            '.card-template__expires',
            el('.card-template__expires-text label', 'VALID THRU'),
            (this.cardExpiresTemplate = el(
              '.card-template-expires-date',
              { 'data-default': 'MM/YY' },
              'MM/YY'
            ))
          )
        )),
        (this.templateBack = el(
          '.card-template__back',
          el('.card-template__back-strip'),
          el(
            '.card-template__back-footer',
            '·-- - -·· ·--· --·- ··· ·· ·--- ·-·· -·······- ··--- --··· --- ·- ·--· -···· --· -· ··· ·· ····- --··· ---·· ·--- ·-·· --··-- ··· ·· -·· --·· ···-- -- ··- ···· ···-- ----· --· ····· ·---- ···-- ·- -·- -- ·--· ·---- ---·· ·-- · --·- ----· ··· ·· -·-- ----- ··--- ··· ··· ··-· ·---- ·- -· -·-· ···· ·--- ··· --· -· ·--- --·· ··-· ···- -··- -· -·- ·--· ····· · ··· ·-- ···- --·· ·---- -· · ·-· -··· -·· '
          ),
          el(
            '.card-template__back-cvv',
            (this.cardCVVTemplate = el(
              '.card-template__cvv-text',
              { 'data-default': '000' },
              '000'
            ))
          )
        ))
      )
    );
    mount(this.formWrapper, this.templateCard);
  }

  _initEventListeners = () => {
    [...this.form.elements].forEach((element) => {
      if (element.tagName === 'INPUT') {
        this.createInputsLinks(element);
        let templateElement = this[element.name + 'Template'];

        this[element.name + 'InputBind'] = function (handler) {
          element.addEventListener('input', (e) => {
            handler(e.target, templateElement);
          });
        };

        this[element.name + 'BlurBind'] = function (handler) {
          element.addEventListener('blur', (e) => {
            handler(e.target);
          });
        };
      }
    });
  };

  bindSubmit(handler) {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      handler();
    });
  }

  bindCVVFocus(handler) {
    this.cardCVVInput.addEventListener('focus', () => {
      handler();
    });
  }

  createInputsLinks(element) {
    this.formInputs.push(element);
    this[element.name + 'Input'] = element;
  }

  removeValidationClasses(element) {
    element.classList.remove(this.validClass);
    element.classList.remove(this.invalidClass);
  }

  setValidationClass(element, className) {
    element.classList.add(className);
  }

  flipTemplateCard() {
    this.templateCard.classList.toggle('flip');
  }
}
