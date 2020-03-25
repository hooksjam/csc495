import React from "react"

export const getNames = (form) => {
    console.log("FORM!!", form)
    var ret = {names:{}, ordering:{}}

    var k = -1;
    for(let i = 0; i < form.nodes.length; i++) {
        k++
        var node = form.nodes[i]
        ret.names[node.referenceID] = node.title
        ret.ordering[node.referenceID] = k
        if(node.choices != null) {
            for(let j = 0; j < node.choices.length; j++) {
                k++
                ret.names[node.choices[j].referenceID] = node.choices[j].title
                ret.ordering[node.choices[j].referenceID] = k
            }
        }
    }
    return ret
}

export const rotateResults = (results, field) => {
    var ret = Object.values(results.reduce((lol, obj) => {
        var other = {}
        for(var key in obj) {
            if(key == field) continue
            other[key] = obj[key]
        }
        // console.log("FIELD!", field, "OBJ", obj)
        for(let i = 0; i < obj[field].length; i++) {
            if(!(i in lol))
                lol[i] = []

            if(obj[field][i]) {
                var x = JSON.parse(JSON.stringify(obj[field][i]))
                for(var key in other) {
                    x[key] = other[key]
                }

                lol[i].push(x)
            }
        }
        return lol
    }, {}))
    return ret
}

export const reduceResults = (form, results, reduction) => {
    var ret = results.map(x => {
        var result = Object.keys(reduction.meta).reduce((map, y) => {
            map[y] = x[reduction.meta[y]]
            return map
        },{})

        for(var key in reduction.fields) {
            var answer = x.getAnswerFn(reduction.fields[key])
            if(answer != null) {
                if(answer.field != null)
                    result[key] = answer.stringValue
                else if(answer.choices != null && answer.choices.length > 0) {
                    var q = form.getChildrenFn(answer.nodeID)
                    if(q.maxSelections == 1) {
                        if(answer.choices[0].field == null)
                            result[key] = answer.choices[0].choiceID
                        else
                            result[key] = answer.choices[0]
                    } else {
                        if(answer.choices[0].field == null) {
                            result[key] = answer.choices.map(x => {return x.choiceID})
                        } else {
                            result[key] = answer.choices.map(x => {
                                // Get actual question name
                                //var choice = q.choices.filter(y => x.choiceID = y.referenceID)[0].title
                                var ret = {}
                                //ret[choice] = x.field[Object.keys(x.field)[0]]
                                ret[x.choiceID] = x.field[Object.keys(x.field)[0]]
                                return ret
                           })
                        }
                    }
                }
            }
        }

        for(var key in reduction.agg) {
            var agg = reduction.agg[key]
            if(agg.operator == "list") {
                var list = []
                var section = form.getChildrenFn(agg["sectionID"])
                if(section) {
                    for(let i = 0; i < section.maxInstances; i++) {
                        var sectionInstance = x.getAnswerFn(section.referenceID, i)
                        if(!sectionInstance)
                            continue
                        var getProp = (nodeID) => {
                            return x.getAnswerFn(nodeID, i)
                        }

                        // Get answers for this module
                        var item = Object.keys(agg.fields).reduce((map, obj) => {
                            var answer = getProp(agg.fields[obj])
                            if(answer) {
                                if(answer.field != null) {
                                    if(/^[0-9\.]+$/.test(answer.field.stringValue))
                                        map[obj] = parseFloat(answer.field.stringValue)
                                    else
                                        map[obj] = answer.field.stringValue
                                } else if(answer.choices != null && answer.choices.length > 0) {
                                    var q = form.getChildrenFn(answer.nodeID)
                                    if(q.maxSelections == 1) {
                                        if(answer.choices[0].field == null)
                                            map[obj] = answer.choices[0].choiceID
                                        else
                                            map[obj] = answer.choices[0]
                                    } else {
                                        if(answer.choices[0].field == null) {
                                            map[obj] = answer.choices.map(x => {return x.choiceID})
                                        } else {
                                            map[obj] = answer.choices.map(x => {
                                                // Get actual question name
                                                //var choice = q.choices.filter(y => x.choiceID == y.referenceID)[0].title
                                                var ret = {}
                                                if(/^[0-9\.]+$/.test(x.field.stringValue))
                                                    ret[x.choiceID] = parseFloat(x.field.stringValue)
                                                else
                                                    ret[x.choiceID] = x.field.stringValue
                                                //ret[choice] = x.field[Object.keys(x.field)[0]]
                                                return ret
                                           })
                                        }
                                    }
                                }
                            }
                            return map
                        },{})
                        list.push(item)
                    }
                } else {
                    // iuno
                }
                result[key] = list
            }
        }
        return result
    })
    return ret
}


/*getNoduleSize(nodule) {
    var size = 0
    if("solid" in nodule)
        size = Math.max(size, nodule["solid"])
    if("partsolid" in nodule)
        size = Math.max(size, nodule["partsolid"])
    if("GGN" in nodule)
        size = Math.max(size, nodule["GGN"])
    return size
}*/

