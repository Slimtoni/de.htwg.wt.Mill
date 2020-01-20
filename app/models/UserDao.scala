package models

@javax.inject.Singleton
class UserDao {
  def lookupUser(u: User): Boolean = {
    if (u.email == "test@test.de" && u.password == "testtest") true else false
  }
}
