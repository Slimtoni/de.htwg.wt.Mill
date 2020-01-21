package controllers

import java.io._

import akka.actor.{Actor, ActorRef, ActorSystem, Props}
import akka.stream.Materializer
import de.htwg.se.NineMensMorris.NineMensMorris
import de.htwg.se.NineMensMorris.controller.controllerComponent.controllerBaseImpl.ControllerMill
import de.htwg.se.NineMensMorris.controller.controllerComponent.{Error, FieldChanged, PlayerPhaseChanged, StartNewGame}
import javax.inject.{Inject, _}
import models.{Global, UserDao}
import play.api.libs.json._
import play.api.libs.streams.ActorFlow
import play.api.mvc._
import scala.swing.Reactor


@Singleton
class MillController @Inject()(cc: ControllerComponents, authenticatedUserAction: AuthenticatedUserAction, userDao: UserDao)(implicit system: ActorSystem, mat: Materializer) extends AbstractController(cc) {

  val gameController: ControllerMill = NineMensMorris.controller

  var participants: Map[String, ActorRef] = Map.empty[String, ActorRef]

  def gameStarted: Boolean = gameController.gameStarted

  def millAsText: String = gameController.gameboardToString

  def playerOnTurn: String = gameController.getPlayerOnTurn

  def playerPhase: String = gameController.getPlayerOnTurnPhase;

  def BoardAndPlayer: String = millAsText + playerOnTurn

  def gameboard: String = gameController.gameboardToString

  def gameinfoJson: JsObject = {
    var vertexJson = gameController.gameboard.vertexList.toString()
    vertexJson = vertexJson.substring(12, vertexJson.length - 1)
    vertexJson = vertexJson.replaceAll(", ", "")
    Json.obj(
      "Players" -> Json.obj(
        "player1" -> Json.obj(
          "name" -> JsString(gameController.playerWhite.name),
          "phase" -> JsString(gameController.playerWhite.phase.toString),
          "placedMen" -> JsNumber(gameController.playerWhite.numberPlacedMen),
          "lostMen" -> JsNumber(gameController.playerWhite.numberLostMen)

        ),
        "player2" -> Json.obj(
          "name" -> JsString(gameController.playerBlack.name),
          "phase" -> JsString(gameController.playerBlack.phase.toString),
          "placedMen" -> JsNumber(gameController.playerBlack.numberPlacedMen),
          "lostMen" -> JsNumber(gameController.playerBlack.numberLostMen)
        ),
        "playerOnTurn" -> Json.obj(
          "name" -> JsString(gameController.playerOnTurn.name)
        )
      ),
      "gameboard" -> Json.obj(
        "vertexList" -> JsString(vertexJson)
      ),
      "gameRunning" -> JsBoolean(gameStarted)
    )
  }

  // https://www.playframework.com/documentation/2.8.x/ScalaWebSockets
  /*def socket: WebSocket = WebSocket.acceptOrResult[String, String] { request =>
    Future.successful(request.session.get("user") match {
      case None => Left(Forbidden)
      case Some(value) =>
        Right(ActorFlow.actorRef { out =>
          MillWebSocketActor.props(out)
        })
    })
  }*/
  def socket: WebSocket = WebSocket.accept[String, String] { request =>
    ActorFlow.actorRef { out =>
      MillWebSocketActor.props(out)
    }
  }

  object MillWebSocketActor {
    def props(out: ActorRef) = Props(new MillWebSocketActor(out))

  }

  class MillWebSocketActor(out: ActorRef) extends Actor with Reactor {
    listenTo(gameController)

    override def receive: Receive = {
      case msg: String =>
        if (participants.contains("Peter")) {
          participants += "Olaf".->(out)
        } else {
          participants += "Peter".->(out)
        }
        val json = Json.parse(msg)
        val functionName = json("function").toString().replace("\"", "")


        functionName match {
          //case "performTurn" => out ! performTurn(json)
          case "endPlayersTurn" => endPlayersTurn()
          case "updateGameboard" =>
            if (gameStarted) broadcast()
          case "startGame" => out ! start()

        }
    }

