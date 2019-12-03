package controllers

import akka.actor.{Actor, ActorRef, ActorSystem, Props}
import akka.stream.Materializer
import de.htwg.se.NineMensMorris.NineMensMorris
import de.htwg.se.NineMensMorris.controller.controllerComponent.Error
import de.htwg.se.NineMensMorris.controller.controllerComponent.controllerBaseImpl.ControllerMill
import javax.inject._
import play.api.libs.json._
import play.api.libs.streams.ActorFlow
import play.api.mvc._


@Singleton
class MillController @Inject()(cc: ControllerComponents)(implicit system: ActorSystem, mat: Materializer) extends AbstractController(cc) {

  val gameController: ControllerMill = NineMensMorris.controller

  def millAsText: String = gameController.gameboardToString

  def playerOnTurn: String = gameController.getPlayerOnTurn

  def playerPhase: String = gameController.getPlayerOnTurnPhase;

  def BoardAndPlayer: String = millAsText + playerOnTurn


  def socket = WebSocket.accept[String, String] { request =>
    ActorFlow.actorRef { out =>
      MillWebSocketActor.props(out)
    }
  }

  object MillWebSocketActor {
    def props(out: ActorRef) = Props(new MillWebSocketActor(out))
  }

  class MillWebSocketActor(out: ActorRef) extends Actor {
    override def receive: Receive = {
      case msg: String =>
        val status = performTurn(Json.parse(msg))
        out ! status
    }
  }

  def mill: Action[AnyContent] = Action { implicit request =>
    Ok(views.html.mill(gameController))
  }


  def playerOnTurnAPI(): Action[AnyContent] = Action {
    if (playerOnTurn != null) {
      val json: JsValue = Json.obj(
        "player" -> playerOnTurn,
        "phase" -> playerPhase)
      Ok(json)
    } else {
      Status(400)
    }
  }

  def performTurn(json: JsValue): String = {
    val err = gameController.performTurn((json \ "start").as[Int], (json \ "target").as[Int])
    err match {
      case Error.NoError => "200"
      case default => "400 " + Error.errorMessage(err)
    }
  }


  /*def performTurn(json: JsValue): Action[JsValue] = Action(parse.json) { implicit request =>
    val err = gameController.performTurn((request.body \ "start").as[Int], (request.body \ "target").as[Int])
    err match {
      case Error.NoError => Ok("200")
      case default => Status(400)("Detected error: " + Error.errorMessage(err))
    }
  }*/

  def checkMill: Action[JsValue] = Action(parse.json) { implicit request =>
    val mill = gameController.checkMill((request.body \ "field").as[Int])
    mill match {
      case true => Ok("true")
      case false => Ok("false")
      case _ => Status(400)("Undefined return Type")
    }
  }

  def endPlayersTurn: Action[AnyContent] = Action {
    gameController.endPlayersTurn()
    Ok("")
  }

  def startGame(): Action[AnyContent] = Action { implicit request =>
    gameController.startNewGame()
    Ok(views.html.mill(gameController))
  }

  def rules: Action[AnyContent] = Action { implicit request =>
    Ok(views.html.rules(gameController))
  }
}