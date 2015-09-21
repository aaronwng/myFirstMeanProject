module.exports = (grunt) ->
	grunt.initConfig
		coffee:
			compileBare:
				options:
					bare: true
				files:
					'public/app/views/user.js': 'coffee/user.coffee'
					'public/app/controllers/userCtrl.js': 'coffee/userCtrl.coffee'
		watch:
			files: ['coffee/user.coffee','coffee/userCtrl.coffee']
			tasks: ['coffee']

	grunt.loadNpmTasks 'grunt-contrib-coffee'
	grunt.loadNpmTasks 'grunt-contrib-watch'