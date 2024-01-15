import { isEmpty, pipe } from "ramda";
import { DateTime } from "luxon";

type QrCode = {
    sscc: string;
    expireDate?: string;
    from?: string;
    destination?: string;
    deliveryDate?: string;
    expectedDeliveryDate?: string;
    childs?: string[];
    parent?: string;
    numberPackage?: number;
} | {}

type Trim = (str: string) => string
type ToLowerCase = (str: string) => string
type WithField = <K extends PropertyKey, V>(key: K, val: V) => <O extends PropertyKey, P>(obj: Record<O, P>) => Record<O, P> & Record<K, V>;

const CODE_BOX = '00'
const CODE_PALET = '01'
const CODE_CONTAINER = '02'

const trim: Trim = (str) => typeof str === 'string'
    ? str.trim()
    : str

const toLowerCase: ToLowerCase = (str) => typeof str === 'string'
    ? str.toLowerCase()
    : str

const formatString = pipe(trim, toLowerCase)

const findNodeByGtin = (aggregationNodes: Record<string, unknown>[], sscc: string) => {
    return aggregationNodes.find((box) => {
        const arr = box.parentID.split(":")
        return arr[arr.length - 1] === sscc
    })
}

const findParent = (aggregationNodes, sscc): string => {
    return aggregationNodes.reduce((acc, box) => {
        const arr = box.parentID.split(":")
        const parent = arr[arr.length - 1]

        if (Object.hasOwn(box.childEPCs, 'parentID')) {
            if (Array.isArray(box.childEPCs.parentID)) {
                const isSsccIsChild = box.childEPCs.parentID.includes(`urn:epc:id:sscc:${sscc}`)

                if (isSsccIsChild) {
                    return parent;
                }
            } else {
                const children = box.childEPCs.parentID.split(":")
                if (children[arr.length - 1] === sscc) {
                    return parent;
                }
            }

            return acc;
        }

        return ''
    }, '')
}

const extractGtin = (epcValue): string => {
    const arr = epcValue.split(":")
    return arr[arr.length - 1]
}
// const getChildren = (boxData): string[] => Object.hasOwn(boxData.childEPCs, 'parentID')
//     ? Array.isArray(boxData.childEPCs.parentID)
//         ? boxData.childEPCs.parentID.map(extractGtin)
//         : [extractGtin(boxData.childEPCs.parentID)]
//     : []

const getChildren = (node) =>
    Object.hasOwn(node, 'childEPCs')
        ? Object.hasOwn(node.childEPCs, 'parentID')
            ? Array.isArray(node.childEPCs.parentID)
                ? node.childEPCs.parentID.map(extractGtin)
                : [extractGtin(node.childEPCs.parentID)]
            : Object.hasOwn(node.childEPCs, 'epc')
                ? Array.isArray(node.childEPCs.epc)
                    ? node.childEPCs.epc.map(extractGtin)
                    : [extractGtin(node.childEPCs.epc)]
                : []
        : []

const throwError = (msg) => {
    throw new Error(msg)
}

const mappingLifetimeType = {
    'days': 'days',
    'months': 'months',
    'years': 'years',
}
const getValueFromMapping = (key) => !mappingLifetimeType[key]
    ? throwError(`Invalid key for lifeTimeType value => ${key}`)
    : mappingLifetimeType[key]

const getExpirationDate = ({Lifetime, LifetimeType}, eventTime): string => {
    const lifetime = Number(Lifetime)
    const lifetimeType = formatString(LifetimeType)

    const durationType = getValueFromMapping(lifetimeType)

    return DateTime.fromISO(eventTime)
        .plus({[durationType]: lifetime})
        .toFormat("yyyy-MM-dd")
}

const withField: WithField = (key, val) => (obj) => ({...obj, [key]: val})

const validateRecord = (record) => {
    if (!Object.hasOwn(record, 'Box / case GTIN')) throwError('Missing mandatory property "Box / case GTIN" in record!')
    if (!Object.hasOwn(record, 'Pallet GTIN or SSCC18')) throwError('Missing mandatory property "Pallet GTIN or SSCC18" in record!')
    if (!Object.hasOwn(record, 'LifetimeType')) throwError('Missing mandatory property "LifetimeType" in record!')
    if (!Object.hasOwn(record, 'Lifetime')) throwError('Missing mandatory property "Lifetime" in record!')
}

const qrCodeDataBuilder = (record) => (aggregationNodes): QrCode => {
    if (isEmpty(record) || isEmpty(aggregationNodes)) return {}

    validateRecord(record)

    // const gtin = record['Pallet GTIN or SSCC18']
    // const gtin = record['Box / case GTIN']

    return aggregationNodes.map((node) => {
        const sscc = extractGtin(node.parentID)

        const withExpireDate = withField('expireDate', getExpirationDate(record, node.eventTime))
        const withFrom = withField('from', 'from')
        const withDestination = withField('destination', 'destination')
        const withDeliveryDate = withField('deliveryDate', 'deliveryDate')
        const withExpectedDeliveryDate = withField('expectedDeliveryDate', 'expectedDeliveryDate')
        const children = getChildren(node)
        const withChilds = withField('childs', children)
        const withParent = withField('parent', findParent(aggregationNodes, sscc))
        const withNumberPackage = withField('numberPackage', children.length)

        const qrCodeDataBuilder = pipe(
            withExpireDate,
            withFrom,
            withDestination,
            withDeliveryDate,
            withExpectedDeliveryDate,
            withChilds,
            withParent,
            withNumberPackage,
            encryptData,
            enrichNameMyVeriMed,
        )

        return qrCodeDataBuilder({
            sscc,
        })
    })
}

const encrypt = (data) => {
    return data
}

const encryptData = (data) => ({
    data: encrypt(data)
})
const enrichNameMyVeriMed = (data) => ({
    name: 'MyVeriMed',
    ...data,
})

export default qrCodeDataBuilder