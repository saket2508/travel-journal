module.exports = function(req, res, next) {
    const { email, username, password } = req.body;
  
    function validEmail(userEmail) {
        // regex for checking if email is valid
      return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
    }

    function validUsername(username){
      // username should be between 3 and 20 characters
      return username.length > 3 && username.length < 20
    }
  
    if (req.path === "/register") {
      console.log(!email.length);
      if (![email, username, password].every(Boolean)) {
        return res.status(401).json({error: "Missing Credentials", success: false});
      } else if (!validEmail(email)) {
        return res.status(401).json({error: "Invalid Email", success: false});
      } else if(!validUsername(username)){
        return res.status(401).json({error: "Invalid Username. Should be between 3 and 20 characters", success: false});
      }
    } else if (req.path === "/login") {
      if (![email, password].every(Boolean)) {
        return res.status(401).json({error: "Missing Credentials", success: false});
      } else if (!validEmail(email)) {
        return res.status(401).json({error: "Invalid Email", success: false});
      }
    }
  
    next();
};