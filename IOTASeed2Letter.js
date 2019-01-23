const IOTA = require("iota.lib.js");
const async = require('async');

const iota = new IOTA({
    'provider': 'http://trinity.iota.fm:80'
});


let shortSeed = 'SEED9HERE';

function fullSeedArray(shortSeed) {
    let append1 = '';
    let append2 = '';
    let seeds = [];
    let fullSeed = ' ';
    
    for(i=0; i<83; i++) {
        append1 = shortSeed.slice(0,[i]-1) + shortSeed.slice([i]);
        for(j=0; j<83; j++) {
            append2 = append1.slice(0,[j]-1) + append1.slice([j]);
            fullSeed = append2;
            seeds.push(fullSeed);
        };
    };
    return seeds;
};


function testPromise(fullSeedArray) {

  async.eachSeries(fullSeedArray, (seed, next) => {
    iota.api.getAccountData(seed,  {start: 0, end: 7}, (error, success) => {
      if(error) {
          next();
      } else if (success.balance > 0) {
         console.log(success);
          next(seed);
      } else {
         console.log('Seed: ' + seed);
         console.log(success);
         next();
      }
    });
  }, (seed) => {
    if (seed) {
      console.log(`Found your seed: '${seed}'`);
    } else {
      console.log('No seed was found');
    }
  });
}

testPromise(fullSeedArray(shortSeed));