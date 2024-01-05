import parseXmlContent from "./modules/utils/parseXmlContent";

import fs from "fs";
import parseCsvContent from "./modules/utils/parseCsvContent";
import buildQRCodeData from "./modules/qrCode";

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

    const qrCodeData = buildQRCodeData(record, aggregationNodes)

    console.log('qrCodeData', qrCodeData)
})();