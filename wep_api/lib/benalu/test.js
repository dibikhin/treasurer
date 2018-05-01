const benalu = require('./benalu');

const target = {
    asdf() { console.log('asdf'); }
};

const proxy = benalu
    .fromInstance(target)
    .addInterception(i => {
        console.log(1);
        console.log(i.parameters);
        i.proceed();
    })
    .addInterception(i => {
        console.log(2);
        console.log(i.parameters);
        i.proceed();
    })
    .build();

proxy.asdf('qwer', 3, { a: '345' });