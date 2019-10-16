package controllers

import javax.inject._
import play.api.mvc._
import de.htwg.se.NineMensMorris.{NineMensMorris, NineMensMorrisModule}
import de.htwg.se.NineMensMorris.controller.controllerComponent

@Singleton
class MillController @Inject()(cc: ControllerComponents) extends AbstractController(cc) {
  val gameController = NineMensMorris.controller
  def millAsText =  gameController.gameboardToString

  def about= Action {
    Ok(views.html.index())
  }

  def mill = Action {
    Ok(millAsText)
  }
  def addPlayer = Action {
    Ok(views.html.players())
  }


}