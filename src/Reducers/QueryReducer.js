import { QueryConstants } from 'Constants';

var initialialState = {
    result:null,
    test:[
    {
        excel: "All docs query",
        description: "Get all documents",
        queries: [
            {
                "query": {
                    "bool": {
                        "must": []
                    }
                }
            },
        ]
    }, 
    {
        excel: "Test query",
        description: "Testing the result intersection",
        queries: [
            {
                "query": {
                    "bool": {
                        "must": [
                            {
                                "term": {
                                    "choiceTitle" : "Interval increase in solid component"                               
                                }
                            }
                        ]
                    }
                }
            }
        ]
    },
    {
        excel: "COUNTIF(PartSolid, Interval increase, Category3)",
        description: "Count part-solid nodules, that have interval increase (that grew between visits) and are lung rads category 3",
        queries: [
            {
                "query": {
                    "bool": {
                        "must": [
                            {
                                "match": {
                                    "diagnosticProcedureID": "PKG_LDCT_LUNG"
                                }
                            },
                            {
                                "match": {
                                    "choiceTitle" : "Interval increase in solid component"                               
                                }
                            }
                        ]
                    }
                }
            },
            {
                "query": {
                    "bool": {
                        "must": [
                            {
                                "match": {
                                    "diagnosticProcedureID": "PKG_LDCT_LUNG"
                                }
                            },
                            {
                                "match": {
                                    "choiceTitle" : "Part-solid nodule:"                                
                                }
                            } 
                        ]
                    }
                }
            },
            {
                "query": {
                    "bool": {
                        "must": [
                            {
                                "match": {
                                    "diagnosticProcedureID": "PKG_LDCT_LUNG"
                                }
                            },
                            {
                                "match": {
                                    "choiceTitle" : "3 - LDCT in 6 months" 
                                }
                            }  
                        ]
                    }
                }  
            }
        ]
    },
    {
        excel: "COUNTIF(12 month recall, No interval increase)",
        description: "Count if 12 month recall was selected, but there was no interval increase (patients cancer nodule did not grow between visits)",
        queries:[]
    },
    {
        excel: "COUNTBLANK(Procedure (12 month recall))",
        description: "Count number of times field: Procedure was left blank, when 12 month recall was selected",
        queries:[]
    },
    {
        excel: "COUNTIF(LungRADS4B, COUNTIF(Number of nodules >= 5)",
        description: "Count if LungRADS 4B was selected and patient had 5 or more nodules found",
        queries:[]
    },
    ]

}

export function query(state = initialialState, action) {
    switch (action.type) {
        case QueryConstants.GET_QUERY_REQUEST:
            return {
                ...state,
                loading: true,                
            }
        case QueryConstants.GET_QUERY_SUCCESS:
            console.log("RESULT!", action)
            return {
                ...state,
                result: action.response.result,
                raw: action.response.raw,
                loading: false,                
            }
        case QueryConstants.GET_QUERY_FAILURE:
            return { 
                ...state,
                loading: false,
                error: action.error,                
           }
        default:
            return state;
    }
}