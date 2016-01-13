# ==========================================================================
#   § Setup Server
# ==========================================================================
set :stage, :dev
set :stage_url, "http://p0283.makethings.webfactional.com"
set :branch, "dist/dev"
server "makethings.webfactional.com", user: "makethings", roles: %w{web app db}
set :tmp_dir, "/home/makethings/tmp"
set :deploy_to, "/home/makethings/htdocs/p0283/#{fetch(:stage)}/"
