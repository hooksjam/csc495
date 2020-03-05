import parser from 'fast-xml-parser'
import parserV2 from 'xml-js'
import he from 'he'
import fs from 'fs'
import SDCForm from './models/SDCForm'
import SDCFormNode from './models/SDCFormNode'
import SDCFormField from './models/SDCFormField'
import SDCFormChoice from './models/SDCFormChoice'
import util from './util'

var parserOptions = {
	compact: false, 
	alwaysArray:true, 
	attributesKey:"attr", 
	elementsKey:"elem",
}

/** 
 * Helper to check whether a JSON object has a traversal of keys
 * @param obj JSON
 * @param keys [String]
 * @return bool
 */
function hasKeys(obj, keys) { 
	if(!(typeof obj === 'object' && obj != null)) {
		return false
	}
	var ref = obj
	for(var i = 0; i < keys.length; i++) {
		var key = keys[i]
		if(key in ref) {
			ref = ref[key]
		}
		else {
			return false
		}
	}
	return true
}

/** 
 * Helper to print an array 
 * @param arr []
 */
function printArray(arr) {
	console.log(arr.join(','))
}

/**
 * Takes the raw xml of a form and  transforms it to an SDCForm
 * @param xmlData file
 * @return SDCForm
 */
var traversalStack = []
function transformXMLToForm(xmlData) {
	var jsObj = parserV2.xml2js(xmlData, parserOptions)
	var form = new SDCForm()

	// Top level traversal to cut through to questions
	var nodeStack = []
	var choiceStack = []
	var traversalStack = []
	var getParentNode = () => {
		// console.log("Getting parent", nodeStack.length, nodeStack)
		if(nodeStack.length > 0)
			return form.nodes[nodeStack[nodeStack.length-1]]
		else
			return null
	}
	var addDependency = (node) => {
		if(!node) {
			console.log("OOPS!")
			return
		}
		var parentNode = getParentNode()
		if(parentNode != null) {
			if(parentNode.dependencies == null)
				parentNode.dependencies = []
			if(choiceStack.length > 0)
				parentNode.dependencies.push({nodeID: node.referenceID, choiceID:choiceStack[choiceStack.length-1].referenceID})
			else
				parentNode.dependencies.push({nodeID: node.referenceID})
		}	
	}
	var traverse = (name, parent, obj) => {
		if(obj == null) {
			console.log(name + " is null")
			return
		}
		// console.log("NAME!", name)
		var drillDown = () => {
			if(typeof obj === 'object' && obj != null && "elem" in obj && obj.elem.length > 0) {
				// console.log("Childcount", obj["elem"].length)
				for(var i = 0; i < obj["elem"].length; i++) {
					// console.log("Traversing child ", obj["elem"][i].name, " of ", name)
					traverse(obj["elem"][i].name, name, obj["elem"][i])
				}
			}
		}

		// Overall properties
		if(name == "FormDesign") {
			form.title = obj.attr.formTitle
			drillDown()
		}
		else if(name == "Property" && parent == "FormDesign") {
			form.properties.push({name:obj.attr.propName, value:obj.attr.val})
			drillDown()
		// Sections
		} else if(name == "Section") {
			var section = new SDCFormNode()
			section.title = obj.attr.title
			section.referenceID = `${obj.attr.name}_${obj.attr.ID}`
			section.nodeType = "Section"
			addDependency(section)

			if("maxCard" in obj.attr)
				section.maxInstances = obj.attr.maxCard

			form.nodes.push(section)
			nodeStack.push(form.nodes.length-1)
			drillDown()
			nodeStack.pop()
		} else if(name == "Property" && parent == "Section") {
			var section = getParentNode()
			if(section) {
				if(obj.attr.propClass == "instruction")
					section.instruction = obj.attr.val
			} else {
				console.log("Missing section for property")
			}
			drillDown()
		// Display Item
		} else if(name == "DisplayedItem") {
			var item = new SDCFormNode()
			item.title = obj.attr.title
			item.referenceID = `${obj.attr.name}_${obj.attr.ID}`
			//item.referenceID = obj.attr.ID
			item.nodeType = "Item"
			addDependency(item)
			console.log("ITEM", item)
			form.nodes.push(item)
		// Questions
		} else if(name == "Question") {	
			var question = new SDCFormNode()
			question.title = obj.attr.title
			question.referenceID = `${obj.attr.name}_${obj.attr.ID}`
			//question.referenceID = obj.attr.ID
			question.nodeType =  "Question"
			addDependency(question)

			form.nodes.push(question)
			nodeStack.push(form.nodes.length-1)
			drillDown()
			nodeStack.pop()
		} else if(name == "Property" && parent == "Question") {
			var node = getParentNode()
			if(node != null) {
				if(obj.attr.propName == "numbering") {
					node.numbering = obj.attr.val
				}
			} else {
				console.log("Missing parent", obj)
			}
			drillDown()
		} else if(parent == "ResponseField") {
			var question = getParentNode()
			if(question) {
				if(!question.field) {
					question.field = new SDCFormField()
				}
				if(name == "Response") {
					question.field.type = obj.elem[0].name
				} else if(name == "TextAfterResponse") {
					question.field.textAfter = obj.attr.val
				} else if(name == "ResponseUnits") {
					question.field.units = obj.attr.val
				}
			} else {
				console.log("No question for field")
			}
			// TODO: required, minInclusive, maxInclusive
			drillDown()
		} else if(parent == "ListItemResponseField") {
			var question = getParentNode()
			if(question) {
				console.log("LIST ITEM", question, choiceStack)
				var choice = question.choices[choiceStack[choiceStack.length-1].ix]
				if(choice) {
					if(!choice.field)
						choice.field = new SDCFormField()
					if(name == "Response") {
						choice.field.type = obj.elem[0].name
					} else if(name == "TextAfterResponse") {
						choice.field.textAfter = obj.attr.val
					} else if(name == "ResponseUnits") {
						choice.field.units = obj.attr.val
					}
				} else {
					console.log("No choice for choice field", obj)
				}
			} else {
				console.log("No question for field")
			}
			// TODO: required, minInclusive, maxInclusive
			drillDown()
		} else if(name == "ListField") {
			var question = getParentNode()
			if(question) {
				question.choices = []
				if(obj.attr && "maxSelections" in obj.attr)
					question.maxSelections = obj.attr.maxSelections
				else
					question.maxSelections = 1
			} else {
				console.log("No question for list")
			}
			drillDown()
		} else if(parent == "ListField") {
			if(name == "List") {
				/*if(!question.choices) {
					question.choices = []
				}*/
			} else if(name == "DefaultCodeSystem") {
				// TODO, RADLEX info
			}
			drillDown()
		} else if(parent == "List" && name == "ListItem") {
			var question = getParentNode()
			if(question) {
				var choice = new SDCFormChoice()
				choice.title = obj.attr.title
				choice.referenceID = `${obj.attr.name}_${obj.attr.ID}`
				// choice.referenceID = obj.attr.ID

				question.choices.push(choice)
				choiceStack.push({ix: question.choices.length-1, referenceID:choice.referenceID})
				drillDown()
				choiceStack.pop()
			} else {
				drillDown()
				console.log("No question for list item")
			}
		} else if(parent == "ListItem") {
			// TODO, more stuff about a choice?
			/*if(name == "Code") {
				//TODO, some code
			} else if(name == "CodeText")*/
			drillDown()
		} else {
			drillDown()
		}
	}

	traverse("root", null, jsObj)
	/*traversalStack.push({name:"root", name:null, obj:jsObj})
	while(traversalStack.length > 0) {
		var obj = traversalStack.pop()
		traverse(obj.name, obj.parent, obj.obj)
	}*/

	return {json:jsObj, form:form, xml:xmlData}
}

