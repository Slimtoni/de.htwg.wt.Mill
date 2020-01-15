package controllers

import akka.actor.{Actor, ActorRef, ActorSystem, Props}
import akka.stream.Materializer
import de.htwg.se.NineMensMorris.NineMensMorris
import de.htwg.se.NineMensMorris.controller.controllerComponent.Error
import de.htwg.se.NineMensMorris.controller.controllerComponent.controllerBaseImpl.ControllerMill
import de.htwg.se.NineMensMorris.model.playerComponent.playerBaseImpl.Player
import javax.inject._
import play.api.libs.json._
import play.api.libs.streams.ActorFlow
import play.api.mvc._

import scala.swing.Reactor


@Singleton
class MillController @Inject()(cc: ControllerComponents)(implicit system: ActorSystem, mat: Materializer) extends AbstractController(cc) {

  val gameController: ControllerMill = NineMensMorris.controller

  def millAsText: String = gameController.gameboardToString

  def playerOnTurn: String = gameController.getPlayerOnTurn

  def playerPhase: String = gameController.getPlayerOnTurnPhase;

  def BoardAndPlayer: String = millAsText + playerOnTurn


  def socket: WebSocket = WebSocket.accept[String, String] { request =>
    ActorFlow.actorRef { out =>
      MillWebSocketActor.props(out)
    }
  }

  object MillWebSocketActor {
    def props(out: ActorRef) = Props(new MillWebSocketActor(out))

  }

  class MillWebSocketActor(out: ActorRef) extends Actor with Reactor {
    override def receive: Receive = {
      case msg: String =>
        val json = Json.parse(msg)
        val functionName = json("function").toString().replace("\"", "")
        functionName match {
          case "loadPlayer" => out ! loadPlayer
          case "getFieldStatus" => out ! getFieldStatus(json)
          case "performTurn" => out ! performTurn(json)
          case "endPlayersTurn" => endPlayersTurn
        }
        /*val status = performTurn(Json.parse(msg))
        out ! status
        broadcast()*/
    }
    reactions
  }

  def loadPlayer: String = {
    val player = Json.obj("type" -> "loadPlayer", "player" -> Json.obj(
      "name" -> gameController.getPlayerOnTurn,
      "phase" -> gameController.getPlayerOnTurnPhase
    ))
    player.toString
  }

  def broadcast() = Action { _ =>
    system.actorSelection("akka://system/user/workers/*") ! "refresh"
    Ok
  }

  def mill: Action[AnyContent] = Action { implicit request =>
    Ok(views.html.mill(gameController))
  }

  def getField: Action[JsValue] = Action(parse.json) { implicit request =>
    val field = gameController.getField((request.body \ "field").as[Int])
    field match {
      case Some(value) => {
        val json: JsValue = Json.obj(
          "fieldStatus" -> value.fieldStatus
        )
        Ok(json)
      }
      case None => Status(400)
    }
  }

  def getFieldStatus(json: JsValue): String = {
    val fieldID = json("field").toString().replace("\"", "").toInt
    val field = gameController.getField(fieldID)
    field match {
      case Some(value) => Json.obj("type" -> "fieldStatus" ,"status" -> value.fieldStatus.toString).toString()//JsString(value.fieldStatus.toString)).toString()
      case None => Json.obj("type" -> "fieldStatus", "status" -> "Empty").toString()
    }
  }
  //TODO: vue js methods
  //https://github.com/Luckytama/Play-Empire/blob/master/app/controllers/EmpireController.scala
  //https://github.com/Luckytama/Play-Empire/blob/master/public/javascripts/game_page.js
  def playerOnTurnAPI(): Action[AnyContent] = Action {
    if (playerOnTurn != null) {
      val json: JsValue = Json.obj(
        "player" -> JsString(playerOnTurn),
        "phase" -> JsString(playerPhase))
      Ok(json)
    } else {
      Status(400)
    }
  }

  def performTurn(json: JsValue): String = {
    val startField = json("start").toString().replace("\"", "").toInt
    val targetField = json("target").toString().replace("\"", "").toInt
    val err = gameController.performTurn(startField, targetField)
    err match {
      case Error.NoError => Json.obj("type" -> "performTurn", "result" -> "200").toString()
      case default => Json.obj("type" -> "performTurn", "result" -> "400").toString()
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

  def caseOfMill: Action[JsValue] = Action(parse.json) { implicit request =>
    val err = gameController.caseOfMill((request.body \ "field").as[Int])
    err match {
      case Error.NoError => Ok("200")
      case _ => Status(400)("Detected error: " + Error.errorMessage(err))
    }
  }

  def endPlayersTurn(): Unit = {
    gameController.endPlayersTurn()
  }

  def startGame(): Action[AnyContent] = Action { implicit request =>
    gameController.startNewGame()
    Ok(views.html.mill(gameController))
  }

  def rules: Action[AnyContent] = Action { implicit request =>
    Ok(views.html.rules(gameController))
  }
}