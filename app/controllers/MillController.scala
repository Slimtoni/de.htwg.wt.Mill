package controllers

import de.htwg.se.NineMensMorris.NineMensMorris
import de.htwg.se.NineMensMorris.controller.controllerComponent.controllerBaseImpl.ControllerMill
import javax.inject._
import play.api.libs.json._
import play.api.mvc._


@Singleton
class MillController @Inject()(cc: ControllerComponents) extends AbstractController(cc) {
  val gameController: ControllerMill = NineMensMorris.controller

  def millAsText: String = gameController.gameboardToString

  def playerOnTurn: String = gameController.playerOnTurn.toString

  def playerPhase: String = gameController.playerOnTurn.phase.toString;

  def BoardAndPlayer: String = millAsText + playerOnTurn


  def about: Action[AnyContent] = Action {
    Ok(views.html.index())
  }

  def mill: Action[AnyContent] = Action {
    Ok(views.html.mill(gameController))
  }

  def addPlayer(playerOne: String, playerTwo: String): Action[AnyContent] = Action {
    //gameController.addPlayer(playerOne,playerTwo)
    Ok(BoardAndPlayer + gameController.playerWhite.toString + gameController.playerBlack.toString)
  }

  def playerOnTurnAPI(): Action[AnyContent] = Action {
    val json: JsValue = Json.obj(
      "player" -> playerOnTurn,
      "phase" -> playerPhase)
    Ok(json)
  }

  def startGame: Action[AnyContent] = Action {
    gameController.startNewGame()
    Ok(views.html.mill(gameController))
  }

  def place(field: Int): Action[AnyContent] = Action {
    gameController.placeMan(field)
    gameController.checkMill(field)
    gameController.changePlayerOnTurn()
    Ok(views.html.mill(gameController))
  }

  def move(startField: Int, targetField: Int): Action[AnyContent] = Action {
    gameController.moveMan(startField, targetField)
    gameController.checkMill(targetField)
    gameController.changePlayerOnTurn()
    Ok(views.html.mill(gameController))
  }

  def fly(startField: Int, targetField: Int): Action[AnyContent] = Action {
    gameController.flyMan(startField, targetField)
    gameController.checkMill(targetField)
    gameController.changePlayerOnTurn()
    Ok(views.html.mill(gameController))
  }

  def rules = Action {
    Ok(views.html.rules())
  }

}