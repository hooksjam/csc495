var testConfig = {
	// Define the warehouse "fields" in terms of basic query language
	"IncreaseProfile_1_DSL": {
		"diagnosticProcedureID": "PKG_LDCT_LUNG",
		"query": "Attenuation = PartSolid and Comparison = IntervalIncrease and Lung Rads Version 1.0 = Category3"
	}
	"IncreaseProfile_1_Parsed": {
		"common": {
			"diagnosticProcedureID": "PKG_LDCT_LUNG"
		},
		"query": {
			"and": [
				{
					"left": "Attentuation",
					"right": "PartSolid",
					"operator": "="
				},
				{
					"left": "Comparison",
					"right": "IntervalIncrease",
					"operator": "="
				},
				{
					"left": "Lungs Rads Verison 1.0",
					"right": "Category3",
					"operator": "="
				}
			]
		}
	},
	"IncreaseProfile_1_Mongo_AnswerDoc": {
		"query": {
			"and": [
				{
					"query": {
						"diagnosticProcedureID": "PKG_LDCT_LUNG", 
						"choiceTitle": "Attentuation",
						"stringValue": "PartSolid" 
					},
					"options": {"responseID":1}
				},
				{
					"query": {
						"diagnosticProcedureID": "PKG_LDCT_LUNG", 
						"choiceTitle": "Comparison",
						"stringValue": "IntervalIncrease" 
					},
					"options": {"responseID":1}
				},
				{
					"query": {
						"diagnosticProcedureID": "PKG_LDCT_LUNG", 
						"choiceTitle": "Lung Rads Version 1.0",
						"stringValue": "Category3" 
					},
					"options": {"responseID":1}
				}
			]
		}
	},
	"IncreaseProfile_1_Mongo_ResponseDoc": {
		"query": {
			"diagnosticProcedureID": "PKG_LDCT_LUNG", 
			"Attentuation": "PartSolid",
			"Comparison": "IntervalIncrease",
			"Lung Rads Version 1.0": "Category3",
		}
		"options": {"responseID":1}
	},

	"NoduleProfile_1_DSL": {
		"diagnosticProcedureID": "PKG_LDCT_LUNG",
		"query": "Lung Rads Version 1.0 = Category3 and Number of nodules >= 5"
	}
	"NoduleProfile_1_Parsed": {
		"query": {
			"and": [
				{
					"left": "Lungs Rads Verison 1.0",
					"right": "Category3",
					"operator": "="
				}
				{
					"left": "Number of nodules"
					"right": 5,
					"operator": ">="
				}
			]
		}
	},
	"NoduleProfile_1_Mongo_AnswerDoc": {
		"query": {
			"and": [
				{
					"query": {
						"diagnosticProcedureID": "PKG_LDCT_LUNG", 
						"choiceTitle": "LungRads Version 1.0",
						"stringValue": "Category4B" 
					},
					"options": {"responseID":1}
				},
				{
					"query": {
						"diagnosticProcedureID": "PKG_LDCT_LUNG", 
						"choiceTitle": "Number of nodules",
						"numberValue": { $gte: 5 },
					},
					"options": {"responseID":1}
				},
			]
		}
	},
	"NoduleProfile_1_Mongo_ResponseDoc": {
		"query": {
			"diagnosticProcedureID": "PKG_LDCT_LUNG", 
			"Lung Rads Version 1.0": "Category4B",
			"Number of nodules": { $gte: 5},
		}
		"options": {"responseID":1}
	},


	"TrendProfile_1_DSL": {
		"diagnosticProcedureID": "PKG_LDCT_LUNG",
		"patientID": "abc",
		"query": "trend Nodule size, Number of nodules, LungRads Version 1.0",
	},
	"TrendProfile_1_Parsed": {
		"common": {
			"diagnosticProcedureID": "PKG_LDCT_LUNG"
			"patientID": "abc"
		}
		"query": {
			"trend": ["Nodule size, Number of nodules, LungRads Version 1.0"]
		}
	},
	"TrendProfile_1_Mongo_AnswerDoc": {
		"query": {
			"diagnosticProcedureID": "PKG_LDCT_LUNG", 
			"patientID": "abc",
			$or: [
				"choiceTitle": "Nodule size",
				"choiceTitle": "Number of nodules",
				"choiceTitle": "LungRads Version 1.0",
				"choiceTitle": "Date",
			]
		}
		"options": {
			"responseID": 1,
			"choiceTitle": 1,
			"date": 1,
		}
	},

	"TrendProfile_1_Mongo_ResponseDoc": {
		"query": {
			"diagnosticProcedureID": "PKG_LDCT_LUNG", 
			"patientID": "abc"
		}
		"options": {
			"responseID": 1,
			"Nodule size": 1,
			"Number of nodules": 1,
			"LungRads Version 1.0": 1,
			"Date": 1,
		}
	},
}

