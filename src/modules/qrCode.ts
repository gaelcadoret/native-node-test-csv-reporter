import {pipe} from "ramda";
import {DateTime} from "luxon";

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
}

type Trim = (str: string) => string
type ToLowerCase = (str: string) => string
type WithField = <K extends PropertyKey, V>(key: K, val: V) => <O extends PropertyKey, P>(obj: Record<O, P>) => Record<O, P> & Record<K, V>;

const CODE_BOX = '00'
const CODE_PALET = '01'
const CODE_CONTAINER = '02'

const trim: Trim = (str) => str.trim()

const toLowerCase: ToLowerCase = (str) => str.toLowerCase()

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
                    return parent;
                }
            }
        }

        return ''
    }, '')
}

const extractGtin = (epcValue): string => epcValue.split(":")[epcValue.split(":").length - 1]
const getChildren = (boxData): string[] => boxData.childEPCs.parentID.map(extractGtin)

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

const buildQRCodeData = (record, aggregationNodes): QrCode => {
    const gtin = record['Pallet GTIN or SSCC18']

    const gtinData = findNodeByGtin(aggregationNodes, gtin)

    const children = getChildren(gtinData)

    const withExpireDate = withField('expireDate', getExpirationDate(record, gtinData.eventTime))
    const withFrom = withField('from', 'from')
    const withDestination = withField('destination', 'destination')
    const withDeliveryDate = withField('deliveryDate', 'deliveryDate')
    const withExpectedDeliveryDate = withField('expectedDeliveryDate', 'expectedDeliveryDate')
    const withChilds = withField('childs', children)
    const withParent = withField('parent', findParent(aggregationNodes, gtin))
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
    )

    return qrCodeDataBuilder({
        sscc: gtin
    })
}

export default buildQRCodeData