    def broadcast(): Unit = {
      participants.values.foreach(_ ! updateGameboard())
    }

    reactions += {
      case _: FieldChanged => broadcast()
      case _: PlayerPhaseChanged => broadcast()
      case _: StartNewGame =>
        broadcast()
    }

  }

  def updateGameboard(): String = {
    Json.obj("type" -> "updateGameboard", "game" -> gameinfoJson).toString()
  }


  def mill = authenticatedUserAction { implicit request =>
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


  def register(): Action[JsValue] = Action(parse.json) { implicit request =>
    val username = (request.body \ "username").as[JsString].value
    val email = (request.body \ "email").as[JsString].value
    val password = (request.body \ "password").as[JsString].value
    val u = models.User(username, email, password)
    println(u)
    val jsonuser = Json.obj(
      "username" -> username,
      "email" -> email,
      "password" -> password
    ).toString()
    Status(200)
  }


  def login(): Action[JsValue] = Action(parse.json) { implicit request =>
    val email: String = (request.body \ "email").as[JsString].value
    val password: String = (request.body \ "password").as[JsString].value

    val u = models.User("", email, password)
    val found = userDao.lookupUser(u)
    if (found) {
      Redirect(routes.MillController.mill())
        .withSession(Global.SESSION_KEY -> u.email)
    } else {
      Redirect(routes.MillController.loginPage())
    }
  }

  def logout: Action[AnyContent] = authenticatedUserAction { implicit request: Request[AnyContent] =>
    Redirect(routes.MillController.loginPage()).withNewSession
  }

  def getFieldStatus(json: JsValue): String = {
    val fieldID = json("field").toString().replace("\"", "").toInt
    val field = gameController.getField(fieldID)
    field match {
      case Some(value) => Json.obj("type" -> "fieldStatus", "id" -> fieldID, "status" -> value.fieldStatus.toString).toString() //JsString(value.fieldStatus.toString)).toString()
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

  /*def performTurn(json: JsValue): String = {
    val startField = json("start").toString().replace("\"", "").toInt
    val targetField = json("target").toString().replace("\"", "").toInt
    val err = gameController.performTurn(startField, targetField)
    err match {
      case Error.NoError => Json.obj("type" -> "performTurn", "result" -> "200").toString()
      case default => Json.obj("type" -> "performTurn", "result" -> "400").toString()
    }
  }*/


  def performTurn: Action[JsValue] = Action(parse.json) { implicit request =>
    val err = gameController.performTurn((request.body \ "start").as[Int], (request.body \ "target").as[Int])
    err match {
      case Error.NoError => Status(200)
      case _ => Status(400)("Detected error: " + Error.errorMessage(err))
    }
  }

  def checkMill: Action[JsValue] = Action(parse.json) { implicit request =>
    val err = gameController.checkMill((request.body \ "field").as[Int])
    err match {
      case true => Status(200)("true")
      case false => Status(200)("false")
      case _ => Status(400)(err.toString)
    }
  }

  def caseOfMill: Action[JsValue] = Action(parse.json) { implicit request =>
    val err = gameController.caseOfMill((request.body \ "field").as[Int])
    err match {
      case Error.NoError => Status(200)
      case _ => Status(400)(err.toString)
    }
  }

  def endPlayersTurn(): Unit = {
    gameController.endPlayersTurn()
  }


  def start(): String = {
    gameController.startNewGame()
    gameController.gameStarted = true
    Json.obj("type" -> "startGame").toString()
  }

  def rules = authenticatedUserAction { implicit request =>
    Ok(views.html.rules(gameController))
  }


  def loginPage: Action[AnyContent] = Action { implicit request =>
    Ok(views.html.login(gameController))
  }
}