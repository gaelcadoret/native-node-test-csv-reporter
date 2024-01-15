import {describe, it} from "node:test";
import assert from "node:assert";

import qrCodeBuilder from "./";

describe('qrCodeDataBuilder', () => {
    it('should return empty object if empty object in arguments', () => {
        const qrCodePipeline = qrCodeBuilder({})
        const expectedResult = {
            name: 'MyVeriMed',
            data: {}
        }
        assert.deepStrictEqual(qrCodePipeline({}), expectedResult)
    })

    it('should throw an error if mandatory gtin field is missing', () => {
        const gtinRecord = {
            'Pallet GTIN': '004456788.99994395409',
        }
        const aggregationNodes = [
            {
                eventTime: '2023-10-25T21:49:31Z',
                eventTimeZoneOffset: '+01:00',
                parentID: 'urn:epc:id:sscc:004456788.99994395409',
                childEPCs: { epc: [] },
                action: 'ADD'
            }
        ]

        assert.throws(() => {
            qrCodeBuilder(gtinRecord)(aggregationNodes)
        }, new Error('Missing mandatory property "Pallet GTIN or SSCC18" in record!'))
    })

    it('should throw an error if lifeTimeType is missing in gtin record', () => {
        const gtinRecord = {
            'Pallet GTIN or SSCC18': '004456788.99994395409',
            'Lifetime': '2',
        }
        const aggregationNodes = [
            {
                eventTime: '2023-10-25T21:49:31Z',
                eventTimeZoneOffset: '+01:00',
                parentID: 'urn:epc:id:sscc:004456788.99994395409',
                childEPCs: { epc: [] },
                action: 'ADD'
            }
        ]

        assert.throws(() => {
            qrCodeBuilder(gtinRecord)(aggregationNodes)
        }, new Error('Missing mandatory property "LifetimeType" in record!'))
    })

    it('should throw an error if Lifetime is missing in gtin record', () => {
        const gtinRecord = {
            'Pallet GTIN or SSCC18': '004456788.99994395409',
            'LifetimeType': 'months',
        }
        const aggregationNodes = [
            {
                eventTime: '2023-10-25T21:49:31Z',
                eventTimeZoneOffset: '+01:00',
                parentID: 'urn:epc:id:sscc:004456788.99994395409',
                childEPCs: { epc: [] },
                action: 'ADD'
            }
        ]

        assert.throws(() => {
            qrCodeBuilder(gtinRecord)(aggregationNodes)
        }, new Error('Missing mandatory property "Lifetime" in record!'))
    })

    it('should return qrCode object', () => {
        const gtinRecord = {
            'Pallet GTIN or SSCC18': '004456788.99994395409',
            'Lifetime': '2',
            'LifetimeType': 'days',
        }

        const aggregationNodes = [
            {
                eventTime: '2024-01-05T15:30:31Z',
                eventTimeZoneOffset: '+01:00',
                parentID: 'urn:epc:id:sscc:004456788.99994395409',
                childEPCs: { epc: [] },
                action: 'ADD'
            }
        ]
        const result = qrCodeBuilder(gtinRecord)(aggregationNodes)

        const expectedResult = {
            name: 'MyVeriMed',
            data: {
                sscc: '004456788.99994395409',
                expireDate: '2024-01-07',
                from: 'from',
                destination: 'destination',
                deliveryDate: 'deliveryDate',
                expectedDeliveryDate: 'expectedDeliveryDate',
                childs: [],
                parent: '',
                numberPackage: 0,
            }
        }
        assert.deepStrictEqual(result, expectedResult)
    })

    it('should throw an error if bad value for lifeTimeType', () => {
        const gtinRecord = {
            'Pallet GTIN or SSCC18': '015544567.55577798990',
            'Lifetime': '36',
            'LifetimeType': 'month',
        }

        const aggregationNodes = [
            {
                eventTime: '2024-01-05T15:30:31Z',
                eventTimeZoneOffset: '+01:00',
                parentID: 'urn:epc:id:sscc:015544567.55577798990',
                childEPCs: {
                    parentID: [
                        'urn:epc:id:sscc:004456788.99994395400',
                        'urn:epc:id:sscc:004456788.99994395401'
                    ]
                },
                action: 'ADD'
            },
            {
                eventTime: '2024-01-05T15:30:31Z',
                eventTimeZoneOffset: '+01:00',
                parentID: 'urn:epc:id:sscc:027788778.11111111111',
                childEPCs: {
                    parentID: 'urn:epc:id:sscc:015544567.55577798990'
                },
                action: 'ADD'
            }
        ]

        assert.throws(() => {
            qrCodeBuilder(gtinRecord)(aggregationNodes)
        }, new Error('Invalid key for lifeTimeType value => month'))
    })

    it('should return qrCode object with parent gtin', () => {
        const gtinRecord = {
            'Pallet GTIN or SSCC18': '015544567.55577798990',
            'Lifetime': '36',
            'LifetimeType': 'months',
        }

        const aggregationNodes = [
            {
                eventTime: '2024-01-05T15:30:31Z',
                eventTimeZoneOffset: '+01:00',
                parentID: 'urn:epc:id:sscc:015544567.55577798990',
                childEPCs: {
                    parentID: [
                        'urn:epc:id:sscc:004456788.99994395400',
                        'urn:epc:id:sscc:004456788.99994395401'
                    ]
                },
                action: 'ADD'
            },
            {
                eventTime: '2024-01-05T15:30:31Z',
                eventTimeZoneOffset: '+01:00',
                parentID: 'urn:epc:id:sscc:027788778.11111111111',
                childEPCs: {
                    parentID: 'urn:epc:id:sscc:015544567.55577798990'
                },
                action: 'ADD'
            }
        ]
        const result = qrCodeBuilder(gtinRecord)(aggregationNodes)

        const expectedResult = {
            name: 'MyVeriMed',
            data: {
                sscc: '015544567.55577798990',
                expireDate: '2027-01-05',
                from: 'from',
                destination: 'destination',
                deliveryDate: 'deliveryDate',
                expectedDeliveryDate: 'expectedDeliveryDate',
                childs: [
                    '004456788.99994395400',
                    '004456788.99994395401',
                ],
                parent: '027788778.11111111111',
                numberPackage: 2,
            }
        }
        assert.deepStrictEqual(result, expectedResult)
    })
})