var evalComparator = (comparator, compare, value) => {
    // console.log('COMPARE', comparator, compare, value)
    switch(comparator) {
        case "lt": return compare < value
        case "le": return compare <= value
        case "eq": return compare == value
        case "ge": return compare >= value
        case "gt": return compare > value
        default: return false
    }
}

var answers = {}
var evalPred = (obj, test) => {
    if(test.length == 0)
        return false 

    var key = Object.keys(obj)[0]
    var pred = obj[key]
    if(pred == true)
        return true
    // console.log("PRED", key)
    switch(key) {
        case "default":
            return pred
        case "pred":
        case "predicate": {
            return answers[pred]
        }
        case "or": {
            var ret = false
            var arr = []
            for(var i = 0; i < pred.length; i++) {
                var ev = evalPred(pred[i], test)
                if((Array.isArray(ev) && ev.length > 0) || ev) {
                    ret = true
                    if(Array.isArray(ev))
                        arr.push.apply(arr, ev)
                }
            }
            if(ret && arr.length > 0)
                return arr
            else
                return ret
        }
        case "and": {
            var arr = []
            for(var i = 0; i < pred.length; i++) {
                var ev = evalPred(pred[i], test)
                if((Array.isArray(ev) && ev.length == 0) || !ev)
                    return false

                if(Array.isArray(ev))
                    arr.push.apply(arr, ev)
            }
            if(arr.length > 0)
                return arr
            else
                return true
        }
        case "choice": {
            if(Array.isArray(pred)) {
                var ret = pred.map(x => {
                    if(x in test)
                        return test[x]//.choiceID
                    else
                        return null
                })
                return ret
            } else {
                if(pred in test)
                    return test[pred]//.choiceID
                else
                    return null
            }

            break 
        }
        case "get":
        case "field": {
            if(Array.isArray(pred)) {
                var ret = pred.map(x => {
                    if(x in test)
                        return test[x]
                    else
                        return null
                })
                return ret
            } else {
                return test[pred]
            }

            break
        }
        case "trend": {
            if(!Array.isArray(test)) {
                return null
            }

            var current = evalPred(pred, test[0])
            if(current == null) {
                return null
            }

            // Check if its an array or not
            var prev
            if(test.length > 1)  {
                prev = evalPred(pred, test[1])
            } else {
                if('default' in pred)
                    prev = pred.default
                else
                    return null
                /*if(Array.isArray(current))
                    prev = current.map(x => {
                        if(x != null)
                            return 0
                        else
                            return null
                    })
                else
                    prev = 0*/
            }
           /* if(Array.isArray(current)) {
                return current.map((x,ix) => {
                    if(x != null)
                        return current[ix] - prev[ix]
                    else
                        return null
                })
            } else {
                return current - prev
            }*/
            return current - prev
            break
        }
        case "in": {
            var list = results[0][pred.field]
            var obj = Object.keys(pred)[1]
            var results = []
            for(var i = 0; i < list.length; i++) {
                if(evalPred(pred[i], results)) {
                    result.push({obj: pred[obj]}, results[0][pred.field][i])
                }

            }
            break
        }
        case "any": {
            // Split the results to group the nodules
            var testB = rotateResults(test, pred.field)
            /*var testB = Object.values(test.reduce((lol, obj) => {
                for(let i = 0; i < obj[pred.field].length; i++) {
                    if(!(i in lol))
                        lol[i] = []
                    lol[i].push(obj[pred.field][i])
                }
                return lol
            }, {}))*/


            var results = []
            for(let i = 0; i < testB.length; i++) {
                if(test.length == 1)
                    testB[i] = testB[i][0]
                var keyB = Object.keys(pred)[1]
                var predB = {}
                predB[keyB] = pred[keyB]
                var val = evalPred(predB, testB[i])

                // If val is true, keep list of nodules
                if(val) {
                    // console.log("VAL!", val)
                    results.push(testB[i])
                }
            }
            if(results.length > 0)
                return results
            else
                return null
        }

        case "all": {
            // Split the results to group the nodules
            var testB = Object.values(test.reduce((lol, obj) => {
                for(let i = 0; i < obj[pred.field].length; i++) {
                    if(!(i in lol))
                        lol[i] = []
                    lol[i].push(obj[pred.field][i])
                }
                return lol
            }, {}))

            var ret = false
            for(let i = 0; i < testB.length; i++) {
                var keyB = Object.keys(pred)[1]
                var predB = {}
                predB[keyB] = pred[keyB]
                var val = evalPred(predB, testB[i])
                if(val == null)
                    continue

                if(!val)
                    return false
                ret = true
            }
            return false
        }
        case "count": {
            var count = 0
            if("where" in pred)
                count = test[pred.field].filter(x => {
                    return evalPred(pred.where, x)
                }).length
            else {
                if(pred.field in test)
                    count = test[pred.field].length
                else if(Array.isArray(test))
                    count = test[0][pred.field].length
            }
            return count
        } 
        case "recent": {
            return evalPred(pred, [test[0]])
        }
        case "lt":
        case "lte":
        case "le":
        case "gte":
        case "ge":
        case "eq":
        case "gt": {
            var ret = evalPred(pred, test)
            // console.log(pred, "RET", ret)
            if(ret == null) {
                return null
            }

            if(Array.isArray(ret)) {
                return ret.map(x => {
                    if(x != null)
                        return evalComparator(key, x, pred.value)
                    else 
                        return null
                })
            } else {
                return evalComparator(key, ret, pred.value)
            }
        }
        default:
        return false


    }
    return false
}

