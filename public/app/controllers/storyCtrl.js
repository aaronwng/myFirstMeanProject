angular.module('storyCtrl', ['storyService'])

.controller('StoryController', function(Story, socketIo) {
    var vm = this;

    Story.allStory().success(function(data) {
        vm.stories = data;
    });

    vm.createStory = function() {
        Story.createStory(vm.storyData)
            .success(function(data) {

                // clear up the form
                vm.storyData = {};

                vm.message = data.message;

            });
    };

    socketIo.on('story', function(data) {
        vm.stories.splice(0,0,data);
    })
})

.controller('AllStoriesController', function(Story, socketIo) {
    var vm = this;

    Story.allStories().success(function(data) {
        vm.stories = data;
    });
    socketIo.on('story', function(data) {
        vm.stories.splice(0,0,data);
    });
});