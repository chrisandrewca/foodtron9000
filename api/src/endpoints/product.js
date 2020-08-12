const express = require('express');
const router = express.Router();

router.get('/:tag', async (req, res, next) => {

  return res.json({
    product: {
      title: 'You are good Tee',
      photos: ['chrisandrewca'],
      genders: ['Womens', 'Mens'],
      styles: {
        'Womens': ['Beefy', 'Sporty'],
        'Mens': ['Beefy', 'Sporty']
      },
      colors: {
        'Womens': ['Red', 'Blue', 'Yellow'],
        'Mens': ['Red', 'Blue', 'Yellow']
      }
    },
    cc: body // TODO use fetch?
  });
});

module.exports = router;