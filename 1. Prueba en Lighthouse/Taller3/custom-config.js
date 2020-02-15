'use strict';

module.exports = {

    extends: 'lighthouse:default',

    passes: [{
        passName: 'defaultPass',
        gatherers: [
            'card-gatherer',
            'API-gatherer'
        ]
    }],

    audits: [
        'card-audit',
        'api-audit'
    ],

    categories: {
        ratp_pwa: {
            name: 'Ratp pwa metrics',
            description: 'Metrics for the ratp timetable site',
            auditRefs: [
                { id: 'card-audit', weight: 1 },
                { id: 'API-audit', weight: 2 }
            ]
        }
    }
};