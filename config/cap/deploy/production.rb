# ==========================================================================
#   § Setup Server
# ==========================================================================
set :stage, :production
set :stage_url, "http://cied.georgetown.edu"
set :branch, "dist/production"
server "anemone.dreamhost.com", user: "ciedadmin", roles: %w{web app db}
set :tmp_dir, "/home/ciedadmin/tmp"
set :deploy_to, "/home/ciedadmin/domains/cied.georgetown.edu/#{fetch(:stage)}/"
