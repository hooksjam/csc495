import React from "react"

export const reduction = {
    "meta": {
        "date": "date",
        "createdAt": "createdAt",
        "responseID": "_id",
    },
    "fields": {
        "category": 'Q_78017_78017.100004300'
    },
    "agg": {
        "nodules": {
            "operator": "list",
            "sectionID": "S_dmk1_78013.100004300",
            "fields": {
                'nodule_number': 'Q_78013_78013.100004300',
                'composition': 'Q_78020_78020.100004300',
                'echogenicity': 'Q_78021_78021.100004300',
                'shape': 'Q_78022_78022.100004300',
                'margin': 'Q_78023_78023.100004300',
                'echogenicfoci': 'Q_78014_78014.100004300',
            }
        }
    }
}

export const values = {

}

export const predicates = {

    "composition-0": {
        "recent": {
            "any": {
                "field": "nodules",
                "eq": {
                    "choice": "composition",
                    "value": "LI_78046_78046.100004300"
                }
            }
        }
    },
    "composition-1": {
        "recent": {
            "any": {
                "field": "nodules",
                "eq": {
                    "choice": "composition",
                    "value": "LI_78047_78047.100004300"
                }
            }
        }
    },
    "composition-2": {
        "recent": {
            "any": {
                "field": "nodules",
                "eq": {
                    "choice": "composition",
                    "value": "LI_78048_78048.100004300"
                }
            }
        }
    },
    "composition-3": {
        "recent": {
            "any": {
                "field": "nodules",
                "eq": {
                    "choice": "composition",
                    "value": "LI_78044_78044.100004300"
                }
            }
        }
    },
    "composition-4": {
        "recent": {
            "any": {
                "field": "nodules",
                "eq": {
                    "choice": "composition",
                    "value": "LI_78045_78045.100004300"
                }
            }
        }
    },

    "echogenicity-0": {
        "recent": {
            "any": {
                "field": "nodules",
                "eq": {
                    "choice": "echogenicity",
                    "value": "LI_78049_78049.100004300"
                }
            }
        }
    },
    "echogenicity-1": {
        "recent": {
            "any": {
                "field": "nodules",
                "eq": {
                    "choice": "echogenicity",
                    "value": "LI_78050_78050.100004300"
                }
            }
        }
    },
    "echogenicity-2": {
        "recent": {
            "any": {
                "field": "nodules",
                "eq": {
                    "choice": "echogenicity",
                    "value": "LI_78051_78051.100004300"
                }
            }
        }
    },
    "echogenicity-3": {
        "recent": {
            "any": {
                "field": "nodules",
                "eq": {
                    "choice": "echogenicity",
                    "value": "LI_78052_78052.100004300"
                }
            }
        }
    },
    "echogenicity-4": {
        "recent": {
            "any": {
                "field": "nodules",
                "eq": {
                    "choice": "echogenicity",
                    "value": "LI_78053_78053.100004300"
                }
            }
        }
    },
    "shape-0": {
        "recent": {
            "any": {
                "field": "nodules",
                "eq": {
                    "choice": "shape",
                    "value": "LI_78054_78054.100004300"
                }
            }
        }
    },
    "shape-1": {
        "recent": {
            "any": {
                "field": "nodules",
                "eq": {
                    "choice": "shape",
                    "value": "LI_78055_78055.100004300"
                }
            }
        }
    },

    "margin-0": {
        "recent": {
            "any": {
                "field": "nodules",
                "eq": {
                    "choice": "margin",
                    "value": "LI_78056_78056.100004300"
                }
            }
        }
    },
    "margin-1": {
        "recent": {
            "any": {
                "field": "nodules",
                "eq": {
                    "choice": "margin",
                    "value": "LI_78057_78057.100004300"
                }
            }
        }
    },
    "margin-2": {
        "recent": {
            "any": {
                "field": "nodules",
                "eq": {
                    "choice": "margin",
                    "value": "LI_78058_78058.100004300"
                }
            }
        }
    },
    "margin-3": {
        "recent": {
            "any": {
                "field": "nodules",
                "eq": {
                    "choice": "margin",
                    "value": "LI_78059_78059.100004300"
                }
            }
        }
    },
    "margin-4": {
        "recent": {
            "any": {
                "field": "nodules",
                "eq": {
                    "choice": "margin",
                    "value": "LI_78060_78060.100004300"
                }
            }
        }
    },

    "foci-0": {
        "recent": {
            "any": {
                "field": "nodules",
                "or": [
                    {
                        "eq": {
                            "choice": "echogenicfoci",
                            "value": "LI_78061_78061.100004300"
                        }
                    },
                    {
                        "eq": {
                            "choice": "echogenicfoci",
                            "value": "LI_78062_78062.100004300"
                        }
                    }
                ]
            }
        }
    },
    "foci-1": {
        "recent": {
            "any": {
                "field": "nodules",
                "eq": {
                    "choice": "echogenicfoci",
                    "value": "LI_78063_78063.100004300"
                }
            }
        }
    },
    "foci-2": {
        "recent": {
            "any": {
                "field": "nodules",
                "eq": {
                    "choice": "echogenicfoci",
                    "value": "LI_78064_78064.100004300"
                }
            }
        }
    },
    "foci-3": {
        "recent": {
            "any": {
                "field": "nodules",
                "eq": {
                    "choice": "echogenicfoci",
                    "value": "LI_78065_78065.100004300"
                }
            }
        }
    }
}

