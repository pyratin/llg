const question01 = () => {
  const object = { 1: 11, 11: 11, 12: 19 };

  const factor = 10;

  return Object.entries(object).reduce(
    (memo, [key, value]) =>
      memo + (parseInt(key) > factor && value > factor && value) || 0,
    0
  );
};

const question02 = () => {
  const collection = [
    { a: 3, b: 2 },
    { a: 3, b: 1 },
    { a: 2, b: 5 }
  ];

  return collection.sort(({ a, b }, { a: _a, b: _b }) => a - _a || b - _b);
};

const question03 = () => {
  const collection = [
    { i: 10, v: 10 },
    { i: 1, v: 1 },
    { i: 10, v: 20 },
    { i: 1, v: 2 },
    {}
  ];

  return Object.values(
    collection.reduce(
      (memo, { i }, index, _collection) => ({
        ...memo,
        [i]: [...(memo[i] || []), _collection[index]]
      }),
      {}
    )
  );
};

const question04 = () => {
  const collection = [
    Promise.resolve(1),
    Promise.resolve(2),
    Promise.resolve(3)
  ];

  return collection.reduce(
    (_memo, _value) =>
      _memo.then((memo) => _value.then((value) => memo + value)),
    Promise.resolve(0)
  );
};

export default () => {
  // eslint-disable-next-line no-console
  console.log(question01());

  // eslint-disable-next-line no-console
  console.log(question02());

  // eslint-disable-next-line no-console
  console.log(question03());

  // eslint-disable-next-line no-console
  question04().then(console.log);
};
