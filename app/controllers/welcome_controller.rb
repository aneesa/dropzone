class WelcomeController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index
  end

  def create
    if(params[:myBoringDropzoneForm])
      render plain: params[:myBoringDropzoneForm].inspect
    else
      render plain: params.inspect
    end
  end
end
