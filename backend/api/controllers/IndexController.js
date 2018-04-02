/**
 * IndexController
 *
 * @description :: Server-side logic for managing Indices
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const fs = require('fs');
const path = require('path');

module.exports = {

  /**
   * Get the index.html file by default independent of url
   * so that Angular can do its routing magic
   */
  index: function (req, res) {

    const indexPath = path.join(sails.config.appPath, 'assets', 'index.html');

    fs.readFile(indexPath, 'utf8', (err, data) => {
      if (err) {
        return res.negotiate(err);
      }
      return res.send(data);
    });
  }

};

