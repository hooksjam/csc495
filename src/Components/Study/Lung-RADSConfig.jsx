import React from "react"

export const patient = {
    id: 1,
    results: [
        {
            date: "2020-01-01",
            nodules: [
                {
                    nodule_number:0,
                    "solid": 30,
                    "partsolid": 5,
                },
                {
                    nodule_number:1,
                    "GGN": 5,
                } 
            ]
        },
        {
            date: "2019-01-01",
            nodules: [
                {
                    nodule_number:0,
                    "solid": 25,
                    "partsolid": 3,
                },
                {
                    nodule_number:1,
                    "GGN": 4,
                } ,
            ]
        },
        {
            date: "2018-01-01",
            nodules: [
                {
                    nodule_number:0,
                    "solid": 22,
                    "partsolid": 2,
                },
                {
                    nodule_number:1,
                    "GGN": 3,
                } 
            ]
        }  
    ]
}

export const predicates = {
    "0": [
        {
            predicate:"",
            text:"Prior chest CT examination(s) being located for comparison"
        },
        {
            predicate:"",
            text:"Part or all of lungs cannot be evaluated"
        },
    ],
    "1": [
        {
            predicate:{
                count: {
                    field:"nodules",
                    value:0
                },
            },
            text:"No lung nodules",
        },
        {
            predicate:"",
            text:"Nodule(s) with specific calcifications: complete, central, popcorn, concentric rings and fat containing nodules ",
        }
    ],
    "2": [
        {
            predtext: "(solid < 6) or (new and solid < 4)",
            predicate:{
                "or": [ 
                    {
                        "lt": {
                            field:"solid",
                            value:6,
                        }
                    },
                    {
                        "and": [
                            {
                                "pred": "new",
                            },
                            {
                                "lt": {
                                    field:"solid",
                                    value:4,
                                }
                            }
                        ]
                    }
                ]
            },
            text:'<b>Solid nodule(s):</b><br/> < 6mm (< 133 mm<sup>3</sup>) <br/> new < 4 mm (< 34 mm<sup>3</sup>)'
        },
        {
            predicate:{
                "and": [
                    {
                        "pred": "baseline"
                    },
                    {
                        "lt": {
                            field:"partsolid",
                            value:6,
                        }
                    }
                ]
            },
            text:'<b>Part solid nodule(s):</b><br/> < 6mm total diameter (< 133 mm<sup>3</sup>) on baseline screening'
        }, 
        {
            predicate:{
                "or": [ 
                    {
                        "lt": {
                            field:"GGN",
                            value:30,
                        }
                    },
                    {
                        "and": [
                            {
                                "or": [
                                    { "pred": "unchanged" },
                                    { "pred": "growingSlowly" }
                                ]
                            },
                            {
                                "gte": {
                                    field:"GGN",
                                    value:30,
                                }
                            }
                        ]
                    }
                ]
            },
            text:'<b>Non solid nodule(s) (GGN): </b><br/> < 30mm (<14137 mm<sup>3</sup>) <b>OR</b><br/> &ge; 30mm (&gt; 14137 mm<sup>3</sup>) and unchanged or slowly growing '
        },  

        {
            predicate:{
                "change": {
                    field:"solid|partsolid|GGN",
                    value:0,
                    since:3,
                    category:"3|4",
                },
            },
            text:'<b>Category 3 or 4 nodules unchanged for &ge; 3 months</b>'
        }, 
    ],
    "3": [

    ],
    "4A": [

    ],
    "4B/4X": [

    ]
}