import { LOG_PREFIX } from "./constants.js";
export const findElementByXPath = (xpath) => {
    return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
        .singleNodeValue;
};
export const findOrderedElementsByXPath = (xpath, includeHidden = false) => {
    const iterator = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
    const result = [];
    try {
        let thisNode = iterator.iterateNext();
        while (thisNode) {
            if (includeHidden || thisNode.checkVisibility()) {
                result.push(thisNode);
            }
            thisNode = iterator.iterateNext();
        }
    }
    catch (e) {
        console.error(LOG_PREFIX, `Error: Document tree modified during iteration ${e}`);
    }
    return result;
};
