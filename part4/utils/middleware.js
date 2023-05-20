const logger = require('./logger')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method)
    logger.info('Path:  ', request.path)
    logger.info('Body:  ', request.body)
    logger.info('---')
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    } else if (error.name === 'JsonWebTokenError') {
        return response.status(400).json({ error: error.message })
    } else if (error.name === 'Unauthorized') {
        return response.status(401).json({ error: error.message })
    }

    next(error)
}

const tokenExtractor = (request, response, next) => {
    // code that extracts the token
    // const authorization = request.get('authorization')
    // if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    //     request.token = authorization.substring(7)
    //     console.log("token request.token", request.token)
    // } else {
    //     return null
    // }

    // next()

    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        request.token = authorization.substring(7)
    } else {
        //me than wala api aniwarayen ma palleha wage ena error eka pass karanna ona ita passe palleha next eken uda thiyana errorHandler methord eka call wela adala error eka pass karanwa
        //mehema danme nattam POST men eken unath error ekak pennanne naha nattam adala error eka neme pennanne stystem ekata ona eka token eka api yauwe nattam 401 Unauthorized
        //kiyala thami enna ona but enne 400 bad request kiyala oya me palleha return eke  "return null" kiyala deela balanna postman eke Bearer wa awwe nattam request eka send wewi thiyanwa response ekak enne na mokoda ai methana deela thibbe retrun null nisa 
        // palleha next() kiyana ekath aniwarayen ma ona nattam eth erros penna ne  eken thami uda thiyan erros filter karana ekata error eka pass karanne
        //oya me method eke udin dala thiyana code eke mama else eke return null pass karala thjiyan nisa thami mata kela une palleha thiyan vidiya thami hari vidiya
        return response.status(401).json({ error: 'Unauthorized' })
        // return null
    }

    next()
}

const userExtractor = async (request, response, next) => {
    const token = request.token
    console.log("token######################", token)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
    }
    const user = await User.findById(decodedToken.id)
    console.log("userExtractor######################", user._id)
    request.user = user

    next()
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    tokenExtractor,
    userExtractor
}