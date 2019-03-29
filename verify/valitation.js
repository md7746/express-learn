module.exports = {
    valitation : (req,res,next)=>{
        if(req.isAuthenticated()){
            next();
        }else{
            req.flash('err_msg',"请先登录");
            res.redirect('/users/login');
        }
    }
}