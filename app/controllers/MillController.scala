package controllers

import de.htwg.se.NineMensMorris.NineMensMorris
import de.htwg.se.NineMensMorris.controller.controllerComponent.controllerBaseImpl.ControllerMill
import javax.inject._
import play.api.Logger
import play.api.libs.json._
import play.api.mvc._
import play.filters.csrf.AddCSRFToken
import views.html.helper.CSRF


@Singleton
class MillController @Inject()(cc: ControllerComponents) extends AbstractController(cc) {

  val gameController: ControllerMill = NineMensMorris.controller

  def millAsText: String = gameController.gameboardToString

  def playerOnTurn: String = gameController.playerOnTurn.toString

  def playerPhase: String = gameController.playerOnTurn.phase.toString;

  def BoardAndPlayer: String = millAsText + playerOnTurn

  def mill: Action[AnyContent] = Action { implicit request =>
    Ok(views.html.mill(gameController))
  }

  def changePlayer: Action[AnyContent] = Action {
    gameController.changePlayerOnTurn();
    Ok("")
  }

  def playerOnTurnAPI(): Action[AnyContent] = Action {
    val json: JsValue = Json.obj(
      "player" -> playerOnTurn,
      "phase" -> playerPhase)
    Ok(json)
  }

  def performTurn = Action(parse.json) { implicit request =>
    gameController.performTurn((request.body \ "start").as[Int], (request.body \ "target").as[Int])
    Ok(request.body)
  }

    def startGame(): Action[AnyContent] = Action { implicit request =>
      val token = CSRF.getToken.value
      gameController.startNewGame()
      Ok(views.html.mill(gameController))
    }

    def rules: Action[AnyContent] = Action { implicit request =>
      Ok(views.html.rules(gameController))
    }

  }