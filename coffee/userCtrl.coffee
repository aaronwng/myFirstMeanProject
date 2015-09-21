angular.module 'userCtrl', ['userService']

.controller 'UserCOntroller', (User) ->
	vm=this
	vm.processing =true
	User.all()
		.success (data)->
			vm.users =data



.controller 'UserCreateController', (User, $location,$window)->
	vm =this
	vm.signupUser= ()->
		vm.message =''

		User.create vm.userData
			.then (response) ->
				vm.userData={}
				vm.message = response.data.message

				$window.locaalStorage.setItem 'token',response.data.token
				$location.path '/'