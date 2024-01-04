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

const getChildren = (boxData) => boxData.childEPCs.parentID.map((epc) => {
    const arr = epc.split(":")
    return arr[arr.length - 1]
})

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

/**
 * Generate QRCode data to be encrypt
 * @param key
 */

;(async () => {
    console.log('script start...');

    const xmlContent = fs.readFileSync('./src/modules/__mocks__/030124.xml', 'utf8');
    const data = parseXmlContent(xmlContent)
    const boxes = data[XML_ROOT_TAG]['EPCISBody']['EventList']['AggregationEvent']
    console.log('boxes.length', boxes.length)

    const data2 = await parseCsvContent('./src/modules/__mocks__/product-master-data-jan24.csv')
    const sscc = data2[0]['Pallet GTIN or SSCC18']

    const lifetime = Number(data2[0]['Lifetime'])
    const lifetimeType = data2[0]['LifetimeType'].trim().toLowerCase()

    const boxData = findBoxByGtin(boxes, sscc)

    const durationType = getValueFromMapping(lifetimeType)

    const expirationDate = DateTime.fromISO(boxData.eventTime)
        .plus({ [durationType]: lifetime })
        .toFormat("yyyy-MM-dd");

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

    const children = getChildren(boxData)

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