/** 
 * Takes the path of an xml file local to the server and transforms it to an SDCForm
 * @param path string, the local path
 * @return Promise
 */
function transformXMLAtPathToForm(path) {
	return new Promise((resolve, reject) => {
		if(fs.existsSync(path)) {
			try {
				var xmlData = fs.readFileSync(path).toString()
				resolve(transformXMLToForm(xmlData))
			} catch (err) {
				reject(err)
			}
		} else {
			reject("Couldn't find form " + path)
		}
	})
}


/**
 * Add form at path
 */
function addFormAtPath(diagnosticProcedureID, path, cleanup = false) {
	return new Promise((resolve, reject) => {
		// Save data to path
		transformXMLAtPathToForm(path)
		.then(data => {
			data.form.diagnosticProcedureID = diagnosticProcedureID
			// Remove the XML form after transformation to SDCForm
			if(cleanup) {
				try {
					fs.unlinkSync(path);
				} catch(e){
					reject(e)
				}
			}
			// Data contains the model, the raw json, the original XML
			insertVersionedForm(diagnosticProcedureID, data.form)
			.then(() => {
				resolve(data)
			})
			.catch(reject)
		})
		.catch(reject)
	})
}

/** 
 * Insert a form an increment the current top version number in the database
 * @param diagnosticProcedureID string
 * @param newForm SDCForm
 * @return Promise
 */
function insertVersionedForm(diagnosticProcedureID, newForm) {
	return new Promise((resolve, reject) => {
		SDCForm.findOne({diagnosticProcedureID: diagnosticProcedureID}).sort('-version').exec((err, form) => {
			if(err) {
				reject(err)
			} else {
				var newVersion = 1
				if(form && form.version) {
					newVersion = form.version + 1
				}
				newForm.diagnosticProcedureID = diagnosticProcedureID
				newForm.version = newVersion
				SDCForm.create(newForm, err => {
					if(err)
						reject(err)
					else {
						SDCForm.updateMany({diagnosticProcedureID:diagnosticProcedureID, version:{$ne: newVersion}}, {active:false}, (err) => {
							if(err)
								util.errorMessage(res, err, "deactivating old versions")
							else {
								resolve()
							}
						})
					}
				})
			}
		})
	})
}


export default {
	transformXMLToForm,
	transformXMLAtPathToForm,
	addFormAtPath
}