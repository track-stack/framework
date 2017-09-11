module.exports = {
  saySomething: (something) => {
    return {
      type: "SAID_SOMETHING",
      data: something
    }
  }
}
