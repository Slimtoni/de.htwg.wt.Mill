package controllers

import com.fasterxml.jackson.databind.JsonNode
import de.htwg.se.NineMensMorris.NineMensMorris
import de.htwg.se.NineMensMorris.controller.controllerComponent.controllerBaseImpl.ControllerMill
import de.htwg.se.NineMensMorris.controller.controllerComponent.Error
import javax.inject._
import play.api.Logger
import play.api.libs.json._
import play.api.mvc._
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
    val json: JsValue = Json.obj (
      "player" -> playerOnTurn,
      "phase" -> playerPhase)
    Ok(json)
  }

  def performTurn: Action[JsValue] = Action(parse.json) { implicit request =>
    val err = gameController.performTurn((request.body \ "start").as[Int], (request.body \ "target").as[Int])
    err match {
      case Error.NoError => Ok("200")
      case default => Status(400)("Detected error: " + Error.errorMessage(err))
    }
      /*request.body.validate[(Int, Int)].map {
        case (start, target) => {
          val err = gameController.performTurn(start, target)
          err match {
            case Error.NoError => Ok("200")
            case default => Status(400)("Detected error: " + Error.errorMessage(err))
          }
        }
      }.recoverTotal {
        e => BadRequest("Detected error: " + JsError.toFlatForm(e))
      }*/
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