# ==========================================================================
#   § Setup Server
# ==========================================================================
set :stage, :dev
set :stage_url, "http://dev.georgetowncied.org"
set :branch, "dist/dev"
server "anemone.dreamhost.com", user: "ciedadmin", roles: %w{web app db}
set :tmp_dir, "/home/ciedadmin/tmp"
set :deploy_to, "/home/ciedadmin/domains/cied.georgetown.edu/#{fetch(:stage)}/"
