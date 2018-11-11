export default class Utils {

    static generateID = function () {
        // Math.random should be unique because of its seeding algorithm.
        // Convert it to base 36 (numbers + letters), and grab the first 9 characters
        // after the decimal.
        return '_' + Math.random().toString(36).substr(2, 9);
    };

    static getArrayOfNumbers() {
        let array = [];
        let numbers = this.getNumbersByCount();
        let count = Math.max.apply(Math, numbers.map(function(o) { return o.count; }));
        for(let i = count; i > 0; i--) {
            for (let item of numbers) {
                if (item.count > i || item.count === i && item.count !== 0) {
                    array.push(item.number);
                }
            }
        }
        return array;
    }

    static getNumbersByCount() {
        return [
            {number: 1, count: 1},
            {number: 2, count: 1},
            {number: 3, count: 1},
            {number: 4, count: 1},
            {number: 5, count: 1},
            {number: 6, count: 1},
            {number: 7, count: 1},
            {number: 8, count: 1},
            {number: 9, count: 1},
            {number: 10, count: 1},
            {number: 11, count: 3},
            {number: 12, count: 3},
            {number: 13, count: 3},
            {number: 14, count: 1},
            {number: 15, count: 1},
            {number: 16, count: 1},
            {number: 17, count: 1},
            {number: 18, count: 1},
            {number: 19, count: 4},
            {number: 20, count: 1},
            {number: 21, count: 1},
            {number: 22, count: 3},
            {number: 23, count: 1},
            {number: 24, count: 1},
            {number: 25, count: 1},
            {number: 26, count: 1},
            {number: 27, count: 1},
            {number: 28, count: 1},
            {number: 29, count: 1},
            {number: 30, count: 1},
            {number: 31, count: 1},
            {number: 32, count: 1},
            {number: 33, count: 1},
            {number: 34, count: 2},
            {number: 35, count: 1},
            {number: 36, count: 1},
            {number: 37, count: 1},
            {number: 38, count: 1},
            {number: 39, count: 3},
            {number: 40, count: 1},
            {number: 41, count: 3},
            {number: 42, count: 2},
            {number: 43, count: 2},
            {number: 44, count: 2},
            {number: 45, count: 1},
            {number: 46, count: 1},
            {number: 47, count: 1},
            {number: 48, count: 3},
            {number: 49, count: 2},
            {number: 50, count: 1}
        ];
    };

    static getArrayOfStars() {
        let array = [1];
        let stars = this.getStarsByCount();
        let count = Math.max.apply(Math, stars.map(function(o) { return o.count; }));
        for(let i = count; i > 0; i--) {
            for (let item of stars) {
                if (item.count > i || item.count === i && item.count !== 0) {
                    array.push(item.number);
                }
            }
        }
        return array;
    }

    static getStarsByCount() {
        return [
            {number: 1, count: 1},
            {number: 2, count: 3},
            {number: 3, count: 1},
            {number: 4, count: 1},
            {number: 5, count: 2},
            {number: 6, count: 2},
            {number: 7, count: 1},
            {number: 8, count: 1},
            {number: 9, count: 1},
            {number: 10, count: 2},
            {number: 11, count: 1},
            {number: 12, count: 1}
        ];
    };
}