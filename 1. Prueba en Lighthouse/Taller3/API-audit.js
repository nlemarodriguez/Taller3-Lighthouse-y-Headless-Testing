'use strict';

const Audit = require('lighthouse').Audit;

const MAX_API_TIME = 3000;

class LoadAudit extends Audit {
    static get meta() {
        return {
            id: 'API-audit',
            title: 'Tiempo de carga de la API primer llamado',
            category: 'MyPerformance',
            name: 'API-audit',
            description: 'Tiempo de la primer carga a la API',
            failureDescription: 'Carga mas demorada de 3 segundos',
            failureTitle: 'Carga mas demorada de 3 segundos',
            helpText: 'Used to measure time from navigationStart to when the schedule' +
                ' card is shown.',

            requiredArtifacts: ['TimeToAPI'],

        };
    }

    static audit(artifacts) {
        const loadedTime = artifacts.TimeToAPI;

        const belowThreshold = loadedTime <= MAX_API_TIME;

        return {
            rawValue: loadedTime,
                 
            score: Number(belowThreshold),
            
            //numericValue: loadedTime // no funciono :(
        };
    }
}

module.exports = LoadAudit;