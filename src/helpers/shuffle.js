/* eslint-disable no-constant-condition */
export const getGameField = () => {
    const shuffle = makeShuffler(1, 10, 3);
    const arr = new Array(30);
    for (let i = 0; i < arr.length; i++) {
        arr[i] = shuffle();
    }
    return arr;
};

function makeShuffler(from, to, noMore){
    const numbersValuesLimitObject = {};
    let numbers = [...Array(to + 1).keys()]
        .filter(num => num >= from && num <= to);
    numbers.forEach(num => numbersValuesLimitObject[num] = 0);
    let limit = (to + 1 - from) * noMore;
    return function(){
        if(limit === 0){
            return null;
        }
        limit--;
        let generatedNumber;
        while(true){
            const random = Math.floor(Math.random() * numbers.length);
            generatedNumber = numbers[random];
            if(numbersValuesLimitObject[generatedNumber] === noMore){
                numbersValuesLimitObject[generatedNumber]++;
                numbers = numbers.filter(num => num !== generatedNumber);
            }
            else if(numbersValuesLimitObject[generatedNumber] < noMore){
                numbersValuesLimitObject[generatedNumber]++;
                break;
            }
        }
        return generatedNumber;
    }
}