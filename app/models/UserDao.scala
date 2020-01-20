package models


@javax.inject.Singleton
class UserDao {
  def lookupUser(u: User): Boolean = {
    if ((u.email == "toni@hummel.de" && u.password == "testtest") ||
      u.email == "matze@asche.de" && u.password == "testtest")
      true else false
  }
}

