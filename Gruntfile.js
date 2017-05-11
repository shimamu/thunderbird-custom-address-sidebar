module.exports = function(grunt) {
	grunt.initConfig({
		compress : {
			zip : {
				options : {
					archive : 'dist/custom_address_sidebar.zip'
				},
				files : [{expand:true, src:'**', cwd:'src'}]
			}
		},
		rename: {
			xpi: {
				files: [{
					src: ['dist/custom_address_sidebar.zip'],
					dest: 'dist/custom_address_sidebar-1.1.2.xpi'
				}]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-contrib-rename');

	grunt.registerTask('default', ['compress', 'rename']);
};