export const findings = {
    "COMPOSITION": {
        subtitle: "(Choose 1)",
            predicates: [
            {
                predicate:"composition-0",
                text:"Cystic or almost completely cystic",
                points:0,
            },
            {
                predicate:"composition-1",
                text:"Spongiform",
                points:0,
            },
            {
                predicate:"composition-2",
                text:"Mixed cystic and solid",
                points:0
            },
            {
                predicate:"composition-3",
                text:"Solid or almost completely solid",
                points:2
            },
            {
                predicate:"composition-4",
                text:"Shadowing calcifications prevent assessment",
                points:2
            }, 
        ],
    }
,    "ECHOGENICITY": {
        subtitle:"(Choose 1)",
        predicates: [
            {
                predicate:"echogenicity-0",
                text:"Anechoic",
                points:0,
            },
            {
                predicate:"echogenicity-1",
                text:"Hyperechoic or isoechoic",
                points:1,
            },
            {
                predicate:"echogenicity-2",
                text:"Hypoechoic",
                points:2,
            },
            {
                predicate:"echogenicity-3",
                text:"Very hypoechoic",
                points:3,
            },
            {
                predicate:"echogenicity-4",
                text:"Echogenicity cannot be determined",
                points:2,
            },
        ],
    },
    "SHAPE": {
        subtitle:"(Choose 1)",
        predicates: [
            {
                predicate:"shape-0",
                text:"Wider-than-tall",
                points:0,
            },
            {
                predicate:"shape-1",
                text:"Taller-than-wide",
                points:3,
            },
        ],
    },
    "MARGIN": {
        subtitle:"(Choose 1)",
        predicates: [
            {
                predicate:"margin-0",
                text:"Smooth",
                points:0,
            },
            {
                predicate:"margin-1",
                text:"Ill-defined",
                points:0,
            },
            {
                predicate:"margin-2",
                text:"Lobulated or irregular",
                points:2,
            },
            {
                predicate:"margin-3",
                text:"Extra-thyroidal extension",
                points:3,
            },
            {
                predicate:"margin-4",
                text:"Border not seen clearly",
                points:0,
            },
        ],
    },
    "ECHOGENIC FOCI": {
        subtitle:"(Choose All That Apply)",
        predicates: [
            {
                predicate:"foci-0",
                text:"None or large comet-tail artifacts",
                points:0,
            },
            {
                predicate:"foci-1",
                text:"Macrocalcifications",
                points:1,
            },
            {
                predicate:"foci-2",
                text:"Peripheral (rim) calcifications",
                points:2,
            },
            {
                predicate:"foci-3",
                text:"Punctate echogenic foci",
                points:3,
            },
        ],
    },
}

export const scores = [
    {
        predicate:"points = 0",
        text:"0 Points",
        title:"TR1",
        subtitle:"Benign",
        additional:"No FNA",
    },
    {
        predicate:"points = 2",
        text:"2 Points",
        title:"TR2",
        subtitle:"Not Suspicious",
        additional:"No FNA",
    },
    {
        predicate: "points = 3",
        text: "3 Points",
        title:"TR3",
        subtitle:"Midly Suspicious",
        addiitonal:"FNA if &ge; 2.5cm<br/>Follow if &ge; 1.5cm",
    },
    {
        predicate: "points >= 4 and points <= 6",
        text: "4 to 6 Points",
        title:"TR4",
        subtitle:"Moderately Suspicious",
        additional:"FNA if &ge; 1.5cm<br/>Follow if &ge; 1cm",
    },
    {
        predicate: "points >= 7",
        text: "7 Points or More",
        title:"TR5",
        subtitle:"Highly Suspicious",
        additional:"FNA if &ge; 1cm<br/>Follow if &ge; 0.5cm*",
    }
]
