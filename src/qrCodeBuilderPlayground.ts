import parseXmlContent from "./modules/utils/parseXmlContent";

import fs from "fs";
import parseCsvContent from "./modules/utils/parseCsvContent";
import qrCodeBuilder from "./modules/qrCodeDataBuilder";

const XML_ROOT_TAG = 'epcis:EPCISDocument'
const XML_ROOT_TAG_2 = 'EPCISDocument'



/**
 * Generate QRCode data to be encrypt
 * @param key
 */
;(async () => {
    console.log('script start...');

    const xmlContent = fs.readFileSync('./src/modules/__mocks__/030124.xml', 'utf8');

    const jsonFromXml = parseXmlContent(xmlContent)
    const csvContent = await parseCsvContent('./src/modules/__mocks__/product-master-data-jan24.csv')

    const aggregationNodes = jsonFromXml[XML_ROOT_TAG]['EPCISBody']['EventList']['AggregationEvent']
    const record = csvContent[0]
    // record['Pallet GTIN or SSCC18'] = '027788778.11111111111'
    // record['Pallet GTIN or SSCC18'] = '004456788.99994395400'

    console.log('aggregationNodes.length', aggregationNodes.length)

    console.log(JSON.stringify(record, null, 2))

    const qrCodePipeline = qrCodeBuilder(record)

    const qrCodeData = qrCodePipeline(aggregationNodes)

    console.log('qrCodeData', JSON.stringify(qrCodeData, null, 2))
})();