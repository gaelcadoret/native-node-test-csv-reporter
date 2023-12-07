import { describe, it } from "node:test";
import assert from "node:assert";
import {
    generateMap, getMaxFromArray,
    getMaxFromMap,
    getMaxHeaderValue,
    parseEntry
} from "./index";

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

        const maxFromSeedToSoilMap = getMaxFromMap(entryMap, 'seed-to-soil');
        const maxValue = getMaxHeaderValue(entryMap, 'seeds');

        const seedToSoilMap = generateMap(seedToSoil, maxFromSeedToSoilMap, maxValue);
        const expectedSeedToSoilMap = new Map(
            [
                // [98, 50],
                // [99, 51],
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
                [0, 0],
                [1, 1],
                [2, 2],
                [3, 3],
                [4, 4],
                [5, 5],
                [6, 6],
                [7, 7],
                [8, 8],
                [9, 9],
                [10, 10],
                [11, 11],
                [12, 12],
                [13, 13],
                [14, 14],
                [15, 15],
                [16, 16],
                [17, 17],
                [18, 18],
                [19, 19],
                [20, 20],
                [21, 21],
                [22, 22],
                [23, 23],
                [24, 24],
                [25, 25],
                [26, 26],
                [27, 27],
                [28, 28],
                [29, 29],
                [30, 30],
                [31, 31],
                [32, 32],
                [33, 33],
                [34, 34],
                [35, 35],
                [36, 36],
                [37, 37],
                [38, 38],
                [39, 39],
                [40, 40],
                [41, 41],
                [42, 42],
                [43, 43],
                [44, 44],
                [45, 45],
                [46, 46],
                [47, 47],
                [48, 48],
                [49, 49],
            ]
        );

        assert.deepStrictEqual(
            seedToSoilMap,
            expectedSeedToSoilMap,
        )

        assert.equal(seedToSoilMap.size, 80)

        assert.equal(seedToSoilMap.get(0), 0)
        assert.equal(seedToSoilMap.get(49), 49)
        assert.equal(seedToSoilMap.get(50), 52)
        assert.equal(seedToSoilMap.get(79), 81)
        assert.equal(seedToSoilMap.get(80), undefined)
    })

    it('should return the location number for a given seed', () => {
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

        const seeds = entryMap.get('seeds');

        // needed to get the max soil value
        const maxSeeds = getMaxFromArray(seeds);
        console.log('maxSeeds', maxSeeds)

        const seedToSoil = entryMap.get('seed-to-soil');
        const soilToFertilizer = entryMap.get('soil-to-fertilizer');
        const fertilizerToWater = entryMap.get('fertilizer-to-water');
        const waterToLight = entryMap.get('water-to-light');
        const lightToTemperature = entryMap.get('light-to-temperature');
        const temperatureToHumidity = entryMap.get('temperature-to-humidity');
        const humidityToLocation = entryMap.get('humidity-to-location');

        const maxFromSeedToSoilMap = getMaxFromMap(entryMap, 'seed-to-soil');
        const maxFromSoilToFertilizerMap = getMaxFromMap(entryMap, 'soil-to-fertilizer');
        const maxFromFertilizerToWaterMap = getMaxFromMap(entryMap, 'fertilizer-to-water');
        const maxFromWaterToLightMap = getMaxFromMap(entryMap, 'water-to-light');
        const maxFromLightToTemperatureMap = getMaxFromMap(entryMap, 'light-to-temperature');
        const maxFromTemperatureToHumidityMap = getMaxFromMap(entryMap, 'temperature-to-humidity');
        const maxFromHumidityToLocationMap = getMaxFromMap(entryMap, 'humidity-to-location');

        console.log('maxFromSeedToSoilMap', maxFromSeedToSoilMap)
        console.log('maxFromSoilToFertilizerMap', maxFromSoilToFertilizerMap)
        console.log('maxFromFertilizerToWaterMap', maxFromFertilizerToWaterMap)
        console.log('maxFromWaterToLightMap', maxFromWaterToLightMap)
        console.log('maxFromLightToTemperatureMap', maxFromLightToTemperatureMap)
        console.log('maxFromTemperatureToHumidityMap', maxFromTemperatureToHumidityMap)
        console.log('maxFromHumidityToLocationMap', maxFromHumidityToLocationMap)

        const maxValue = getMaxHeaderValue(entryMap, 'seeds');

        const seedToSoilMap = generateMap(seedToSoil, maxFromSeedToSoilMap, maxValue);

        const newMax = seedToSoilMap.get(maxSeeds);
        const soilToFertilizerMap = generateMap(soilToFertilizer, newMax, newMax);

        const newMaxSoilToFertilizer = soilToFertilizerMap.get(maxFromSoilToFertilizerMap)
        const fertilizerToWaterMap = generateMap(fertilizerToWater, newMaxSoilToFertilizer, newMaxSoilToFertilizer);
        console.log('fertilizerToWaterMap', fertilizerToWaterMap)

        const newMaxFertilizerToWater = fertilizerToWaterMap.get(maxFromFertilizerToWaterMap)
        const waterToLightMap = generateMap(waterToLight, newMaxFertilizerToWater, newMaxFertilizerToWater);

        const newMaxFromWaterToLight = waterToLightMap.get(maxFromWaterToLightMap)
        const lightToTemperatureMap = generateMap(lightToTemperature, newMaxFromWaterToLight, newMaxFromWaterToLight);

        const newMaxFromLightToTemperature = lightToTemperatureMap.get(maxFromLightToTemperatureMap)
        const temperatureToHumidityMap = generateMap(temperatureToHumidity, newMaxFromLightToTemperature, newMaxFromLightToTemperature);

        const newMaxFromTemperatureToHumidity = temperatureToHumidityMap.get(maxFromTemperatureToHumidityMap)
        const humidityToLocationMap = generateMap(humidityToLocation, newMaxFromTemperatureToHumidity, newMaxFromTemperatureToHumidity);

        assert.equal(seedToSoilMap.size, 80)
        assert.equal(seedToSoilMap.get(0), 0)
        assert.equal(seedToSoilMap.get(49), 49)
        assert.equal(seedToSoilMap.get(50), 52)
        assert.equal(seedToSoilMap.get(79), 81)
        assert.equal(seedToSoilMap.get(80), undefined)

        assert.equal(soilToFertilizerMap.size, 82)
        assert.equal(soilToFertilizerMap.get(0), 39)
        assert.equal(soilToFertilizerMap.get(14), 53)
        assert.equal(soilToFertilizerMap.get(15), 0)
        assert.equal(soilToFertilizerMap.get(53), 38)
        assert.equal(soilToFertilizerMap.get(54), 54)
        assert.equal(soilToFertilizerMap.get(81), 81)
        assert.equal(soilToFertilizerMap.get(82), undefined)

        assert.equal(fertilizerToWaterMap.size, 61)
        assert.equal(fertilizerToWaterMap.get(0), 42)
        assert.equal(fertilizerToWaterMap.get(10), 60)
        assert.equal(fertilizerToWaterMap.get(11), 0)
        assert.equal(fertilizerToWaterMap.get(52), 41)
        assert.equal(fertilizerToWaterMap.get(53), 49)
        assert.equal(fertilizerToWaterMap.get(60), 56)
        assert.equal(fertilizerToWaterMap.get(61), undefined)

        assert.equal(waterToLightMap.size, 95)
        assert.equal(lightToTemperatureMap.size, 100)
        assert.equal(temperatureToHumidityMap.size, 70)
        assert.equal(humidityToLocationMap.size, 42)

        /**
         * Seed 79,
         * soil 81,
         * fertilizer 81,
         * water 81,
         * light 74,
         * temperature 78,
         * humidity 78,
         * location 82
         */

        const soil = seedToSoilMap.get(79)
        const fertilizer = soilToFertilizerMap.get(soil)
        const water = fertilizerToWaterMap.get(fertilizer)
        const light = waterToLightMap.get(water)
        const temperature = lightToTemperatureMap.get(light)
        const humidity = temperatureToHumidityMap.get(temperature)
        const location = humidityToLocationMap.get(humidity)

        console.log('soil', soil)
        console.log('fertilizer', fertilizer)
        console.log('water', water)
        console.log('light', light)
        console.log('temperature', temperature)
        console.log('humidity', humidity)
        console.log('location', location)
    })
})