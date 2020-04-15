/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import test from 'ava';
import {AwsDynamoDbDatabase} from '../../src/server/db/AwsDynamoDbDatabase';


test('test database dynamodb marshall data', t => {
    let original = {
        id: 'test:id',
        number: 123.45,
        booleanTrue: true,
        booleanFalse: false,
        datetime: new Date(Date.UTC(2018, 6, 29, 21, 22, 23, 42)),
        list: [
            0.5,
            42,
            'test',
            true,
            new Date(Date.UTC(2018, 6, 29, 21, 22, 23, 42))
        ],
        subObject: {
            subString: 'sub string',
            subNumber: 123.45,
            subList: [
                'sub test1'
            ],
            subDatetime: new Date(Date.UTC(2018, 6, 29, 21, 22, 23, 42))
        }
    };
    let expected = {
        id: {'S': 'test:id'},
        number: {'N': '123.45'},
        booleanTrue: {'BOOL': true},
        booleanFalse: {'BOOL': false},
        datetime: {'S': '2018-07-29T21:22:23.042Z'},
        list: {'L': [
            {'N': '0.5'},
            {'N': '42'},
            {'S': 'test'},
            {'BOOL': true},
            {'S': '2018-07-29T21:22:23.042Z'}
        ]},
        subObject: {'M': {
            subString: {'S': 'sub string'},
            subNumber: {'N': '123.45'},
            subList: {'L': [
                {'S': 'sub test1'}
            ]},
            subDatetime: {'S': '2018-07-29T21:22:23.042Z'}
        }}
    };

    t.deepEqual(expected, AwsDynamoDbDatabase.marshall(original));
});

test('test database dynamodb unmarshall data', t => {
    let original = {
        id: {'S': 'test:id'},
        number: {'N': '123.45'},
        booleanTrue: {'BOOL': true},
        booleanFalse: {'BOOL': false},
        datetime: {'S': '2018-07-29T21:22:23.042Z'},
        list: {'L': [
            {'N': '0.5'},
            {'N': '42'},
            {'S': 'test'},
            {'BOOL': true},
            {'S': '2018-07-29T21:22:23.042Z'}
        ]},
        subObject: {'M': {
            subString: {'S': 'sub string'},
            subNumber: {'N': '123.45'},
            subList: {'L': [
                    {'S': 'sub test1'}
                ]},
            subDatetime: {'S': '2018-07-29T21:22:23.042Z'}
        }}
    };
    let expected = {
        id: 'test:id',
        number: 123.45,
        booleanTrue: true,
        booleanFalse: false,
        datetime: '2018-07-29T21:22:23.042Z',
        list: [
            0.5,
            42,
            'test',
            true,
            '2018-07-29T21:22:23.042Z'
        ],
        subObject: {
            subString: 'sub string',
            subNumber: 123.45,
            subList: [
                'sub test1'
            ],
            subDatetime: '2018-07-29T21:22:23.042Z'
        }
    };

    t.deepEqual(expected, AwsDynamoDbDatabase.unmarshall(original));
});
