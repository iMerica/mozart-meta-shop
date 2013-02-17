path = require "path"

module.exports = (grunt) ->
  grunt.registerTask 'integration', 'Starts the integration server stub', ->
    express = require "express"
    fs = require "fs"
    app = express()

    port = grunt.config('integration.port') || 8010;
    base = path.resolve(grunt.config('integration.base') || '.');

    GLOBAL.app = app

    app.configure ->
      app.use express.logger(format: "dev")
      app.use express.compress()
      app.use express.bodyParser()
      app.use express.cookieParser()
      app.use express.methodOverride()
      app.use app.router
      app.use express.static(base)
      app.use (req, res) ->
        res.sendfile(base+"/index.html")

    app.configure "development", ->
    app.use express.errorHandler(
      dumpExceptions: true
      showStack: true
    )

    app.configure "production", ->
      app.use express.errorHandler()

    ## Routes - Set up custom server side routes here

    # app.get "/test/customers", (req, res) ->
    #   res.json [
    #     { id: 456345, name: 'Jason O\'Conal' }
    #     { id: 345346, name: 'Scott Christopher' }
    #     { id: 234235, name: 'Drew Karrasch' }
    #     { id: 876976, name: 'Luke Eller' }
    #     { id: 786788, name: 'Chris Roper' }
    #     { id: 123884, name: 'Pascal Zajac' }
    #   ]

    app.listen port
    console.log "Mozart Empty - Express server listening on port #{port}"