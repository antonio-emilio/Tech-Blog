const User = require('../database/models/User')
 
module.exports = (req, res) => {
    User.create(req.body, (error, user) => {
        if (error) {
            const registrationErrors = Object.keys(error.errors).map(key => error.errors[key].message)
 
            req.flash('registrationErrors', registrationErrors)
            return res.redirect('/register')
        }
        res.redirect('/')
    })
}