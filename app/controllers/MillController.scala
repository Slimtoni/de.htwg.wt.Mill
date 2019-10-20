package controllers

import javax.inject._
import play.api.mvc._
import de.htwg.se.NineMensMorris.{NineMensMorris, NineMensMorrisModule}
import de.htwg.se.NineMensMorris.controller.controllerComponent

@Singleton
class MillController @Inject()(cc: ControllerComponents) extends AbstractController(cc) {
  val gameController = NineMensMorris.controller
  def millAsText =  gameController.gameboardToString
  def playerOnTurn = gameController.playerOnTurn.toString
  def BoardAndPlayer = millAsText + playerOnTurn


  def about= Action {
    Ok(views.html.index())
  }

  def mill = Action {
    Ok(views.html.mill(gameController))
  }
  def addPlayer(playerOne: String, playerTwo: String) = Action {
    //gameController.addPlayer(playerOne,playerTwo)
    Ok(BoardAndPlayer + gameController.playerWhite.toString + gameController.playerBlack.toString)
  }

  def startGame = Action {
    gameController.startNewGame()
    Ok(BoardAndPlayer)
  }

  def place(field: Int) = Action {
    gameController.placeMan(field)
    gameController.checkMill(field)
    gameController.changePlayerOnTurn()
    Ok(BoardAndPlayer)
  }

  def move(startField: Int, targetField: Int) = Action {
    gameController.moveMan(startField, targetField)
    gameController.checkMill(targetField)
    gameController.changePlayerOnTurn()
    Ok(BoardAndPlayer)
  }

  def fly(startField: Int, targetField: Int) = Action {
    gameController.flyMan(startField, targetField)
    gameController.checkMill(targetField)
    gameController.changePlayerOnTurn()
    Ok(BoardAndPlayer)
  }

}