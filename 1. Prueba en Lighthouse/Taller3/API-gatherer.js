'use strict';

const Gatherer = require('lighthouse').Gatherer;

class TimeToAPI extends Gatherer {
    afterPass(options) {
        const driver = options.driver;

        return driver.evaluateAsync('window.APILoadTime')
            .then(APILoadTime => {
                if (!APILoadTime) {

                    throw new Error('Unable to find card load metrics in page');
                }
                return APILoadTime;
            });
    }
}

module.exports = TimeToAPI;