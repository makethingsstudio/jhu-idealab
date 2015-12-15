# ==========================================================================
#   § Setup Server
# ==========================================================================
set :stage, :staging
set :stage_url, "http://staging.georgetowncied.org"
set :branch, "dist/staging"
server "anemone.dreamhost.com", user: "ciedadmin", roles: %w{web app db}
set :tmp_dir, "/home/ciedadmin/tmp"
set :deploy_to, "/home/ciedadmin/domains/cied.georgetown.edu/#{fetch(:stage)}/"
set :keep_releases, 1
