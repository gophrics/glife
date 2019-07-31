enum EngineError: Error {
    case coreEngineError(message: String)
}

enum APIError: Error {
  case GenericError(message: String)
}
