# customize path to capistrano files
# they're placed in config/cap to standardize
# project config location
set :deploy_config_path, 'config/cap/deploy.rb'
set :stage_config_path, 'config/cap/deploy'

# Load DSL and set up stages
require 'capistrano/setup'

# Include default deployment tasks
require 'capistrano/deploy'

# Deploy submodules
require 'capistrano/git'
#require './config/cap/lib/submodule_strategy'

# Uses yaml for database setup
# require 'yaml'

# Include tasks from other gems included in your Gemfile
#
# For documentation on these, see for example:
#
#   https://github.com/capistrano/rvm
#   https://github.com/capistrano/rbenv
#   https://github.com/capistrano/chruby
#   https://github.com/capistrano/bundler
#   https://github.com/capistrano/rails
#   https://github.com/capistrano/passenger
#
# require 'capistrano/rvm'
# require 'capistrano/rbenv'
# require 'capistrano/chruby'
# require 'capistrano/bundler'
# require 'capistrano/rails/assets'
# require 'capistrano/rails/migrations'
# require 'capistrano/passenger'

# Load custom tasks from `lib/capistrano/tasks' if you have any defined
# Dir.glob('lib/capistrano/tasks/*.rake').each { |r| import r }
Dir.glob('config/cap/tasks/*.cap').each { |r| import r }