function warehouseAnswers_Test(responses, config = testConfig) {
	// Preprocess
	/*for(var field in testConfig) {
		var query = field.query
		for(var syn in field.synonyms) {
			field.query = field.query.replace(syn, field.synonyms[syn])
		}
	}*/

	var queryResponse = (query, response) => {
		var answer = false
		for(var key in query) {
			if(key == "and") {
				answer = true
				for(var clause in query[key]) {
					if(!answer)
						break

					if(!(clause.left in response)) {
						console.log(clause.left, "not found in response")
						continue
					}

					switch(clause.operator) {
						default:
						case "=":
							answer &= response[clause.left] = clause.right
							break
						case ">":
							answer &= response[clause.left] > clause.right
							break
						case ">=":
							answer &= response[clause.left] >= clause.right
							break
						case "<":
							answer &= response[clause.left] < clause.right
							break
						case "<=":
							answer &= response[clause.left] <= clause.right
							break
					}
				}
			}
		}
		return answer
	}

	var getDocument = (response) => {
		var doc = {}
		for(var field in testConfig) {
			if(response.diagnosticProcedureID != field.diagnosticProcedureID)
				continue

			var query = field.query
			doc[field] = queryResult(query, response)
		}
	}

	var documents = responses.map(x => return getDocument(x))
	console.log("Documents")
	console.log(documents)
}

function warehouseAnswers_Mongo(config) {
	/*return new Promise((resolve, reject) => {
		SDCQueryableAnswer.collection.insertMany(qAnswers, (err, docs) => {
			if(err) {
				reject(err)
			} else {
				resolve()
			}
		});
	})*/
}

/** 
 * Process an SDCResponse and insert results into elastic search
 * @param response
 * @return Promise
 */
 function warehouseAnswers_Elastic(config) {
 	return new Promise((resolve, reject) => {
		SDCForm.findOne({diagnosticProcedureID: response.diagnosticProcedureID.toString(), version:response.formVersion}, (err, form) => {
			if(err) {
				reject(err)
			} else if(!form) {
				reject("no form")
			} else {
				// Have all the info we need to build the elastic search objects
				var nodeMap = {}
				for(let i = 0; i < form.nodes.length; i++) {
					nodeMap[form.nodes[i].referenceID] = form.nodes[i]
				}
				var queryAnswers = []
				for(let i = 0; i < response.answers.length; i++) {
					var answer = response.answers[i]
					var node = nodeMap[answer.nodeID]

					var getAnswer = () => {
						var qAnswer = new SDCQueryableAnswer();
						qAnswer.diagnosticProcedureID = form.diagnosticProcedureID
						qAnswer.formTitle = form.title
						qAnswer.formVersion = form.verion
						qAnswer.patientID = response.patientID
						qAnswer.formFillerID = response.formFillerID
						qAnswer.nodeTitle = node.title
						qAnswer.nodeID = node.referenceID
						qAnswer.responseID  = answer.responseID
						return qAnswer
					}
					if(answer.choices != null) {
						var choiceTitles = {}
						for(let j = 0; j < node.choices.length; j++) {
							choiceTitles[node.choices[j].referenceID] = node.choices[j].title
						}
						for(let j = 0; j < answer.choices.length; j++) {
							var choice = answer.choices[j]
							// Get the choice from the form
							var qAnswer = getAnswer()
							qAnswer.choiceID = choice.choiceID
							qAnswer.choiceTitle = choiceTitles[choice.choiceID]
							if(choice.field != null) {
								if(choice.field.stringValue)
									qAnswer.stringValue = choice.field.stringValue
								if(choice.field.numberValue) 
									qAnswer.numberValue = choice.field.numberValue
							}
							queryAnswers.push(qAnswer)
						}
					}
					if(answer.field != null) {
						var qAnswer = getAnswer()
						if(answer.field.stringValue)
							qAnswer.stringValue = answer.field.stringValue
						if(answer.field.numberValue) 
							qAnswer.numberValue = answer.field.numberValue
						//Push query answers to Elastic search
						queryAnswers.push(qAnswer)
					}
				}
				if(queryAnswers.length == 0) {
					resolve()
				} else {
					indexAnswers(queryAnswers)
					.then(() => {
						warehouseAnswers(queryAnswers)
						.then(resolve)
						.catch(reject)
					})
					.catch(reject)
				}
			}
	 	})
 	})
}

function exampleDateQuery() {

	// Some queries that might was last at value X

	// Some way to describe change/no change between documents

	// Descriptors, "CHANGE, CHANGE INCR, CHANGE DECR, NO CHANGE, CHANGE GREATER THAN X"
	// Date modifiers, "SINCE LAST", "IN X YEARS"

	// For each patient retrieve a list of answers to target question, group by patient

	// Sort answers by date

	// First use date modifier, e.g. since last to truncate answer list to last 2
	// Since x years ago to retrieve oldest report up to and past X date

	// Once you have two documents to compare, check for description
	// no change : values are the same
	// change : values are different, increase? decrease?
	// change by : values are at least x apart

	// return all patients who match

	// E.g. Query. If patient had first report 5+ ya and no change in LungRADs, 
	//flag them for “stop screening” and do not schedule followups

	// trends LungRads, no change in 5 years
	// trends LungRads, change greater than 0.1 in 5 years
}


export default {
	warehouseAnswers_Test,
	warehouseAnswers_Mongo,
	warehouseAnswers_Elastic,
}