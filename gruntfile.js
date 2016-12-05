module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-sass');
  grunt.initConfig ({
    sass: {
      dist: {
        files: {
          'client/css/styles.css' : 'client/sass/styles.scss'
        } //files
      }//dist
    }, //sass
    watch: {
      source: {
        files: ['client/sass/**/*.scss'],
        tasks: ['sass'],
        options: {
          livereload: true, // needed to run LiveReload
        } //options
      } //source
    } //watch
  }) //config
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default', ['sass']);
};