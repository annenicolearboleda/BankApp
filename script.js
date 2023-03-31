'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2022-12-01T14:11:59.604Z',
    '2022-12-15T17:01:17.194Z',
    '2022-12-13T23:36:17.929Z',
    '2022-12-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////

const formatCurr = function (val, locale, currency) {
  const options = {
    style: 'currency',
    currency: currency,
  };

  return new Intl.NumberFormat(locale, options).format(val);
};

const daysBet = function (date, locale) {
  const calcDays = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  const days = calcDays(new Date(), date);

  if (days == 0) return `Today`;
  if (days == 1) return `Yesterday`;
  if (days <= 7) return `${days} days ago`;
  else {
    return new Intl.DateTimeFormat(locale).format(date);
    // const year = date.getFullYear();
    // const month = `${date.getMonth() + 1}`.padStart(2, 0);
    // const day = `${date.getDate()}`.padStart(2, 0);

    // return `${day}/${month}/${year}`;
  }
};

const displayMovements = function (acc, sort = false) {
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  containerMovements.innerHTML = '';
  movs.forEach(function (move, i) {
    let transaction = move > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = daysBet(date, acc.locale);

    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${transaction}">${
      i + 1
    }: ${transaction}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${formatCurr(
      move,
      acc.locale,
      acc.currency
    )}</div>
  </div>;`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// displayMovements(account1.movements);

// const accounts = [account1, account2, account3, account4];

function updateUI(acc) {
  calcDisplayBal(acc);
  displayMovements(acc);
  calcDisplaySummary(acc);
}

function createUserName(arr) {
  arr.forEach(function (val, i) {
    const usernames = val.owner
      .toLowerCase()
      .split(' ')
      .slice(0)
      .map(val => val[0])
      .join('');

    val.username = usernames;
  });
}

createUserName(accounts);
console.log(accounts);

function calcDisplayBal(acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);

  labelBalance.textContent = `${formatCurr(
    acc.balance,
    acc.locale,
    acc.currency
  )}`;
}
// calcDisplayBal(account1.movements);

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const maxVal = movements.reduce((acc, cur) => {
  if (acc < cur) return acc;
  else return cur;
}, movements[0]);

console.log(maxVal);

const withdrawals = movements.filter(function (val) {
  return val < 0;
});

console.log(withdrawals);

let balance = movements.reduce((acc, cur, i, arr) => acc + cur, 30);

console.log(balance);

/////////////////////////////////////////////////

const startLogOutTimer = function () {
  let time = 15;
  ///set time out to 5 minutes
  let tick = function () {
    const minutes = String(Math.trunc(time / 60)).padStart(2, 0);
    const seconds = String(time % 60).padStart(2, 0);

    labelTimer.textContent = `${minutes}: ${seconds}`;

    if (time == 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = `Log in to get started`;
    }
    time--;
  };

  tick();
  const timer = setInterval(tick, 1000);

  return timer;

  ///call the timer every second

  ///In each call, print the remaining time to UI

  ///When 0 seconds, stop timer and log out user
};

let exArr = [55, 33, 44, 99];
let exArr2 = [88, 11, 22, 77];

// console.log(exArr.slice(0, 1));

// console.log(exArr.splice(-3));
console.log(exArr);
console.log(exArr2);

let combined = exArr.concat(exArr2);
console.log(combined);
console.log(combined.join(' + '));

console.log(combined.at(-5));

combined.forEach(function (object, index, array) {
  console.log(object, index);
});

const calcDisplaySummary = function (obj) {
  const income = obj.movements
    .filter(val => val > 0)
    .reduce((acc, val) => acc + val, 0);
  labelSumIn.textContent = `${formatCurr(income, obj.locale, obj.currency)}`;

  const outward = obj.movements
    .filter(val => val < 0)
    .reduce((acc, val) => acc + val, 0);
  labelSumOut.textContent = `${formatCurr(
    Math.abs(outward),
    obj.locale,
    obj.currency
  )}`;

  const interest = obj.movements
    .filter(val => val > 0)
    .map(deposit => deposit * obj.interestRate)
    .filter((perc, i, arr) => {
      return perc >= 1;
    })
    .reduce((acc, val) => acc + val, 0);
  labelSumInterest.textContent = `${formatCurr(
    interest,
    obj.locale,
    obj.currency
  )}`;
};

// calcDisplaySummary(account1.movements);

let sort = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  if (timer) {
    clearInterval(timer);
  }
  timer = startLogOutTimer();

  displayMovements(currentAccount, !sort);
  sort = !sort;
});

let currentAccount, timer;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    val => val.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === +inputLoginPin.value) {
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }!`;

    containerApp.style.opacity = 100;

    const nowAgain = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      // weekday: 'short',
    };

    // const locale = navigator.language;
    // console.log(locale);

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(nowAgain);
    // const now3 = new Date();
    // const year = now3.getFullYear();
    // const month = `${now3.getMonth() + 1}`.padStart(2, 0);
    // const day = `${now3.getDate()}`.padStart(2, 0);
    // const hour = `${now3.getHours()}`.padStart(2, 0);
    // const minute = `${now3.getMinutes()}`.padStart(2, 0);
    // const second = `${now3.getSeconds()}`.padStart(2, 0);

    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minute}:${second}`;

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    if (timer) {
      clearInterval(timer);
    }
    timer = startLogOutTimer();
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;

  const receiver = accounts.find(val => val.username === inputTransferTo.value);
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiver &&
    amount <= currentAccount.balance &&
    receiver?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiver.movements.push(amount);

    //ADD DATES
    currentAccount.movementsDates.push(new Date().toISOString());
    receiver.movementsDates.push(new Date().toISOString());

    clearInterval(timer);
    timer = startLogOutTimer();
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    clearInterval(timer);
    timer = startLogOutTimer();

    setTimeout(function () {
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);
    }, 4000);
  }

  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === +inputClosePin.value
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    // console.log(index);
    accounts.splice(index, 1);
    console.log(accounts);

    containerApp.style.opacity = 0;
    labelWelcome.textContent = `Log in to get started`;
  }
  inputCloseUsername.value = inputClosePin.value = '';
  inputClosePin.blur();
});

///////////////////////////////////////

console.log(account1.movements.every(mov => mov > 0));
console.log(account2.movements.every(mov => mov > 0));
// console.log(account3.movements.every(mov => mov > 0));
// console.log(account4.movements.every(mov => mov > 0));

const movementings = accounts
  .map(map => map.movements)
  .flat()
  .reduce((acc, val) => acc + val, 0);
console.log(movementings);

const movementings2 = accounts
  .flatMap(map => map.movements)
  .reduce((acc, val) => acc + val, 0);
console.log(movementings2);

////FAKE ALWAYS LOGGED IN
currentAccount = account1;
updateUI(currentAccount);
// containerApp.style.opacity = 100;

/////http://www.lingoes.net/en/translator/langcode.htm

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// console.log(23.0 === 23);
// console.log(0.1 + 0.2 === 0.3);

// console.log(Number('23'));
// console.log(+'23');

// console.log(Number.parseInt('30px', 10));
// console.log(Number.parseInt('e30px'));

// console.log(Number.parseInt(' 2.50 '));
// console.log(Number.parseFloat(' 2.5000007 '));

// console.log(parseInt(' 2.50 '));
// console.log(parseFloat(' 2.5000007 '));

// console.log(Number.isNaN(20));
// console.log(Number.isNaN('20'));
// console.log(Number.isNaN(+'20x'));
// console.log(Number.isNaN(23 / 0));

// console.log(Number.isFinite(20));
// console.log(Number.isFinite('20'));
// console.log(Number.isFinite(+'20px'));
// console.log(Number.isFinite(20 / 0));

// console.log(Number.isInteger(20));
// console.log(Number.isInteger(20.55));
// console.log(Number.isInteger('20'));
// console.log(Number.isInteger(+'20'));
// console.log(Number.isInteger(+'20px'));
// console.log(Number.isInteger(20 / 0));

// console.log(Math.sqrt(25));
// console.log(25 ** (1 / 2));
// console.log(8 ** (1 / 3));

// console.log(Math.max(45, 56, '99k'));
// console.log(Math.min(45, 56, 99));

// console.log(Math.PI * Number.parseFloat('10px') ** 2);

// console.log(Math.trunc(Math.random() * 6) + 1);

// const randomInt = (min, max) =>
//   Math.trunc(Math.random() * (max - min) + 1) + min;

// console.log(randomInt(10, 20));

// console.log(Math.round(23.3));
// console.log(Math.round(23.9));

// console.log(Math.ceil(23.3));
// console.log(Math.ceil(23.9));

// console.log(Math.floor(23.3));
// console.log(Math.floor(23.9));

// console.log(Math.floor(-23.9));
// console.log(Math.trunc(-23.3));

// console.log((2.4).toFixed(0));
// console.log((2.7).toFixed(3));
// console.log((2.345).toFixed(2));
// console.log((2.345).toFixed(10));
// console.log(+(2.345).toFixed(10));

// const k = 89374_7234_3;

// console.log(parseInt('234_32432'));
// console.log(Number('234_32432'));

// console.log(2 ** 53 - 1);
// console.log(Number.MAX_SAFE_INTEGER);

// console.log(3345789237969874598739485798763294937403297496435n);
// console.log(BigInt(33457892));
// console.log(89237897432n + 1n);
// console.log(89237897432n * 2n);

// console.log(10n > 15);
// console.log(10n === 10);
// console.log(typeof 10n);
// console.log(typeof 10);
// console.log(10n == '10');

// const mine = 3345789237969874598739485798763294937403297496435n;
// console.log(mine + ` is a huge number, right?`);

// const now = new Date();
// console.log(now);

// const now1 = new Date('Dec 07 2022 21:24:35');
// console.log(now1);

// const now2 = new Date('Dec 07 2022 21:24:35');
// console.log(now2);

// console.log(new Date('September 27, 1994'));
// console.log(new Date('September 27, 1993'));

// // console.log(new Date(2037, 10, 33, 15, 26, 07));
// // console.log(new Date(2090, 08, 27));

// console.log(new Date(0));
// console.log(new Date(5 * 24 * 60 * 60 * 1000));
// console.log(5 * 24 * 60 * 60 * 1000);

// const future = new Date(2037, 10, 29, 15, 26);

// console.log(future);
// console.log(new Date(2143092360000));
// console.log(future.getFullYear());
// console.log(future.getMonth());
// console.log(future.getDate());
// console.log(future.getDay());
// console.log(future.getHours());
// console.log(future.getMinutes());
// console.log(future.getSeconds());
// console.log(future.toISOString());
// console.log(future.getTime());

// console.log(Date.now());
// // console.log(new Date(Date.now()))

// future.setFullYear(2090);
// console.log(future);

// console.log(new Date(account1.movementsDates[0]));

// const future2 = new Date(2089, 11, 10);
// console.log(Number(future2));
// console.log(+future2);

// const now6 = new Date();
// console.log(new Intl.DateTimeFormat('en-GB').format(now6));
// console.log(new Intl.DateTimeFormat('en-US').format(now6));
// console.log(new Intl.DateTimeFormat('pt-BR').format(now6));
// console.log(new Intl.DateTimeFormat('ar-SY').format(now6));

// const num = 43243443534.54;
// const options = {
//   style: 'currency',
//   unit: 'mile-per-hour',
//   currency: 'PHP',
//   useGrouping: true,
// };

// console.log(`US: ` + new Intl.NumberFormat('en-US', options).format(num));

// console.log(`GERMANY: ` + new Intl.NumberFormat('de-DE', options).format(num));

// console.log(`SYRIA: ` + new Intl.NumberFormat('ar-SY', options).format(num));

// console.log(
//   `${navigator.language}: ` +
//     new Intl.NumberFormat(navigator.language, options).format(num)
// );

// const pizIngr = ['pineapple', ''];

// const pizTimer = setTimeout(
//   (ingr1, ingr2) =>
//     console.log(`Here is your pizza with ${ingr1} and ${ingr2} !`),
//   4000,
//   ...pizIngr
// );

// console.log(`Waiting`);

// if (pizIngr.includes('ham')) clearTimeout(pizTimer);

// setInterval(function () {
//   const date = new Date();
//   console.log(`${date.getHours()}: ${date.getMinutes()}: ${date.getSeconds()}`);
// }, 1000);
