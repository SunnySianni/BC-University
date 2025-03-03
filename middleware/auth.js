// Authentication middleware
export const requireAuth = (req, res, next) => {
    if (!req.session.studentId) {
        return res.redirect('/students/add?message=Please register first');
    }
    next();
};

// Add student data to response locals
export const addStudentToLocals = async (req, res, next) => {
    res.locals.isAuthenticated = !!req.session.studentId;
    res.locals.studentId = req.session.studentId;
    next();
}; 