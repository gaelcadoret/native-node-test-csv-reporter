import { describe, it } from 'node:test'
import assert from 'node:assert'

import jsonParser from './'

describe('modules/jsonParser', () => {
    it('should parse json correctly without changing the structure of data', () => {
        // Given
        const jsonObj = {
            "@context": { // lvl 0
                "product": { // lvl 1
                    "version": "2.0"  // lvl 2
                },
                "price": { // lvl 1
                    "version": "1.0"  // lvl 2
                }
            },
            "templates": [  // lvl 0
                {
                    "@id": "product:XXXXXXXXXXXXX",
                    "url": "@url_to_replace", // lvl 1
                    "name": "template n°1 (mobile)", // lvl 1
                    "type": "@device_type"
                },
                {
                    "@id": "price:YYYY",
                    "url": "@url_to_replace", // lvl 1
                    "name": "template n°1 (mobile)", // lvl 1
                    "type": "@device_type"
                },
                {
                    "url": "@url_to_replace", // lvl 1
                    "name": "template n°2 (desktop)", // lvl 1
                    "description": "template n°2", // lvl 1
                    "options": { // lvl 1
                        "bulletPoints": { // lvl 2
                            "brand": "audi", // lvl 3
                            "model": "A7 sportback",
                            "description": "$.products.[0].description"
                        }
                    }
                },
                {
                    "url": "@url_to_replace", // lvl 1
                    "name": "template n°3 (tablet)", // lvl 1
                    "description": "template n°3", // lvl 1
                    "options": { // lvl 1
                        "bulletPoints": { // lvl 2
                            "brand": "audi", // lvl 3
                            "model": "A7 sportback",
                            "description": "$.products.[0].description"
                        }
                    }
                },
                {
                    "url": "@url_to_replace", // lvl 1
                    "name": "template n°4 (iPhone)", // lvl 1
                    "description": "template n°4", // lvl 1
                    "options": { // lvl 1
                        "bulletPoints": { // lvl 2
                            "brand": "audi", // lvl 3
                            "model": "A7 sportback",
                            "description": "$.products.[0].description"
                        }
                    }
                }
            ],
            "media": { // lvl 0
                "videos": { // lvl 1
                    "@title": "video_title" // lvl 2
                }
            }
        }

        // When
        const result = jsonParser(jsonObj)

        // Then
        assert.deepStrictEqual(result, jsonObj)
    })
})