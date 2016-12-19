const moment = require('moment');
require('moment/locale/es');

module.exports = {
  moduleName: 'date',
  moduleBody: function(input) {
    moment.locale('es');
    return moment(input).format('l');
  },
};
