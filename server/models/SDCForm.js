var mongoose = require('mongoose'),
    Schema = mongoose.Schema

import SDCFormNode from './SDCFormNode'

var SDCFormProperty = new Schema({
	name: {type: String, default:undefined},
	value: {type: String, default:undefined}
}, {_id:false})

var SDCFormSchema = new Schema({
	diagnosticProcedureID: {type: String},
	version: {type: Number, default: 0},
	active: {type: Boolean, default: true},
    title: {type: String, default: ""},
    nodes:[{type: SDCFormNode.schema}],
    properties:[{type: SDCFormProperty}]
}, { collection: "SDCForm" })

SDCFormSchema.methods.ToString = () => {
	return this.diagnosticProcedureID
}

export default mongoose.model('SDCForm', SDCFormSchema)
