package controllers

import javax.inject.Inject
import play.api.mvc.Results._
import play.api.mvc._

import scala.concurrent.{ExecutionContext, Future}

class AuthenticatedUserAction @Inject()(parser: BodyParsers.Default)(implicit ec: ExecutionContext) extends ActionBuilderImpl(parser) {


  override def invokeBlock[A](request: Request[A], block: Request[A] => Future[Result]): Future[Result] = {
    val maybeUsername = request.session.get(models.Global.SESSION_KEY)
    maybeUsername match {
      case None => {
        Future.successful(
          Redirect(routes.MillController.loginPage()).flashing("error" -> "You are not logged in"))

      }
      case Some(u) => {
        val res: Future[Result] = block(request)
        res
      }
    }
  }

}
