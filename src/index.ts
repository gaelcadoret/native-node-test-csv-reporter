import parseXmlContent from "./modules/utils/parseXmlContent";

import fs from "fs";
import parseCsvContent from "./modules/utils/parseCsvContent";

import { DateTime } from "luxon";

const findBoxByGtin = (boxes: Record<string, unknown>[], sscc: string) => {
    return boxes.find((box) => {
        const arr = box.parentID.split(":")
        return arr[arr.length - 1] === sscc
    })
}

const XML_ROOT_TAG = 'epcis:EPCISDocument'
const XML_ROOT_TAG_2 = 'EPCISDocument'

const CODE_BOX = '00'
const CODE_PALET = '01'
const CODE_CONTAINER = '02'

const mappingLifetimeType = {
    'days': 'days',
    'months': 'months',
    'years': 'years',
}
const getValueFromMapping = (key) => {
        if (!mappingLifetimeType[key]) throw new Error(`Invalid key for lifeTimeType value => ${key}`)
        return mappingLifetimeType[key]
    }

;(async () => {
    console.log('script start...');

    const xmlContent = fs.readFileSync('./src/modules/__mocks__/030124.xml', 'utf8');
    const data = parseXmlContent(xmlContent)
    const boxes = data[XML_ROOT_TAG]['EPCISBody']['EventList']['AggregationEvent']
    console.log('boxes.length', boxes.length)

    const data2 = await parseCsvContent('./src/modules/__mocks__/product-master-data-jan24.csv')
    const sscc = data2[0]['Pallet GTIN or SSCC18']

    // console.log('data2[0]', data2[0])

    const lifetime = Number(data2[0]['Lifetime'])
    const lifetimeType = data2[0]['LifetimeType'].trim().toLowerCase()

    console.log('lifetime', lifetime)
    console.log('lifetimeType', getValueFromMapping(lifetimeType))

    const boxData = findBoxByGtin(boxes, sscc)
    // console.log('boxData', boxData)

    const children = boxData.childEPCs.parentID.map((epc) => {
        const arr = epc.split(":")
        return arr[arr.length - 1]
    })

    const durationType = getValueFromMapping(lifetimeType)

    const expirationDate = DateTime.fromISO(boxData.eventTime)
        .plus({ [durationType]: lifetime })
        .toFormat("yyyy-MM-dd");

    console.log('expirationDate', expirationDate)

    /**
     * "GTN" could be mapped to EPCs.
     * "expireDate" could be mapped to event time.
     * "from" could be mapped to source location.
     * "destination" could be mapped to destination location.
     * "deliveryDate" could be mapped to event time.
     * "expectedDeliveryDate" could be mapped to an EPCIS custom field or another relevant attribute.
     * "childs" and "parent" could be used for tracking parent-child relationships in EPCIS, especially in AggregationEvents.
     * "numberPackage" could be used as a custom field in EPCIS to track additional information.
     */

    const t = {
        ProductId: '24-012221111',
        ProductName: 'Pertzye 24-80',
        'Generic Name': 'Pertzye',
        Family: 'Pancreatic enzyme',
        Description: '80 cap per bottle',
        Strength: '24,000 USP Lipase Units',
        'Unit ': 'USP',
        'Refunded ': '',
        'With a prescription': 'YES',
        'Risk of falsification': 'YES',
        Lifetime: '36',
        LifetimeType: ' Months',
        AMM: '',
        'AMM Date': '',
        'N�AMM': '',
        'Major Country': 'USA',
        'Other Country ': '',
        'Packaging type': '',
        'Product form': 'Capsule',
        'Code article 57': '',
        'GTIN*': '3400938585223',
        'Product National Id *': '5976702401',
        'Pack Type* ': '',
        'Quantity *': '',
        'Product length': '',
        'Product width': '',
        'Product heigth': '',
        'Product weight': '',
        'Tamper evident Y/N': '',
        'Serialization configuration': '',
        'Box / case GTIN*': '004456788',
        'Box National Id *': '5976702401',
        'Box length': '',
        'Box width': '',
        'Box heigth': '',
        'Box weight': '',
        'Box Product variants (AI20)': '',
        'Partner ': '',
        'Production site ': '',
        'Bundle GTIN*': '',
        'Bundle National Id *': '',
        'Bundle length': '',
        'Bundle width': '',
        'Bundle heigth': '',
        'Bundle weight': '',
        'Bundle Product variants (AI20)': '',
        'Pallet GTIN or SSCC18': '015544567.55577798990',
        'Pallet National Id *': "'015544567",
        'Pallet Product variants (AI20)': ''
    }

    const findParent = (boxes, sscc) => {
        return boxes.reduce((acc, box) => {
            const arr = box.parentID.split(":")
            const parent = arr[arr.length - 1]

            if (Object.hasOwn(box.childEPCs, 'parentID')) {
                if (Array.isArray(box.childEPCs.parentID)) {
                    const children = box.childEPCs.parentID.find((epc) => {
                        const arr = epc.split(":")
                        return arr[arr.length - 1] === sscc
                    })

                    if (children) {
                        return parent;
                    }
                } else {
                    const children = box.childEPCs.parentID.split(":")
                    if (children[arr.length - 1] === sscc) {
                        // console.log('parent', parent)
                        // console.log('children', children)
                        return parent;
                    }
                }
            }

            return ''
        }, '')
    }

    const qrCodeData = {
        sscc,
        expireDate: expirationDate,
        from: 'from',
        destination: 'destination',
        deliveryDate: 'deliveryDate',
        expectedDeliveryDate: 'expectedDeliveryDate',
        childs: children,
        parent: findParent(boxes, sscc),
        numberPackage: children.length,
    }

    console.log('qrCodeData', qrCodeData)
})();