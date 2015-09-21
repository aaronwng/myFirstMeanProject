angular.module 'userService' ,[]

.factory 'User', ($http) ->
	userFactory = {}

	userFactory.create = (userData) ->
		$http.post '/api/signup', userData


	userFactory.all = ()->
		$http.get '/api/users'
	return userFactory