export const getAnswers = (results, predicates) => {
    answers = {}
    for(var key in predicates) {
        var pred = predicates[key]
        // console.log("PREDICATE", key)
        var ans = evalPred(pred, results)
        // console.log("\n")
        answers[key] = ans
    }
    return answers

    /*var satisfy = []
    if(this.state.results.length > 0) {
        satisfy = this.state.results[0].nodules.filter((y, iy) => {
            return evalPred(x.predicate, iy)
        }).map(y => {
            return y.nodule_number
        })
    }

    // Calculate predefined predicates about this nodule
    var nodule = 0
    var growing = false
    var growingSlowly = false
    var growthThreshold = 1.5
    var unchanged = false
    var slowGrowthThreshold = 0.1
    var new_nodules = false
    var baseline = true
    var patient = this.props.patient

    //TODO: Sort by date
    if(this.state.results.length > 1 && this.state.results[0].nodules.length > 0) {
        var growth = this.getNoduleSize(this.state.results[0].nodules[nodule]) - this.getNoduleSize(this.state.results[1].nodules[nodule])
        growing = growth > growthThreshold;
        growingSlowly = growth <= growthThreshold && growth > slowGrowthThreshold
        unchanged = !growing && !growingSlowly

        if(this.state.results[0].nodules.length > this.state.results[1].nodules.length)
            new_nodules = true;
    } 

    var evalPred = (obj, nn = 0) => {
        if(!(typeof obj === 'object')) {
            return false
        }

        var key = Object.keys(obj)[0]
        var pred = obj[key]

        switch(key) {
            case "count": {
                if(Array.isArray(this.state.results[0][pred.field]) &&
                    this.state.results[0][pred.field].length == pred.value)
                    return true
                else
                    return false
            }
            case "or": {
                for(var i = 0; i < pred.length; i++) {
                    if(evalPred(pred[i], nn)) {
                        return true
                    }
                }
                return false
            }
            case "and": {
                for(var i = 0; i < pred.length; i++) {
                    if(!evalPred(pred[i], nn))
                        return false
                }
                return true
            }
            case "pred": {
                switch(pred) {
                    case "new":
                    return new_nodules
                    case "growing":
                    return growing
                    case "baseline":
                    return baseline
                    case "unchanged":
                    return unchanged
                    case "growingSlowly":
                    return growingSlowly
                    default:
                    return false
                }
            }
            case "lt": {
                // TODO: only cares about one nodule, should probably do them all
                return this.state.results[0].nodules[nn][pred.field] < pred.value
            }
            case "gte": {
                return this.state.results[0].nodules[nn][pred.field] >= pred.value
            }
            case "eq": {
                return this.state.results[1].nodules[nn][pred.field] == pred.value
            }
            case "change": {
                var time = 0
                var first = new Date(this.state.results[0].date)
                var fields = pred.field.split('|')
                for(var i = 1; i < this.state.results.length; i++) {
                    var nodules = this.state.results[i].nodules
                    var prev = this.state.results[0].nodules
                    if(nodules.length != prev.length)
                        return false

                    for(let j = 0; j < nodules.length; j++) {
                        if("category" in pred) {
                            var cats = pred.category.split('|')
                            var match = false
                            if("category" in nodules[j]) {
                                for(let k = 0; k < cats.length; k++) {
                                    if(nodules[j].category == cats[k]) {
                                        match = true
                                        break
                                    }
                                }
                            }
                            if(!match) {
                                if(j == nodules.length-1)
                                    return false
                                else
                                    continue
                            }
                        } 

                        for(let k = 0; k < fields.length; k++) {
                            if(!(fields[k] in nodules[j]) && !(fields[k] in prev[j]))
                                continue
                            if((fields[k] in nodules[j]) != (fields[k] in prev[j]))
                                return false
                            if(prev[j][fields[k]] - nodules[j][fields[k]] > pred.value)
                                return false
                        }
                    }

                    // No change, check timeframe
                    var check = new Date(this.state.results[i].date) 
                    var yearsDif = first.getFullYear() - check.getFullYear()
                    var monthsDif = yearsDif*12 + first.getMonth() - check.getMonth()
                    if(monthsDif > pred.since)
                        return true
                }
            }
        }
        return false
    } */
}
