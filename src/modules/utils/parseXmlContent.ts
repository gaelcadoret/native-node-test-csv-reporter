import { XMLParser } from "fast-xml-parser";

const parseXmlContent = (xmlContent) => {
    const parser = new XMLParser();
    return parser.parse(xmlContent);
};

export default parseXmlContent