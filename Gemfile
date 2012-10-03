source 'http://rubygems.org'

gem 'rails', '3.1.1'
gem 'composite_primary_keys'
gem "thin"

# Bundle edge Rails instead:
# gem 'rails',     :git => 'git://github.com/rails/rails.git'

gem "heroku"

# Gems used only for assets and not required
# in production environments by default.
group :assets do
  gem 'sass-rails',   '~> 3.1.4'
  gem 'coffee-rails', '~> 3.1.1'
  gem 'uglifier', '>= 1.0.3'
end

gem 'jquery-rails'
gem 'formtastic', '~> 2.1.1'

group :development, :test do
  gem "pg"
	gem "rspec-rails"
  gem 'capybara'
  gem 'sqlite3'
end
group :production do
  gem 'pg'
end

# To use ActiveModel has_secure_password
# gem 'bcrypt-ruby', '~> 3.0.0'

# Use unicorn as the web server
# gem 'unicorn'

# Deploy with Capistrano
# gem 'capistrano'

# To use debugger

group :test do
  # Pretty printed test output
  gem 'turn', :require => false
end
