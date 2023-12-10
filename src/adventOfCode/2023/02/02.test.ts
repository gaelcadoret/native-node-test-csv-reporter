import { describe, it } from "node:test";
import assert from "node:assert";
import {
    arrayOf, createRanges,
    generateMap,
    getLocations, getMinFromArr, getMinLocation, getMinLocationV2, getMinLocationV3,
    getter,
    parseEntry,
} from "./index";

import v8 from 'v8'
console.log(v8.getHeapStatistics().total_available_size / 1024 / 1024)

describe('05', () => {
    it('should parse entry correctly', () => {
        const entry = `
        seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4
        `

        const entryMap = parseEntry(entry);

        const expectedJsonEntry = new Map(
            [
                [
                    'seeds',
                    [79,14,55,13]
                ],
                [
                    'seed-to-soil',
                    [
                        [50,98,2],
                        [52,50,48]
                    ]
                ],
                [
                    'soil-to-fertilizer',
                    [
                        [0,15,37],
                        [37,52,2],
                        [39,0,15],
                    ]
                ],
                [
                    'fertilizer-to-water',
                    [
                        [49,53,8],
                        [0,11,42],
                        [42,0,7],
                        [57,7,4],
                    ]
                ],
                [
                    'water-to-light',
                    [
                        [88,18,7],
                        [18,25,70],
                    ]
                ],
                [
                    'light-to-temperature',
                    [
                        [45,77,23],
                        [81,45,19],
                        [68,64,13],
                    ]
                ],
                [
                    'temperature-to-humidity',
                    [
                        [0,69,1],
                        [1,0,69],
                    ]
                ],
                [
                    'humidity-to-location',
                    [
                        [60,56,37],
                        [56,93,4],
                    ]
                ]
            ]);

        assert.deepStrictEqual(
            entryMap,
            expectedJsonEntry,
        )
    })

    it('should generate Map for first entry seed-to-soil', () => {
        const entry = `
        seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4
        `

        const entryMap = parseEntry(entry);

        const seedToSoil = entryMap.get('seed-to-soil');

        const expectedJsonEntry = [
            [50,98,2],
            [52,50,48]
        ];

        assert.deepStrictEqual(
            seedToSoil,
            expectedJsonEntry,
        )

        const seedToSoilMap = generateMap(seedToSoil);
        const expectedSeedToSoilMap = new Map(
            [
                [98, 50],
                [99, 51],
                [50, 52],
                [51, 53],
                [52, 54],
                [53, 55],
                [54, 56],
                [55, 57],
                [56, 58],
                [57, 59],
                [58, 60],
                [59, 61],
                [60, 62],
                [61, 63],
                [62, 64],
                [63, 65],
                [64, 66],
                [65, 67],
                [66, 68],
                [67, 69],
                [68, 70],
                [69, 71],
                [70, 72],
                [71, 73],
                [72, 74],
                [73, 75],
                [74, 76],
                [75, 77],
                [76, 78],
                [77, 79],
                [78, 80],
                [79, 81],
                [80, 82],
                [81, 83],
                [82, 84],
                [83, 85],
                [84, 86],
                [85, 87],
                [86, 88],
                [87, 89],
                [88, 90],
                [89, 91],
                [90, 92],
                [91, 93],
                [92, 94],
                [93, 95],
                [94, 96],
                [95, 97],
                [96, 98],
                [97, 99],
            ]
        );

        assert.deepStrictEqual(
            seedToSoilMap,
            expectedSeedToSoilMap,
        )

        assert.equal(seedToSoilMap.size, 50)

        assert.equal(getter(seedToSoilMap, 0), 0)
        assert.equal(getter(seedToSoilMap, 49), 49)
        assert.equal(getter(seedToSoilMap, 50), 52)
        assert.equal(getter(seedToSoilMap, 79), 81)
        assert.equal(getter(seedToSoilMap, 80), 82)
    })

    it('should return the minimum location number 35 for a given entry', () => {
        // Given
        const entry = `
        seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4
        `

        // When
        const entryMap = parseEntry(entry);
        assert.equal(getMinLocationV2(entryMap), 35)
    })

    it('should duplicate seeds and return the minimum location number 46 for a given entry', () => {
        // Given
        const entry = `
        seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4
        `

        // When
        const entryMap = parseEntry(entry);
        assert.equal(getMinLocationV3(entryMap), 46)
    })

    it('should create 10 ranges of 50.000 elements for a 500.000 total elements', () => {
        // Given
        const ARRAY_SIZE = 500000;
        const MAX_BATCH_SIZE = 50000;

        const ranges = createRanges(ARRAY_SIZE, MAX_BATCH_SIZE);

        assert.equal(ranges.length, 10)
    })

    it('should duplicate seeds and return the minimum location number 46 for a given entry', () => {
        // Given
        const entry = `
        seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4
        `

        // When
        const entryMap = parseEntry(entry);
        assert.equal(getMinLocationV3(entryMap), 46)
    })
})