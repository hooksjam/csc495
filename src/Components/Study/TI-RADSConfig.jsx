import React from "react"

export const findings = {
    "COMPOSITION": {
        subtitle: "(Choose 1)",
            predicates: [
            {
                predicate:"",
                text:"Cystic or almost completely cystic",
                points:0,
            },
            {
                predicate:"",
                text:"Spongiform",
                points:0,
            },
            {
                predicate:"",
                text:"Mixed cystic and solid",
                points:0
            },
            {
                predicate:"",
                text:"Solid or almost completely solid",
                points:2
            },
        ],
    }
,    "ECHOGENICITY": {
        subtitle:"(Choose 1)",
        predicates: [
            {
                predicate:"",
                text:"Anechoic",
                points:0,
            },
            {
                predicate:"",
                text:"Hyperechoic or isoechoic",
                points:1,
            },
            {
                predicate:"",
                text:"Hypoechoic",
                points:2,
            },
            {
                predicate:"",
                text:"Very hypoechoic",
                points:3,
            },
        ],
    },
    "SHAPE": {
        subtitle:"(Choose 1)",
        predicates: [
            {
                predicate:"",
                text:"Wider-than-tall",
                points:0,
            },
            {
                predicate:"",
                text:"Taller-than-wide",
                points:3,
            },
        ],
    },
    "MARGIN": {
        subtitle:"(Choose 1)",
        predicates: [
            {
                predicate:"",
                text:"Smooth",
                points:0,
            },
            {
                predicate:"",
                text:"Ill-defined",
                points:0,
            },
            {
                predicate:"",
                text:"Lobulated or irregular",
                points:2,
            },
            {
                predicate:"",
                text:"Extra-thyroidal extension",
                points:3,
            },
        ],
    },
    "ECHOGENIC FOCI": {
        subtitle:"(Choose All That Apply)",
        predicates: [
            {
                predicate:"",
                text:"None or large comet-tail artifacts",
                points:0,
            },
            {
                predicate:"",
                text:"Macrocalcifications",
                points:1,
            },
            {
                predicate:"",
                text:"Peripheral (rim) calcifications",
                points:2,
            },
            {
                predicate:"",
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
        predicate: "pointx = 3",
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
