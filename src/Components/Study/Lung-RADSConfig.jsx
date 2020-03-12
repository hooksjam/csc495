import React from "react"

export const reduction = {
    "meta": {
        "date": "date",
        "createdAt": "createdAt",
        "responseID": "_id",
    },
    "fields": {
        "category": '000115'
    },
    "agg": {
        "nodules": {
            "operator": "list",
            "sectionID": "000032",
            "fields": {
                'nodule_number': '592375972',
                'image_number': '000033',
                'solid': '000048',
                'partsolid': '000053',
                'partsolid-solid': '000057',
                'GGN': '000061',
            }
        }
    }
}

var growthThreshold = 1.5
var slowGrowthThreshold = 0.1

export const predicates = {
    "new-solid": {
        "gt": {
            "trend": {
                "count": {
                    "field":"nodules",
                    "where": {
                        "field":"solid"
                    }
                },
                "default": 0
            },
            "value": 0
        }
    },
    
    "new-partsolid": {
        "gt": {
            "trend": {
                "count": {
                    "field":"nodules",
                    "where": {
                        "field":"partsolid"
                    }
                },
                "default": 0
            },
            "value": 0
        }
    },
    "new-partsolid-solid": {
        "gt": {
            "trend": {
                "count": {
                    "field":"nodules",
                    "where": {
                        "field":"partsolid-solid"
                    }
                },
                "default": 0
            },
            "value": 0
        }
    },
    "new-ggn": {
        "gt": {
            "trend": {
                "count": {
                    "field":"nodules",
                    "where": {
                        "field":"GGN"
                    }
                },
                "default": 0
            },
            "value": 0
        }
    },

    "growing-solid": {
        "any": {
            "field": "nodules",
            "gt": {
                "trend": {
                    "field": "solid"
                },
                "value": growthThreshold
            }
        }
    },

    "growing-partsolid-solid": {
        "any": {
            "field": "nodules",
            "gt": {
                "trend": {
                    "field": "partsolid-solid",
                },
                "value": growthThreshold
            }
        }
    },
    /*"growing-partsolid": {
        "any": {
            "field": "nodules",
            "gt": {
                "trend": {
                    "field": "partsolid"
                },
                "value": growthThreshold
            }
        }
    },*/

    "slowlygrowing-ggn": {
        "any": {
            "field": "nodules",
            "gt": {
                "trend": {
                    "field": "GGN"
                },
                "value": slowGrowthThreshold
            }
        }
    },
    "unchanged-ggn": {
        "any": {
            "field": "nodules",
            "eq": {
                "trend": {
                    "field": "GGN"
                },
                "value": 0
            }
        }
    },

    "1-nonodules": {
        "recent": {
            "eq": {
                "count": {
                    "field":"nodules"
                },
                "value": 0
            }
        }
    },
    "2-prefissural": {
        "recent": {
            "any": {
                "field":"nodules",
                "lt": {
                    field:"solid",
                    value:10,
                }
            }
        }
    },

    "2-solid-a": {
        "recent": {
            "any": {
                "field":"nodules",
                "lt": {
                    field:"solid",
                    value:6,
                }
            }
        }
    },

    "2-solid-b": {
        "and": [
            {
                "predicate": "new-solid"
            },
            {
                "recent": {
                    "any": {
                        "field":"nodules",
                        "lt": {
                            field:"solid",
                            value:4,
                        }
                    }
                }
            }
        ]
    },

    "2-solid": {
        "or": [
            {"predicate": "2-solid-a"},
            {"predicate": "2-solid-b"}
        ]
    },

    "baseline": {
        "default":true,
    },
    "2-partsolid": {
        "and": [
            {
                "predicate": "baseline"
            },
            {
                "recent": {
                    "any": {
                        "field":"nodules",
                        "lt": {
                            field:"partsolid",
                            value:6,
                        }
                    }
                }
            }
        ]
    },

    "2-ggn-a": {
        "recent": {
            "any": {
                "field":"nodules",
                "lt": {
                    field:"GGN",
                    value:30,
                }
            }
        }
    },

    "2-ggn-b1": {
        "recent": {
            "any": {
                "field":"nodules",
                "ge": {
                    field:"GGN",
                    value:30,
                }
            }
        }
    },


    "2-ggn-b": {
        "and": [
            {"predicate": "2-ggn-b1"},
            {
                "or":[
                    {"predicate": "unchanged-ggn"},
                    {"predicate": "slowlygrowing-ggn"}
                ]
            }
        ]
    },

    "2-ggn": {
        "or": [
            {"predicate": "2-ggn-b"},
            {"predicate": "2-ggn-a"},
        ]
    },

    "3-solid-a": {
        "recent": {
            "any": {
                "field":"nodules",
                "and": [
                    {
                        "ge": {
                            field:"solid",
                            value:6,
                        }
                    },
                    {
                        "lt": {
                            field:"solid",
                            value:8,
                        }
                    },
                    // TODO: baseline?
                    {"predicate": "baseline"}
                ]
            }
        }
    },

    "3-solid-b": {
        "and": [
            {
                "predicate": "new-solid"
            },
            {
                "recent": {
                    "any": {
                        "field":"nodules",
                        "and": [
                            {
                                "ge": {
                                    field:"solid",
                                    value:4,
                                }
                            },
                            {
                                "lt": {
                                    field:"solid",
                                    value:6,
                                }
                            }
                        ]
                    }
                }
            }
        ]
    },

    "3-solid": {
        "or": [
            {"predicate": "3-solid-a"},
            {"predicate": "3-solid-b"}
        ]
    },

    "3-partsolid-a": {
        "recent": {
            "any": {
                "field":"nodules",
                "and": [
                    {
                        "ge": {
                            field:"partsolid",
                            value:6,
                        }
                    },
                    {
                        "lt": {
                            field:"partsolid-solid",
                            value:6,
                        }
                    }
                ]
            }
        }
    },
    "3-partsolid-b": {
        "and": [
            {
                "predicate": "new-partsolid"
            },
            {
                "recent": {
                    "any": {
                        "field":"nodules",
                        "lt": {
                                field:"partsolid",
                                value:6,
                            }
                    }
                }
            }
        ]
    },
    "3-partsolid": {
        "or": [
            {"predicate": "3-partsolid-a"},
            {"predicate": "3-partsolid-b"}
        ]
    },

    "3-ggn-a": {
        "recent": {
            "any": {
                "field":"nodules",
                "and": [
                    {
                        "ge": {
                            field:"GGN",
                            value:30,
                        }
                    },
                    { "predicate": "baseline" }
                ]
            }
        }
    },
    "3-ggn": {
        "or": [
            {"predicate": "3-ggn-a"},
            {"predicate": "new-ggn"}
        ]
    },



    "4a-solid-a": {
        "recent": {
            "any": {
                "field":"nodules",
                "and": [
                    {
                        "ge": {
                            field:"solid",
                            value:8,
                        }
                    },
                    {
                        "lt": {
                            field:"solid",
                            value:15,
                        }
                    },
                    // TODO: baseline?
                    {"predicate": "baseline"}
                ]
            }
        }
    },

    "4a-solid-b": {
        "and": [
            {
                "predicate": "growing-solid"
            },
            {
                "recent": {
                    "any": {
                        "field":"nodules",
                        "lt": {
                            field:"solid",
                            value:8,
                        }
                    }
                }
            }
        ]
    },

    "4a-solid-c": {
        "and": [
            {
                "predicate": "new-solid"
            },
            {
                "recent": {
                    "any": {
                        "field":"nodules",
                        "and": [
                            {
                                "ge": {
                                    field:"solid",
                                    value:6,
                                }
                            },
                            {
                                "lt": {
                                    field:"solid",
                                    value:8,
                                }
                            }
                        ]
                    }
                }
            }
        ]
    },

    "4a-solid": {
        "or": [
            {"predicate": "4a-solid-a"},
            {"predicate": "4a-solid-b"},
            {"predicate": "4a-solid-c"},
        ]
    },

    "4a-partsolid-a": {
        "recent": {
            "any": {
                "field":"nodules",
                "and": [
                    {
                        "ge": {
                            field:"partsolid",
                            value:6,
                        }
                    },
                    {
                        "ge": {
                            field:"partsolid-solid",
                            value:6,
                        }
                    },
                    {
                        "lt": {
                            field:"partsolid-solid",
                            value:8,
                        }
                    },
                ]
            }
        }
    },

    "4a-partsolid-b": {
        "and": [
            {
                "or": [
                    {"predicate": "new-partsolid-solid"},
                    {"predicate": "growing-partsolid-solid"},
                ]
            },
            {
                "recent": {
                    "any": {
                        "field":"nodules",
                        "lt": {
                            field:"partsolid-solid",
                            value:4,
                        }
                    }
                }
            }
        ]
    },

    "4a-partsolid": {
        "or": [
            {"predicate": "4a-partsolid-a"},
            {"predicate": "4a-partsolid-b"},
        ]
    }, 


    "4b-solid-a": {
        "recent": {
            "any": {
                "field":"nodules",
                "ge": {
                    field:"solid",
                    value:15,
                }
            }
        }
    },

    "4b-solid-b": {
        "and": [
            {
                "or": [
                    {"predicate": "new-solid"},
                    {"predicate": "growing-solid"},
                ]
            },
            {
                "recent": {
                    "any": {
                        "field":"nodules",
                        "ge": {
                            field:"solid",
                            value:8,
                        }
                    }
                }
            }
        ]
    },

    "4b-solid": {
        "or": [
            {"predicate": "4b-solid-a"},
            {"predicate": "4b-solid-b"},
        ]
    }, 

    "4b-partsolid-a": {
        "recent": {
            "any": {
                "field":"nodules",
                "ge": {
                    field:"partsolid-solid",
                    value:8,
                }
            }
        }
    },

    "4b-partsolid-b": {
        "and": [
            {
                "or": [
                    {"predicate": "new-partsolid-solid"},
                    {"predicate": "growing-partsolid-solid"},
                ]
            },
            {
                "recent": {
                    "any": {
                        "field":"nodules",
                        "ge": {
                            field:"partsolid-solid",
                            value:4,
                        }
                    }
                }
            }
        ]
    },

    "4b-partsolid": {
        "or": [
            {"predicate": "4b-partsolid-a"},
            {"predicate": "4b-partsolid-b"},
        ]
    }, 
}

export const predicatesc = {
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