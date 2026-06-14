const logger = {
  error: (message, err) => {
    if (process.env.NODE_ENV === 'development') {
      console.error(message, err?.message);
    }
  }
};

module.exports = logger;