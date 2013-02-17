/*global module require */

/**
 * Custom task for invoking the Ruby SASS gem.
 */
module.exports = function(grunt){

    // Create the task.
    grunt.registerMultiTask('sass', 'Invokes the Ruby SASS gem.', function(){

        // Dependencies.
        var exec = require('child_process').exec;

        // Grab the config.
        var done = this.async();
        var command = 'sass --update ' + this.data.src + ':' + this.data.dest;

        // Execute the command.
        exec(command, function(code, stdout, stderr){
            // The SASS gem doesn't seem to generate Unix exit codes...
            console.log('Successfully recompiled SASS.');
            done(code, stderr, code);
        });
    });
};