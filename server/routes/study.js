import express from 'express'
import util from '../util'

import SDCForm from '../models/SDCForm'
import SDCFormResponse from '../models/SDCFormResponse'
import SDCFormAnswer from '../models/SDCFormAnswer'
import SDCPersistentLink from '../models/SDCPersistentLink'
import SDCQueryableAnswer from '../models/SDCQueryableAnswer'
import elasticSearch from '../elastic'


export default (passport) => {
	var router = express.Router()

	/**
	 * Query responses
	 */
	 router.get('/', (req, res) => {
	 	res.send("TEST!")
	})

	return router
}