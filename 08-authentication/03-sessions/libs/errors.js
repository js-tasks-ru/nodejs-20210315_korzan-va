class NotAuthorized extends Error {
  constructor(message) {
    super();
    this.status = 401;
    this.message = message;
  }
};

module.exports = {
  NotAuthorized,
}