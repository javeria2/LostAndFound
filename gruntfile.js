module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-sass');
  grunt.initConfig ({
    sass: {
      dist: {
        files: {
          'client/public/css/styles.css' : 'client/public/sass/styles.scss'
        } //files
      }//dist
    }, //sass
    watch: {
      source: {
        files: ['client/public/sass/**/*.scss'],
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