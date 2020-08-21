import {Vector2} from 'three';

const OFFSET_ARM = 12.5;
const SAFE_BOUNDARY = 2;

export const FRONT_END = {
    LASER: 'LASER',
    PUMP: 'PUMP',
    PEN: 'PEN',
    P3D: 'P3D',
    CAMERA: 'CAMERA'
}
const OFFSET = {
    LASER: 88.217 + OFFSET_ARM,
    PUMP: 105 + OFFSET_ARM,
    PEN: 101.5 + OFFSET_ARM,
    P3D: 92.6 + OFFSET_ARM,
    CAMERA: 107.7 + OFFSET_ARM
}

const Z_MAX = 167;
const Z_MIN = -127
const LIMIT = [
    229.8, 125.8,		//-127.0
    232.9, 125.5,		//-125.0
    235.9, 125.2,		//-123.0
    238.7, 124.9,		//-121.0
    241.3, 124.5,		//-119.0
    243.9, 124.1,		//-117.0
    246.3, 123.6,		//-115.0
    248.6, 123.2,		//-113.0
    250.9, 122.7,		//-111.0
    253.0, 122.1,		//-109.0
    255.1, 121.6,		//-107.0
    257.1, 121.0,		//-105.0
    259.0, 120.4,		//-103.0
    260.9, 119.7,		//-101.0
    262.7, 119.0,		//-99.0
    264.4, 118.3,		//-97.0
    266.1, 117.6,		//-95.0
    267.7, 116.8,		//-93.0
    269.2, 116.0,		//-91.0
    270.7, 115.1,		//-89.0
    272.2, 114.3,		//-87.0
    273.6, 113.4,		//-85.0
    274.9, 112.4,		//-83.0
    276.2, 111.4,		//-81.0
    277.5, 110.4,		//-79.0
    278.7, 109.3,		//-77.0
    279.9, 108.2,		//-75.0
    281.0, 107.1,		//-73.0
    282.1, 105.9,		//-71.0
    283.2, 104.7,		//-69.0
    284.2, 103.4,		//-67.0
    285.2, 102.1,		//-65.0
    286.1, 100.8,		//-63.0
    287.0, 99.4,		//-61.0
    287.9, 97.9,		//-59.0
    288.7, 96.4,		//-57.0
    289.6, 94.8,		//-55.0
    290.3, 93.2,		//-53.0
    291.1, 91.5,		//-51.0
    291.8, 89.8,		//-49.0
    292.4, 88.0,		//-47.0
    293.1, 86.1,		//-45.0
    293.7, 84.2,		//-43.0
    294.3, 82.2,		//-41.0
    294.8, 80.1,		//-39.0
    295.4, 77.9,		//-37.0
    295.9, 75.7,		//-35.0
    296.3, 73.3,		//-33.0
    296.8, 70.9,		//-31.0
    297.2, 70.9,		//-29.0
    297.5, 70.9,		//-27.0
    297.9, 70.9,		//-25.0
    298.2, 70.9,		//-23.0
    298.5, 70.9,		//-21.0
    298.8, 70.9,		//-19.0
    299.0, 70.9,		//-17.0
    299.2, 70.9,		//-15.0
    299.4, 70.9,		//-13.0
    299.6, 70.9,		//-11.0
    299.7, 70.9,		//-9.0
    299.8, 70.9,		//-7.0
    299.9, 70.9,		//-5.0
    300.0, 70.9,		//-3.0
    300.0, 70.9,		//-1.0
    300.0, 70.9,		//1.0
    300.0, 70.9,		//3.0
    299.9, 70.9,		//5.0
    299.8, 70.9,		//7.0
    299.7, 70.9,		//9.0
    299.6, 70.9,		//11.0
    299.4, 70.9,		//13.0
    299.2, 70.9,		//15.0
    299.0, 70.9,		//17.0
    298.8, 70.9,		//19.0
    298.5, 70.9,		//21.0
    298.2, 70.9,		//23.0
    298.1, 70.9,		//25.0
    298.1, 70.9,		//27.0
    298.0, 70.9,		//29.0
    298.0, 70.9,		//31.0
    297.8, 70.9,		//33.0
    297.7, 70.9,		//35.0
    297.5, 70.9,		//37.0
    297.3, 70.9,		//39.0
    297.1, 70.9,		//41.0
    296.9, 70.9,		//43.0
    296.6, 70.9,		//45.0
    296.3, 72.5,		//47.0
    296.0, 74.2,		//49.0
    295.6, 75.8,		//51.0
    295.2, 77.3,		//53.0
    294.8, 78.8,		//55.0
    294.3, 80.3,		//57.0
    293.9, 81.7,		//59.0
    293.4, 83.0,		//61.0
    292.8, 84.3,		//63.0
    292.3, 85.6,		//65.0
    291.7, 86.8,		//67.0
    291.1, 88.0,		//69.0
    290.4, 89.1,		//71.0
    289.7, 90.2,		//73.0
    289.0, 91.3,		//75.0
    288.3, 92.3,		//77.0
    287.5, 93.2,		//79.0
    286.7, 94.2,		//81.0
    285.8, 95.1,		//83.0
    284.9, 96.0,		//85.0
    284.0, 96.8,		//87.0
    283.1, 97.6,		//89.0
    282.1, 98.4,		//91.0
    281.1, 99.1,		//93.0
    280.0, 99.8,		//95.0
    278.9, 100.5,		//97.0
    277.7, 101.1,		//99.0
    276.6, 101.8,		//101.0
    275.3, 102.3,		//103.0
    274.1, 102.9,		//105.0
    272.7, 103.4,		//107.0
    271.4, 103.9,		//109.0
    270.0, 104.4,		//111.0
    268.5, 104.8,		//113.0
    267.0, 105.2,		//115.0
    265.4, 105.6,		//117.0
    263.8, 105.9,		//119.0
    262.1, 106.3,		//121.0
    260.4, 106.6,		//123.0
    258.6, 106.8,		//125.0
    256.7, 107.1,		//127.0
    254.8, 107.3,		//129.0
    252.7, 107.5,		//131.0
    250.6, 107.6,		//133.0
    248.5, 107.8,		//135.0
    246.2, 107.9,		//137.0
    243.8, 107.9,		//139.0
    241.4, 108.0,		//141.0
    238.8, 108.0,		//143.0
    236.1, 108.0,		//145.0
    233.3, 108.0,		//147.0
    230.3, 107.9,		//149.0
    227.1, 107.9,		//151.0
    223.8, 107.8,		//153.0
    220.3, 107.6,		//155.0
    216.5, 107.5,		//157.0
    212.5, 107.3,		//159.0
    208.1, 107.1,		//161.0
    203.2, 106.8,		//163.0
    197.9, 106.5,		//165.0
    191.8, 106.2,		//167.0
]

export const getLimit = (z, frontEnd) => {
    if (z < Z_MIN || z > Z_MAX) {
        return;
    }

    const zHalfIndex = parseInt((parseInt(z + 0.5) + Math.abs(Z_MIN)) / 2 + 0.5);//copy from firmware code
    let offset = OFFSET[frontEnd];
    console.log(offset)
    return {
        outterRadius: LIMIT[zHalfIndex * 2] + offset - SAFE_BOUNDARY,
        innerRadius: LIMIT[zHalfIndex * 2 + 1] + offset + SAFE_BOUNDARY
    }
}
export const getLathePoints = () => {
    const innerPoints = [];
    let outterPoints = []
    for (let z = Z_MIN; z <= Z_MAX; z += 2) {
        const {outterRadius, innerRadius} = getLimit(z, FRONT_END.P3D)
        innerPoints.push(new Vector2(innerRadius, z));
        outterPoints.push(new Vector2(outterRadius, z));
    }
    outterPoints = outterPoints.concat(innerPoints.reverse())
    outterPoints.push(outterPoints[0])
    return outterPoints;
}
