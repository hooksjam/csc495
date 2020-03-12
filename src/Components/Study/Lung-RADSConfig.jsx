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
