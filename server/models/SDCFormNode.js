var mongoose = require('mongoose'),
    Schema = mongoose.Schema

import SDCFormField from './SDCFormField'
import SDCFormChoice from './SDCFormChoice'

var SDCFormDependency = new Schema({
	nodeID: {type: String},
	choiceID: {type: String, default:undefined}
},{_id:false})

var SDCFormNodeSchema = new Schema({
	_id: {type: String},
	title: {type: String, default: ""},
	referenceID: {type: String},
	nodeType: {type: String}, // Section, Question, Question
	numbering: {type: String},
	// sectionID: {type: String},

	// Depending on type, could have subset of the following
	instruction: {type: String, default: undefined},
	dependencies: {type:[SDCFormDependency], default:undefined},
	maxSelections: {type: Number, default: undefined},
	choices: {type: [SDCFormChoice.schema], default:undefined},
	field: {type: SDCFormField.schema, default:undefined},
	maxInstances: {type: Number, default:undefined}
})

export default mongoose.model('SDCFormNode', SDCFormNodeSchema)
