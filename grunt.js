/*global module */

module.exports = function (grunt) {

    // Load additional modules.
    grunt.loadNpmTasks('grunt-contrib');
    grunt.loadNpmTasks('grunt-coffeelint');
    grunt.loadNpmTasks('grunt-browserify');

    // Load our custom tasks.
    grunt.loadTasks('config/tasks');

    // Define our default lint options.
    var lint = {
        "max_line_length": { "level": "ignore" },
        "no_trailing_whitespace": { "level": "ignore" }
    };

    /**
     * Define our Grunt configuration.
     */
    grunt.initConfig({

        project: {
            app: {
                name: 'Mozart Empty',
                title: 'Mozart Empty Project',
                namespace: 'App'
            }
        },

        // The public folder contents are deleted when cleaned
        clean: { public: ['./public/*'] },

        // Copy The Assets folder to public
        copy: {
            compile: {
                files: {
                    "public/": "app/assets/**"
                }
            }
        },

        // Handle compiling our app.
        coffee: {
            compile: {
                files: {
                    'public/specs/specs.js': [
                        'app/specs/*-spec.coffee',
                        'app/specs/**/*-spec.coffee'

                    ],
                    'public/js/application.js': [
                        // The boot file needs to come first.
                        'app/config/boot.coffee',

                        // Models.
                        'app/models/*.coffee',

                        // Include the base controllers first, then the classes that extend them.
                        'app/controllers/*.coffee',
                        'app/controllers/steps/*.coffee',

                        // Likewise include the base views first, then the classes that extend them.
                        'app/views/*.coffee',
                        'app/views/**/*.coffee',

                        // The app itself needs to be last.
                        'app/config/app.coffee'
                    ]
                }
            }
        },

        // Define the files we'll lint.
        coffeelint: {
            app: {
                files: ['app/**/*.coffee'],
                options: lint
            },
        },

        // Handle concatenating our various files.
        concat: {
            vendor: {
                src: ['vendor/scripts/*.js'],
                dest: 'public/js/vendor.js'
            }
        },

        // Provide the ability to generate controllers/views/templates/models.
        generate: {
            name: '<config:project.app.namespace>',
            root: 'app/'
        },

        // Handle compiling our templates.
        handlebars: {
            compile: {
                options: {
                    namespace: 'HandlebarsTemplates',
                    processName: function (original) {
                        return original.replace('.hbs', '');
                    },
                    wrapped: true
                },
                files: {
                    'public/js/templates.js': 'app/templates/**/*.hbs'
                }
            }
        },

        // Parameters for our custom SASS invoker.
        sass: {
            app: {
                src: 'app/scss/',
                dest: 'public/css/'
            }
        },

        // Integration server for serving up static demo app and stubbed rest server
        integration: {
            port: 8080,
            base: './public'
        },

        // Compile MessageFormat JSON files
        messageformat: {
            app: {
                src: "app/lang",
                dest: "public/js/i18n"
            }
        },

        codo: {
            app: {
                name: "<config:project.app.name>",
                title: "<config:project.app.title>",
                src: "app"
            }
        },

        /**
         * Allow Grunt to run by itself.
         */
        watch: {
            app: {
                files: '<config:coffeelint.app.files>',
                tasks: 'coffeelint:app coffee codo'
            },
            handlebars: {
                files: 'app/templates/**/*.hbs',
                tasks: 'handlebars'
            },
            scss: {
                files: 'public/scss/**/*.scss',
                tasks: 'sass'
            },
            messageformat: {
                files: 'app/lang/**/*.json',
                tasks: 'messageformat'
            }
        }
    });

    // Build task
    grunt.registerTask('build', 'clean copy concat coffee handlebars sass messageformat codo');

    // Dev run task
    grunt.registerTask('run', 'build integration watch');

    // Default task
    grunt.registerTask('default', 'run');
};
